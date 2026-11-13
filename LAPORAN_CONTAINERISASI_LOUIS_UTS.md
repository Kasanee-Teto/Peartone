# LAPORAN TEKNIS CONTAINERISASI, AUDIT KEAMANAN, & DEVSECOPS HARDENING
## Proyek: Peartone Music Streaming Web Platform (Versi Hardened `1.0.1`)
**Mata Kuliah:** Pengembangan dan Operasi (SSD-A Sore)  
**Anggota Tim:** Louis (Containerization, Supply-Chain & Security Hardening Specialist)  
**Fokus Evaluasi:** Rubrik Penilaian Kriteria 3 & 4 (Bobot Total: 40 Poin)

---

## 1. RINGKASAN EKSEKUTIF & KEPUTUSAN ARSITEKTUR

Sebagai Container Image Engineer dan DevSecOps Auditor dalam kelompok, fokus tugas mencakup perancangan `Containerfile` / `Dockerfile` multi-stage, konfigurasi `.containerignore` / `.dockerignore`, pemilihan base image berbasis bukti kompatibilitas ABI, audit & remediating kerentanan (`npm audit` & Trivy), *non-root user hardening*, proteksi *read-only root filesystem*, isolasi jaringan dan secret, serta orkestrasi layanan menggunakan Compose.

Pada iterasi **`1.0.1`**, dilakukan audit menyeluruh terhadap konfigurasi awal (`1.0.0`) yang berhasil:
1. Menekan kerentanan dependensi produksi **Backend** (`npm audit --omit=dev`) dari **14 kerentanan (1 Critical, 8 High, 5 Moderate)** menjadi **0 Critical, 0 High, dan 2 Moderate** (*residual risk* pada `uuid` via `sequelize`).
2. Menekan kerentanan dependensi produksi **Frontend** dari **3 High** menjadi **0 kerentanan (`found 0 vulnerabilities`)**.
3. Menghapus *dead dependency* `@huggingface/transformers` (beserta binary C++ `onnxruntime-node`, `sharp`/`libvips`, `adm-zip`, dan `protobufjs`) yang terbukti tidak pernah di-import di `backend/src/`.
4. Menghapus paket `curl` dari image runtime backend (mengeliminasi puluhan pustaka C rentan dan *living-off-the-land binary*) serta mengganti `HEALTHCHECK` menggunakan eksekusi HTTP native Node.js (`node -e "fetch(...)"`).
5. Menambahkan patch keamanan OS (`apt-get upgrade -y` pada Debian Bookworm Slim dan `apk upgrade --no-cache` pada Alpine Unprivileged), proteksi supply-chain `npm ci --ignore-scripts`, serta hardening runtime (`read_only: true`, `cap_drop: [ALL]`, `no-new-privileges:true`, dan pemisahan jaringan `frontend-net` vs `backend-net`).

### Tabel Matriks Keputusan Desain & Hardening

| Area Keputusan | Solusi Terpilih (`v1.0.1`) | Pilihan Alternatif | Rasional Teknis & Keamanan | Trade-Off & Mitigasi |
| :--- | :--- | :--- | :--- | :--- |
| **Backend Base Image** | `node:22.14.0-bookworm-slim` (+ `apt-get upgrade -y`, tanpa `curl`) | `node:22-alpine`, Distroless `nodejs22-debian12`, Chainguard Wolfi | Dependensi pemrosesan durasi audio (`@ffprobe-installer/ffprobe`) membungkus biner ELF x86_64 yang dikompilasi untuk **glibc**. Alpine berbasis **musl libc** sehingga biner native gagal dieksekusi (`ENOENT`/segfault) tanpa emulasi. Distroless tidak memiliki shell `/bin/sh` sehingga menyulitkan demo `docker exec ... id`. Debian Slim menyediakan ABI `glibc` native dan shell POSIX minimal. | Layer `apt-get upgrade -y` menambah ~55.9 MB *unique size* akibat mekanisme *Copy-on-Write* (CoW) di atas base layer (`322 MB`), namun menutup celah CVE OS Debian yang *fixable*. |
| **Frontend Runtime** | `nginxinc/nginx-unprivileged:1.27-alpine-slim` (+ `apk upgrade --no-cache`) | `nginx:alpine` (root), `nginx-unprivileged:bookworm-slim` | Image resmi Nginx unprivileged berjalan secara bawaan sebagai user non-root `nginx` (UID 101) dan listen di port unprivileged `8080`. Karena hanya menyajikan aset statis hasil build Vite (`dist/`) dan melakukan reverse proxy tanpa binary Node.js, Alpine memberikan footprint terkecil (`35.24 MB` total). | Membutuhkan switch sementara ke `USER root` saat build untuk menjalankan `apk upgrade --no-cache`, lalu dikembalikan ke `USER 101`. |
| **Pemisahan Migrator & Runtime** | Multi-target build (`deps-migrator`, `deps-prod`, `migrator`, `runtime`) | Menjalankan migrasi otomatis di entrypoint runtime backend | Runtime produksi tidak memerlukan `sequelize-cli` dan pustaka dev. Menyimpan CLI migrasi di runtime memperbesar attack surface. Target `migrator` (`peartone-migrator:1.0.1`) dijalankan sebagai container *one-off* dan langsung berhenti (`Exited (0)`) setelah skema DB siap. | Diorkestrasi otomatis via Compose `depends_on: { migrate: { condition: service_completed_successfully } }`. |
| **Healthcheck Tanpa `curl`** | Native Node.js `fetch('http://127.0.0.1:3000/api/health')` | Menginstal `curl` via `apt-get install` | Paket `curl` di Debian menarik puluhan shared libraries (`libcurl4`, `libldap`, `libnghttp2`, `libssh2`) yang menyumbang CVE OS dan dapat dipakai penyerang mengunduh payload pasca-eksploitasi. Node.js 22 sudah memiliki API `fetch` bawaan. | Menggunakan exec form `CMD ["node", "-e", "..."]` pada instruksi `HEALTHCHECK`. |
| **User Privileges & Read-Only Rootfs** | Non-root `node` (UID 1000) & `nginx` (UID 101) + `read_only: true` + `cap_drop: [ALL]` | User `root` (UID 0) dan filesystem writable penuh | Mencegah container breakout dan memblokir penulisan backdoor ke `/app` atau `/etc` jika terjadi RCE. Hak tulis hanya diizinkan pada volume `/app/storage` dan `tmpfs` `/tmp`. | Direktori `/var/cache/nginx` dan `/var/run` di frontend wajib dipasang sebagai `tmpfs` milik UID 101. |
| **Segmentasi Jaringan Compose** | Dua bridge network terpisah: `frontend-net` & `backend-net` | Satu network tunggal `peartone-net` untuk semua container | Menerapkan prinsip *least privilege* jaringan: container `frontend` (Nginx) hanya bisa berbicara dengan `backend`, dan **tidak memiliki jalur rute jaringan** ke container `db` (PostgreSQL). | Container `backend` dipasang pada kedua network (`frontend-net` dan `backend-net`) sebagai jembatan aplikasi. |

---

## 2. TOPOLOGI & ARSITEKTUR CONTAINER (`v1.0.1`)

### A. Tabel Layanan, Tag Image, Port, Jaringan, dan Status Data

| Service | Image & Tag Versi | UIDEksekusi | Port Internal | Port Host | Jaringan OCI | Root Filesystem | Mount / Volume Persisten & Tmpfs |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`frontend`** | `peartone-frontend:1.0.1` | `101` (`nginx`) | `8080` | `8080` | `frontend-net` | **Read-Only** | `tmpfs`: `/tmp`, `/var/cache/nginx`, `/var/run` |
| **`backend`** | `peartone-backend:1.0.1` | `1000` (`node`) | `3000` | `3000` (Demo) | `frontend-net`, `backend-net` | **Read-Only** | Volume: `storage_data:/app/storage:Z`<br>`tmpfs`: `/tmp` |
| **`migrate`** | `peartone-migrator:1.0.1` | `1000` (`node`) | None | None | `backend-net` | **Read-Only** | Volume: `storage_data:/app/storage:Z`<br>`tmpfs`: `/tmp` |
| **`db`** | `postgres:17.4-alpine` | `70` (`postgres`) | `5432` | None (Internal) | `backend-net` | Writable data | Volume: `pg_data:/var/lib/postgresql/data:Z` |

### B. Diagram Alur Jaringan Terisolasi & Akses Klien

```
+-----------------------------------------------------------------------------------+
|                               HOST / BROWSER USER                                 |
+-----------------------------------------------------------------------------------+
                                          |
                        HTTP / WebSocket ke Port 8080 (atau API 3000)
                                          v
+-----------------------------------------------------------------------------------+
| NETWORK 1: frontend-net (DMZ / Public-Facing Layer)                               |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | CONTAINER: peartone-frontend (peartone-frontend:1.0.1)                      |  |
|  | - Web Server: Nginx Unprivileged (UID 101, cap_drop: ALL, read_only: true)  |  |
|  | - Sajikan: React 19 + Vite 8 SPA (/usr/share/nginx/html)                    |  |
|  | - TIDAK BISA mengakses peartone-db secara langsung                          |  |
|  +-----------------------------------------------------------------------------+  |
|         |                            |                                |           |
|         | Proxy /api/*               | Proxy /storage/*               | /socket.io|
|         v                            v                                v           |
|  +-----------------------------------------------------------------------------+  |
|  | CONTAINER: peartone-backend (peartone-backend:1.0.1)                        |  |
|  | - Runtime: Node.js 22 Express 5 + Socket.IO (UID 1000, read_only: true)     |  |
|  | - Hardening: cap_drop: ALL, no-new-privileges: true, dumb-init PID 1        |  |
|  | - Healthcheck: Native Node.js fetch('http://127.0.0.1:3000/api/health')     |  |
|  +-----------------------------------------------------------------------------+  |
+---------|--------------------------------------|----------------------------------+
          |                                      |
          | Terhubung ke NETWORK 2: backend-net  | Baca / Tulis File Audio & Covers
          v                                      v
+-----------------------------------------+   +-------------------------------------+
| NETWORK 2: backend-net (Internal Only)  |   | VOLUME: storage_data                |
|                                         |   | - /app/storage/audio                |
|  +-----------------------------------+  |   | - /app/storage/covers               |
|  | CONTAINER: peartone-db            |  |   | - /app/storage/artists              |
|  | - Image: postgres:17.4-alpine     |  |   | - Dimiliki oleh node:node (1000)    |
|  | - Port 5432 tertutup dari host    |  |   +-------------------------------------+
|  +-----------------------------------+  |                      ^
|                    ^                    |                      |
|                    | Migrasi & Seed     |                      |
|  +-----------------------------------+  |----------------------+
|  | CONTAINER: peartone-migrator      |  |
|  | - Image: peartone-migrator:1.0.1  |  |
|  | - Status: Exited (0) usai migrasi |  |
|  +-----------------------------------+  |
+-----------------------------------------+
```

---

## 3. EVALUASI PILIHAN BASE IMAGE & AUDIT SUPPLY-CHAIN

### A. Perbandingan 4 Kandidat Base Image Runtime Backend

| Kriteria Evaluasi | 1. `node:22.14.0-bookworm-slim` *(Terpilih)* | 2. `node:22.14.0-alpine` | 3. `gcr.io/distroless/nodejs22-debian12:nonroot` | 4. `cgr.dev/chainguard/node:latest` (Wolfi) |
| :--- | :--- | :--- | :--- | :--- |
| **Ukuran Base Image (Docker Desktop Store)** | **322 MB** (`SHARED SIZE` terukur di `docker system df -v`) | **224.48 MB** (Terukur di `docker system df -v`) | Lebih kecil dari `bookworm-slim` (tanpa `apt`/`bash`) | Mirip `distroless`, berbasis `glibc` Wolfi OS |
| **Kompatibilitas Binary `@ffprobe-installer`** | **100% Kompatibel (`glibc` native).** Binary ELF Linux x64 berjalan langsung tanpa error. | **Tidak Kompatibel Langsung (`musl libc`).** Binary ELF `glibc` gagal (`spawn ENOENT`) kecuali dipasang `gcompat` atau diubah ke `ffmpeg` APK. | **100% Kompatibel (`glibc` native).** | **100% Kompatibel (`glibc` native).** |
| **Ketersediaan Shell & Utilitas Inspeksi** | **Ada** (`/bin/sh`, `id`, `find`). Mendukung penuh pengujian rubrik dosen (`docker exec`). | **Ada** (`/bin/sh` Ash, `id`, `find`). | **Tidak Ada Shell (`/bin/sh` absen).** `docker exec peartone-backend id` gagal dijalankan saat demo. | Varian `:latest` tidak memiliki shell; tag versi spesifik (`:22`) berbayar di Chainguard. |
| **Kemudahan Non-Root** | Bawaan `USER node` (`UID 1000`). | Bawaan `USER node` (`UID 1000`). | Bawaan `USER nonroot` (`UID 65532`). | Bawaan `USER nonroot` (`UID 65532`). |
| **Keputusan Audit** | **DIREKOMENDASIKAN & DIPILIH** (dengan `apt-get upgrade -y` dan penghapusan `curl`). | Dipakai hanya untuk **Stage 1 Build Frontend** (`vite build`). | Tidak dipilih agar tidak menghambat demo verifikasi `docker exec` dosen/Jessica. | Tidak dipilih karena pembatasan tag `:latest` pada tier gratis. |

---

## 4. AUDIT KERENTANAN, TRIAGE, & REMEDIASI (`v1.0.0` vs `v1.0.1`)

### A. Standar Kebijakan Keamanan (Security Gate)
Klaim *"nol mutlak kerentanan"* pada image berbasis distribusi Linux umum sering kali tidak jujur karena setiap distro memiliki advisori tingkat rendah (`LOW`/`MEDIUM`) yang ditandai maintainer sebagai `will_not_fix` (tidak relevan di container atau belum ada patch upstream). Oleh karena itu, standar audit yang kami terapkan adalah:
1. **Zero Fixable Critical & High Vulnerabilities** pada dependensi aplikasi (`npm audit --omit=dev`) maupun paket OS.
2. **Penghapusan Paket Tidak Terpakai (*Dead Dependencies* & *LOLBins*)**, bukan sekadar menyembunyikan temuan dengan `.trivyignore`.
3. **Dokumentasi *Residual Risk*** yang transparan untuk setiap temuan yang belum memiliki patch non-breaking.

### B. Tabel Triage & Remediasi Dependensi Produksi (`npm audit --omit=dev`)

#### 1. Backend (`backend/package-lock.json`)
- **Kondisi Awal (`v1.0.0`):** **14 Kerentanan** (**1 CRITICAL, 8 HIGH, 5 MODERATE**).
- **Kondisi Akhir (`v1.0.1`):** **0 CRITICAL, 0 HIGH, 2 MODERATE** (`uuid` via `sequelize`).

| ID Advisory (GHSA / CVE) | Paket & Versi Awal (`v1.0.0`) | Severity | Reachable di Peartone? | Tindakan Remediasi pada `v1.0.1` | Status Akhir (`v1.0.1`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GHSA-jqcg-44mw-7w3h` | `proxy-addr@2.0.7` (via `express`) | **CRITICAL** | **Ya** (Resolusi `req.ip` di belakang reverse proxy Nginx) | Di-upgrade via `npm audit fix` ke **`2.0.8`** | **FIXED (Closed)** |
| `GHSA-wc9g-mqfw-jrwm` (+5 CVE DoS/bypass lain) | `multer@2.2.0` | **HIGH** | **Ya** (Endpoint upload lagu & cover di `upload.middleware.js`) | Di-upgrade via `npm audit fix` ke **`2.5.0`** | **FIXED (Closed)** |
| `GHSA-27r3-jxmh-p828`, `GHSA-v422-hmwv-36x6` | `body-parser@2.2.2` (via `express`) | **HIGH** | **Ya** (`app.use(express.json())` di semua request POST/PUT) | Di-upgrade via `npm audit fix` ke **`2.4.0`** | **FIXED (Closed)** |
| `GHSA-2gc4-cqfq-p2gv` | `engine.io@6.6.9` (via `socket.io`) | **HIGH** | **Ya** (Transport WebSocket real-time listener count) | Di-upgrade via `npm audit fix` ke **`6.6.11`** | **FIXED (Closed)** |
| `GHSA-2m8v-j782-fhvr` | `socket.io-parser@4.2.6` | **HIGH** | **Ya** (Parser frame Socket.IO) | Di-upgrade via `npm audit fix` ke **`4.2.7`** | **FIXED (Closed)** |
| `GHSA-f88m-g3jw-g9cj` (`CVE-2026-33327` dkk.), `GHSA-rgj7-g3m4-5g8c`, `GHSA-wq5f-xc86-pv6w` | `sharp@0.34.5` (via `@huggingface/transformers@4.2.0`) | **HIGH** | **Tidak Reachable** (Terbukti `grep` menghasilkan 0 import di `backend/src/`) | Dihapus total dengan `npm uninstall @huggingface/transformers` | **REMOVED (Eliminated)** |
| `GHSA-xcpc-8h2w-3j85`, `GHSA-rcw4-f5rp-g42v` (+6 CVE ZIP bomb/overwrite) | `adm-zip@0.5.18` & `onnxruntime-node@1.24.3` (via `@huggingface/transformers`) | **HIGH** | **Tidak Reachable** (Hanya ditarik oleh `@huggingface/transformers`) | Dihapus total dengan `npm uninstall @huggingface/transformers` | **REMOVED (Eliminated)** |
| `GHSA-j3f2-48v5-ccww` | `protobufjs@7.6.4` (via `onnxruntime-web`) | **MODERATE** | **Tidak Reachable** (Hanya ditarik oleh `@huggingface/transformers`) | Dihapus total dengan `npm uninstall @huggingface/transformers` | **REMOVED (Eliminated)** |
| `GHSA-x5fp-wj9c-mxmx`, `GHSA-4mjr-xmp4-gh2g`, `GHSA-6pq8-jhm2-2vcw` | `qs@6.15.3` (via `express`) | **MODERATE** | **Ya** (Query string parser Express) | Di-upgrade via `npm audit fix` ke **`6.17.1`** | **FIXED (Closed)** |
| `GHSA-4p3w-j4w9-5jqw` | `moment@2.30.1` (via `sequelize`) | **MODERATE** | **Tidak Reachable** (Tidak memanggil `moment.locale()` dari input user) | Di-upgrade via `npm audit fix` ke **`2.31.0`** | **FIXED (Closed)** |
| `GHSA-w5hq-g745-h8pq` | `uuid@8.3.2` (via `sequelize@6.37.8`) | **MODERATE** | **Tidak Reachable** (Hanya terjadi pada `uuid.v3/v5/v6` dengan custom buffer; Peartone memakai `crypto.randomUUID()` native) | **Diterima sebagai Residual Risk** (Menjalankan `npm audit fix --force` akan men-downgrade `sequelize` ke `3.30.0` dan merusak aplikasi) | **ACCEPTED (Residual Risk)** |

#### 2. Frontend (`frontend/package-lock.json`)
- **Kondisi Awal (`v1.0.0`):** **3 Kerentanan HIGH**.
- **Kondisi Akhir (`v1.0.1`):** **0 Kerentanan (`found 0 vulnerabilities`)**.

| ID Advisory (GHSA / CVE) | Paket & Versi Awal (`v1.0.0`) | Severity | Reachable di Peartone? | Tindakan Remediasi pada `v1.0.1` | Status Akhir (`v1.0.1`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GHSA-qwww-vcr4-c8h2` | `react-router@7.18.1` & `react-router-dom@7.18.1` | **HIGH** | **Tidak Reachable** (Khusus mode RSC, sedangkan Peartone adalah CSR SPA statis) | Di-upgrade via `npm audit fix` ke **`7.18.5`** | **FIXED (Closed)** |
| `GHSA-2m8v-j782-fhvr` | `socket.io-parser@4.2.6` (via `socket.io-client`) | **HIGH** | **Ya** (Klien WebSocket di browser) | Di-upgrade via `npm audit fix` ke **`4.2.7`** | **FIXED (Closed)** |

---

### C. Register Risiko Tersisa (Residual Risk Register)

| Komponen / ID | Severity | Alasan Teknis Tidak Diperbaiki Langsung | Mitigasi Berlapis (Defense-in-Depth) | Jadwal Tinjau Ulang |
| :--- | :--- | :--- | :--- | :--- |
| **`uuid@8.3.2` via `sequelize@6.37.8`** (`GHSA-w5hq-g745-h8pq`) | **MODERATE** | Perbaikan otomatis mengharuskan downgrade breaking ke `sequelize@3.30.0`. Fungsi yang rentan tidak pernah dipanggil di kode Peartone. | Validasi format UUID pada database PostgreSQL dan penggunaan `crypto.randomUUID()` native Node.js. | Setiap 30 hari / saat rilis Sequelize v7 stabil. |
| **Paket OS Debian 12 (`bookworm-slim`) berstatus `will_not_fix`** | **LOW / MEDIUM** | Maintainer Debian Security menetapkan status `no-dsa` / `will_not_fix` pada beberapa paket dasar (`glibc`, `systemd`, `coreutils`) yang tidak dapat dieksploitasi tanpa akses lokal. | Eksekusi non-root (`UID 1000`), `read_only: true` rootfs, `cap_drop: [ALL]`, `no-new-privileges:true`, dan penghapusan `curl`. | Setiap 14 hari melalui rebuild `apt-get upgrade -y`. |
| **Binary `gosu` pada `postgres:17.4-alpine`** | **MEDIUM / HIGH** | Terbawa dari image resmi PostgreSQL untuk menurunkan privilege saat container start (`docker-entrypoint.sh`). Tidak pernah menerima koneksi jaringan. | Database diisolasi di `backend-net` tanpa publish port 5432 ke host luar, ditambah `no-new-privileges:true`. | Setiap 30 hari / saat pembaruan tag `postgres:17.x-alpine`. |
| **Binary Statis `@ffprobe-installer` & `@ffmpeg-installer`** | **Supply-Chain Risk** | Dibundel sebagai binary ELF statis di `node_modules` demi kompatibilitas lintas-OS anggota tim. | Endpoint upload dibatasi hanya untuk Admin terautentikasi JWT, filter MIME Multer ketat, batas 50 MB, serta proses berjalan sebagai `UID 1000` di rootfs `read_only`. | Sebelum rilis produksi berikutnya (migrasi ke `/usr/bin/ffprobe` paket OS Debian). |

---

## 5. BENCHMARK UKURAN IMAGE & ANALISIS LAYER OCI (DATA RIIL `docker system df -v`)

Pengukuran dilakukan secara langsung menggunakan `docker system df -v` dan Docker Desktop (*containerd image store*, yang menghitung ukuran *unpacked*beserta pemisahan `SHARED SIZE` dan `UNIQUE SIZE`):

### A. Tabel Hasil Pengukuran Aktual (`v1.0.0` vs `v1.0.1`)

| Nama Image & Tag | Image ID | Total Size | Shared Size (Base Image) | Unique Size (Layer Aplikasi + Patch OS) | Status Container |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`peartone-backend:1.0.1`** *(Hardened)* | `560e6d7c87ab` | **653.34 MB** (`653MB`) | `322 MB` | `331.3 MB` | `Up (healthy)` (`54dc5ee9db60`) |
| **`peartone-migrator:1.0.1`** *(Hardened)* | `b7bd9540ef8d` | **669.25 MB** (`669MB`) | `322 MB` | `347.2 MB` | `Exited (0)` (`1f674c5981d7`) |
| **`peartone-frontend:1.0.1`** *(Hardened)* | `b11a1479b6f7` | **35.24 MB** (`35.2MB`) | `19.43 MB` | `15.81 MB` | `Up (healthy)` (`f8f4d512e8aa`) |
| `peartone-stack-backend:latest` *(Sebelum Upgrade OS)* | `c49e102e9204` | **597.42 MB** (`597MB`) | `322 MB` | `275.4 MB` | Digantikan oleh `1.0.1` |
| `peartone-stack-migrate:latest` *(Sebelum Upgrade OS)* | `40c277325510` | **596.64 MB** (`597MB`) | `322 MB` | `274.6 MB` | Digantikan oleh `1.0.1` |
| `peartone-stack-frontend:latest` *(Sebelum Upgrade OS)* | `f8052b21f957` | **20.99 MB** (`21MB`) | `19.43 MB` | `1.563 MB` | Digantikan oleh `1.0.1` |
| `postgres:17.4-alpine` *(Database)* | `7062a2109c4b` | **398.40 MB** (`398MB`) | `12.15 MB` | `386.3 MB` | `Up (healthy)` (`f6d69c71279a`) |
| `node:22.14.0-alpine` *(Stage Build Frontend)* | `9bef0ef1e268` | **224.48 MB** (`224MB`) | `12.15 MB` | `212.3 MB` | Hanya dipakai saat build (0 MB di runtime `peartone-frontend`) |

### B. Analisis Teknis: Trade-Off Keamanan vs Ukuran Layer (*Copy-on-Write Overhead*)
1. **Efisiensi Multi-Stage Frontend (`224.48 MB` -> `35.24 MB`, Reduksi ~84.3%):**
   Stage `build` menggunakan `node:22.14.0-alpine` (`224.48 MB`) ditambah `node_modules` Vite/React. Dengan multi-stage build, seluruh runtime Node.js dan kompiler Vite dibuang, sehingga image `peartone-frontend:1.0.1` hanya berukuran **`35.24 MB`**.
2. **Mengapa `apt-get upgrade -y` dan `apk upgrade --no-cache` Menambah `Unique Size` (+55.9 MB di Backend & +14.25 MB di Frontend)?**
   - Dalam arsitektur OCI/Docker, layer base image (`SHARED SIZE: 322 MB` pada `node:22.14.0-bookworm-slim` dan `19.43 MB` pada `nginx-unprivileged:1.27-alpine-slim`) bersifat **immutable (append-only)**.
   - Ketika instruksi `RUN apt-get update && apt-get upgrade -y` atau `RUN apk update && apk upgrade --no-cache` memperbarui pustaka inti (`libc6`, `libssl3`, `libcrypto3`, `musl`, `nginx`, `systemd`) untuk menambal celah keamanan, file lama di layer dasar tidak terhapus secara fisik dari blok `SHARED SIZE`, melainkan file versi baru ditulis sebagai layer delta di `UNIQUE SIZE` (`275.4 MB` -> `331.3 MB` pada backend; `1.56 MB` -> `15.81 MB` pada frontend).
   - Penambahan beberapa puluh megabyte ini adalah konsekuensi sadar dan terukur demi mendapatkan pustaka sistem yang telah ter-patch dari CVE terbaru.
3. **Berbagi Layer Dasar (`SHARED SIZE: 322 MB`):**
   Perhatikan bahwa `peartone-backend:1.0.1` dan `peartone-migrator:1.0.1` berbagi `SHARED SIZE` sebesar **`322 MB`** yang sama persis di disk host, sehingga penyimpanan aktual tidak terduplikasi penuh.

---

## 6. ANALISIS 9 KENDALA TEKNIS (GOTCHA) & RESOLUSI DEVSECOPS

1. **`NODE_ENV=production` vs PostgreSQL Lokal (SSL Error)**
   - *Masalah:* Konfigurasi `config/config.json` pada blok `production` mewajibkan koneksi SSL (`ssl.require=true`), sedangkan container PostgreSQL lokal tidak mengaktifkan SSL secara default.
   - *Solusi:* Menyetel `NODE_ENV: ${NODE_ENV:-development}` di `compose.yaml` dan mengarahkan koneksi ke `DATABASE_DEV_URL` untuk pengujian lokal tanpa merusak konfigurasi SSL produksi.
2. **Crash Startup Akibat `GOOGLE_CLIENT_ID` Kosong**
   - *Masalah:* Strategi `passport-google-oauth20` melempar fatal exception `TypeError: OAuth2Strategy requires a clientID option` saat startup jika variabel lingkungan kosong.
   - *Solusi:* Menyediakan nilai fallback placeholder aman pada `compose.yaml` sehingga server dapat menyala untuk pengujian endpoint non-OAuth.
3. **`sequelize-cli` Hilang di Runtime Produksi**
   - *Masalah:* Instalasi produksi (`npm ci --omit=dev`) membuang `devDependencies` tempat `sequelize-cli` berada.
   - *Solusi:* Memisahkan stage `deps-migrator` dan target `migrator` (`peartone-migrator:1.0.1`) yang berjalan satu kali (*one-off*) sebelum `backend` menyala.
4. **Inkompatibilitas Biner Native `ffprobe` pada Alpine (`musl`) vs Debian (`glibc`)**
   - *Masalah:* Paket `@ffprobe-installer/linux-x64` membungkus biner ELF yang ditautkan ke `glibc`. Pada Alpine (`musl`), eksekusi gagal dengan `spawn ENOENT`.
   - *Solusi:* Memilih `node:22.14.0-bookworm-slim` (Debian 12) yang menyediakan `glibc` native.
5. **Proteksi Supply-Chain `--ignore-scripts` vs Permission Biner `ffprobe`**
   - *Masalah:* Menjalankan `npm ci --ignore-scripts` mencegah eksekusi script *postinstall* berbahaya, tetapi juga melewati script pemberi izin eksekusi pada biner `@ffprobe-installer`.
   - *Solusi:* Menggabungkan `npm ci --omit=dev --ignore-scripts` dengan `chmod +x node_modules/@ffprobe-installer/*/ffprobe` secara eksplisit di dalam `Containerfile`.
6. **Sinkronisasi Ownership Volume `/app/storage` antara `migrator` dan `backend`**
   - *Masalah:* Pada konfigurasi awal, stage `migrator` membuat direktori `storage/` sebagai `root` sebelum pindah ke `USER node`, berisiko menginisialisasi volume `storage_data` dengan pemilik `root`.
   - *Solusi:* Seluruh instruksi `COPY` dan `RUN mkdir -p storage/...` pada stage `migrator` maupun `runtime` kini menggunakan `--chown=node:node` (`UID 1000`), serta menghapus deklarasi `VOLUME ["/app/storage"]` liar dari dalam `Containerfile`.
7. **Eliminasi `curl` dari Runtime Backend untuk Memangkas CVE OS**
   - *Masalah:* Menginstal `curl` hanya demi `HEALTHCHECK` menarik puluhan pustaka C rentan dan memberi penyerang tool unduh payload.
   - *Solusi:* Menghapus `curl` dan mengganti `HEALTHCHECK` dengan one-liner native Node.js: `CMD ["node", "-e", "fetch('http://127.0.0.1:3000/api/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]`.
8. **Kompatibilitas `read_only: true` pada Nginx Unprivileged**
   - *Masalah:* Saat root filesystem dikunci dengan `read_only: true`, worker Nginx gagal start karena perlu menulis file cache dan PID ke `/var/cache/nginx` dan `/var/run`.
   - *Solusi:* Memasang `tmpfs` khusus di `compose.yaml` dengan opsi `uid=101,gid=101,mode=755` pada `/var/cache/nginx`, `/var/run`, dan `/tmp`.
9. **Eliminasi Dead Dependency `@huggingface/transformers`**
   - *Masalah:* Pustaka `@huggingface/transformers` terdaftar di `backend/package.json` namun 0 kali di-import di `backend/src/`, serta menarik `onnxruntime-node`, `sharp`, `adm-zip`, dan `protobufjs` yang menyumbang 8 CVE High/Moderate.
   - *Solusi:* Menghapus `@huggingface/transformers` dan menjalankan `npm audit fix`, menurunkan temuan High/Critical npm menjadi **0**.

---

## 7. MATRIKS VERIFIKASI PENGUJIAN RUBRIK 3 & 4 (`v1.0.1`)

| Kriteria Penilaian | Perintah Verifikasi Operasional | Bukti / Respons Aktual (`v1.0.1`) | Status |
| :--- | :--- | :--- | :--- |
| **Kriteria 3 & 4: Tag Versi & Build Multi-Stage** | `docker system df -v` | Image ter-tag rapi: `peartone-backend:1.0.1` (`560e6d7c87ab`), `peartone-migrator:1.0.1` (`b7bd9540ef8d`), `peartone-frontend:1.0.1` (`b11a1479b6f7`). | **TERBUKTI** |
| **Kriteria 3: Siklus Hidup & Healthcheck** | `docker compose ps` | `peartone-db` (`Up, healthy`), `peartone-migrator` (`Exited (0)`), `peartone-backend` (`Up, healthy`), `peartone-frontend` (`Up, healthy`). | **TERBUKTI** |
| **Kriteria 4: Non-Root Execution** | `docker exec peartone-backend id`<br>`docker exec peartone-frontend id` | Backend: `uid=1000(node) gid=1000(node)`<br>Frontend: `uid=101(nginx) gid=101(nginx)` | **TERBUKTI** |
| **Kriteria 4: Read-Only Root Filesystem** | `docker exec peartone-backend sh -c "touch /app/hack.js"` | Ditolak kernel: `touch: cannot touch '/app/hack.js': Read-only file system` | **TERBUKTI** |
| **Kriteria 4: Writable Volume `/app/storage`** | `docker exec peartone-backend sh -c "touch /app/storage/audio/.test && rm /app/storage/audio/.test"` | Berhasil ditulis dan dihapus oleh user `node` (`UID 1000`). | **TERBUKTI** |
| **Kriteria 4: Audit Secret & History** | `docker history --no-trunc peartone-backend:1.0.1 \| grep -iE 'jwt_secret\|password'` | Output kosong. Tidak ada secret tertanam pada layer image. | **TERBUKTI** |
| **Kriteria 4: Proteksi File `.env`** | `docker run --rm --entrypoint find peartone-backend:1.0.1 /app -name ".env*"` | Output kosong. File `.env` host terblokir oleh `.containerignore`. | **TERBUKTI** |
| **Kriteria 4: Remediasi CVE Aplikasi (`npm audit`)** | `npm audit --omit=dev` (Backend & Frontend) | Backend: **0 Critical, 0 High** (turun dari 1 Critical, 8 High).<br>Frontend: **0 vulnerabilities** (turun dari 3 High). | **TERBUKTI** |
| **Kriteria 3: Streaming Audio HTTP 206** | `curl -s -I -H "Range: bytes=0-1023" http://localhost:8080/api/stream/tracks/e2cf4d12-0b65-4f1c-9df9-84d6c1f1c932` | Mengembalikan `HTTP/1.1 206 Partial Content` dan header `Content-Range`. | **TERBUKTI** |

---

## 8. NASKAH PRESENTASI VIDEO (DURASI ±2.5 MENIT — LOUIS)

- **[00:00 - 00:40] Pembukaan & Pemilihan Base Image Berbasis Bukti:**  
  *"Halo semuanya dan Pak Dosen. Saya Louis, bertanggung jawab pada Containerization dan Security Hardening untuk proyek Peartone sesuai Kriteria 3 dan 4. Untuk backend, kami memilih base image `node:22.14.0-bookworm-slim` dibanding Alpine karena pemrosesan durasi audio kami menggunakan binary ELF `ffprobe` yang terkompilasi terhadap `glibc` native. Sedangkan untuk frontend, kami menggunakan multi-stage build: kompilasi React 19 dan Vite 8 dilakukan di stage `build`, lalu hasil statisnya disajikan oleh `nginxinc/nginx-unprivileged:1.27-alpine-slim` yang hanya berukuran 35,2 MB."*

- **[00:41 - 01:35] Audit Kerentanan, Triage, & Supply-Chain Hardening:**  
  *"Kami melakukan audit keamanan terukur menggunakan Trivy dan `npm audit --omit=dev`. Kami tidak mengklaim 'nol vulnerability' secara buta karena distribusi Linux selalu memiliki advisori tingkat rendah berstatus `will_not_fix`. Standar yang kami terapkan adalah **Zero Fixable Critical and High Vulnerabilities**. Dari audit awal, kami menemukan 14 kerentanan di backend dan 3 di frontend. Kami melakukan tiga langkah perbaikan pada versi `1.0.1`: pertama, menghapus dependensi `@huggingface/transformers` yang terbukti tidak pernah di-import di source code namun menarik `onnxruntime` dan `sharp`; kedua, menjalankan `npm audit fix` sehingga kerentanan Critical dan High pada `proxy-addr`, `multer`, `socket.io`, dan `react-router` turun menjadi **nol**; ketiga, menambahkan `apt-get upgrade -y` dan `apk upgrade`, memasang flag `--ignore-scripts`, serta menghapus paket `curl` dari runtime backend dengan mengganti healthcheck menggunakan `node` fetch native."*

- **[01:36 - 02:20] Non-Root, Read-Only Rootfs, Tanpa Secret, & Segmentasi Jaringan:**  
  *"Untuk memenuhi penuh Kriteria 4, seluruh container berjalan sebagai non-root: backend sebagai `node` UID 1000 dan frontend sebagai `nginx` UID 101. Kami juga menerapkan `read_only: true` pada root filesystem, mencabut seluruh Linux capabilities dengan `cap_drop: ALL`, mengaktifkan `no-new-privileges`, dan memisahkan network `frontend-net` dari `backend-net` agar Nginx tidak dapat mengakses database PostgreSQL secara langsung. Tidak ada secret yang disimpan di dalam image, dan seluruh image telah diberi tag versi `1.0.1` untuk di-push ke registry."*

---

## 9. PANDUAN SERAH TERIMA (HANDOFF CHECKLIST) KE GILBERT & JESSICA

### A. Checklist untuk Gilbert (Registry, Tagging, Push & Pull — Kriteria 4)
- **Tag Versi Terbaru:** Gunakan versi **`1.0.1`** (hasil audit dan hardening).
- **Daftar Image Lokal yang Siap Di-tag & Di-push:**
  - `peartone-backend:1.0.1` (Image ID: `560e6d7c87ab`, Size: `653.34 MB`)
  - `peartone-migrator:1.0.1` (Image ID: `b7bd9540ef8d`, Size: `669.25 MB`)
  - `peartone-frontend:1.0.1` (Image ID: `b11a1479b6f7`, Size: `35.24 MB`)
- **Urutan Perintah Eksekusi:**
  ```bash
  # 1. Tagging ke Docker Hub / GHCR:
  docker tag peartone-backend:1.0.1 docker.io/<username>/peartone-backend:1.0.1
  docker tag peartone-migrator:1.0.1 docker.io/<username>/peartone-migrator:1.0.1
  docker tag peartone-frontend:1.0.1 docker.io/<username>/peartone-frontend:1.0.1

  # 2. Push ke Registry:
  docker login
  docker push docker.io/<username>/peartone-backend:1.0.1
  docker push docker.io/<username>/peartone-migrator:1.0.1
  docker push docker.io/<username>/peartone-frontend:1.0.1

  # 3. Verifikasi Pull & Ambil Digest (@sha256) untuk Bukti Kriteria 4:
  docker pull docker.io/<username>/peartone-backend:1.0.1
  docker inspect --format='{{index .RepoDigests 0}}' docker.io/<username>/peartone-backend:1.0.1
  ```

### B. Checklist untuk Jessica (Testing, Operasional & Demo)
- **Perubahan Perintah Uji (Penting):**
  1. **`curl` sudah dihapus dari dalam container `peartone-backend`** untuk menghilangkan CVE OS. Saat mendemokan uji endpoint API (`/api/health`, `/api/tracks`, `/api/stream/tracks/:id`), jalankan `curl` dari terminal **host** ke `http://localhost:8080/...` atau `http://localhost:3000/...`.
  2. **Demo Keamanan Filesystem (`read_only: true`):** Tunjukkan bahwa perintah `docker exec peartone-backend touch /app/test.txt` langsung ditolak dengan pesan `Read-only file system`, sedangkan penulisan ke volume `/app/storage` tetap diizinkan untuk upload lagu.
  3. **Isolasi Jaringan:** Tunjukkan pada `compose.yaml` bahwa `frontend` berada di `frontend-net` dan tidak memiliki akses langsung ke `peartone-db` di `backend-net`.
  4. **Sinkronisasi Lockfile:** Pastikan direktori kerja (`D:\Github\Peartone` / `E:\Peartone`) menggunakan `backend/package.json`, `backend/package-lock.json`, dan `frontend/package-lock.json` terbaru yang sudah bebas dari `@huggingface/transformers` dan CVE Critical/High.
