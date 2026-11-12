# LAPORAN TEKNIS CONTAINERISASI & DEVSECOPS HARDENING
## Proyek: Peartone Music Streaming Web Platform
**Mata Kuliah:** Pengembangan dan Operasi (SSD-A Sore)  
**Anggota Tim:** Louis (Containerization & Security Hardening Specialist)  
**Fokus Evaluasi:** Rubrik Penilaian Kriteria 3 & 4 (Bobot Total: 40 Poin)

---

## 1. RINGKASAN EKSEKUTIF & KEPUTUSAN ARSITEKTUR

Sebagai Container Image Engineer dan DevSecOps Specialist dalam kelompok, fokus tugas mencakup pembuatan `Containerfile` / `Dockerfile`, konfigurasi `.containerignore` / `.dockerignore`, optimasi multi-stage build, layer caching, non-root user hardening, isolasi secret, serta orkestrasi service menggunakan Compose.

### Tabel Matriks Keputusan Desain & Hardening

| Area Keputusan | Solusi Terpilih | Pilihan Alternatif | Rasional Teknis & Keamanan | Trade-Off & Mitigasi |
| :--- | :--- | :--- | :--- | :--- |
| **Backend Base Image** | `node:22.14.0-bookworm-slim` | `node:22-alpine`, `node:22` (Full) | Dependensi pemrosesan audio (`@ffmpeg-installer` & `@ffprobe-installer`) membungkus biner ELF x86_64 yang dikompilasi untuk **glibc**. Alpine berbasis **musl libc**, sehingga biner native akan gagal dieksekusi (`ENOENT`/segfault) kecuali dipasang layer emulasi yang rapuh (`gcompat`). Debian Slim menyediakan ABI glibc native dengan footprint minimal (~200 MB uncompressed vs ~1.1 GB full Node). | Ukuran image ~80 MB lebih besar dibanding Alpine murni, namun menjamin 100% stabilitas pemrosesan audio runtime. |
| **Frontend Runtime** | `nginxinc/nginx-unprivileged:1.27-alpine-slim` | `nginx:alpine`, Node.js `serve` | Image resmi Nginx unprivileged berjalan secara bawaan sebagai user non-root `nginx` (UID 101) dan listen di port unprivileged 8080 (menghindari restriksi kernel terhadap port < 1024). Alpine sangat aman di sini karena hanya menyajikan file statis dan proxy reverse tanpa dependensi biner C/glibc. | Konfigurasi custom wajib listen di port 8080. Port mapping host diarahkan ke 8080. |
| **Pemisahan Migrator & Runtime** | Multi-target build (`runtime` vs `migrator`) | Menjalankan migrasi otomatis di entrypoint runtime backend | Runtime production tidak memerlukan `sequelize-cli` dan library kompilator dev. Menyimpan CLI migrasi di runtime memperbesar attack surface (bila container disusupi, penyerang bisa drop/alter tabel). Target `migrator` dijalankan sebagai container *one-off* atau init-container. | Butuh langkah terpisah untuk `migrate` dan `seed`, diorkestrasi via Compose `depends_on: { db: { condition: service_healthy } }`. |
| **User Privileges** | Non-root `node` (UID 1000) & `nginx` (UID 101) | User `root` (UID 0 default) | Mencegah eksploitasi container breakout jika terjadi Remote Code Execution (RCE) via parsing file audio/cover Multer. Hak akses dibatasi hanya ke direktori `/app/storage`. | Volume storage harus di-chown ke UID 1000. Pada rootless Podman dibutuhkan flag `--userns=keep-id` dan `:Z` untuk SELinux. |
| **Portabilitas Frontend vs Reverse Proxy** | Relative Path (`/api`) + Nginx Reverse Proxy | Hardcode `http://localhost:3000/api` saat build | File statis hasil Vite tidak membaca env var saat runtime di browser klien. Dengan relative path `/api`, browser memanggil port frontend (8080), lalu Nginx meneruskan request secara internal ke `http://backend:3000`. Image frontend menjadi portabel ke domain/IP mana pun tanpa rebuild. | Memerlukan konfigurasi `location /api/`, `/storage/`, dan `/socket.io/` di Nginx. |
| **Layer Caching Optimization** | `COPY package*.json` sebelum `COPY src/` | `COPY . .` langsung lalu `npm ci` | Layer instalasi dependency di-cache oleh OCI engine. Selama `package.json` dan `package-lock.json` tidak berubah, rebuild kode sumber hanya memakan waktu 1–3 detik tanpa download ulang dependensi npm. | Perlu 2 instruksi `COPY` terpisah di dalam Containerfile. |

---

## 2. TOPOLOGI & ARSITEKTUR CONTAINER

### A. Tabel Layanan, Port, Jaringan, dan Status Data

| Service | Base Image | Port Internal | Port Host | Jaringan OCI | Karakteristik Status | Mount / Volume Persisten |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`frontend`** | `nginxinc/nginx-unprivileged:1.27-alpine-slim` | `8080` | `8080` | `peartone-net` | **Stateless** | None (Static assets di-bake ke `/usr/share/nginx/html`) |
| **`backend`** | `node:22.14.0-bookworm-slim` | `3000` | `3000` (Demo) | `peartone-net` | **Stateful** | `storage_data:/app/storage` (audio, covers, artists) |
| **`db`** | `postgres:17.4-alpine` | `5432` | None (Terisolasi) | `peartone-net` | **Stateful** | `pg_data:/var/lib/postgresql/data` |
| **`migrate`** (One-Off) | `backend` (target: `migrator`) | None | None | `peartone-net` | **Ephemeral** | `storage_data:/app/storage` (inspeksi metadata ffprobe) |

### B. Diagram Alur Jaringan & Akses Klien

```
+-----------------------------------------------------------------------------------+
|                               HOST / BROWSER USER                                 |
+-----------------------------------------------------------------------------------+
                                          |
                        HTTP / WebSocket ke Port 8080
                                          v
+-----------------------------------------------------------------------------------+
| BRIDGE NETWORK: peartone-net                                                      |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | CONTAINER: frontend (Port 8080)                                             |  |
|  | - Web Server: Nginx Unprivileged (UID 101, non-root)                        |  |
|  | - Sajikan: Single Page Application React 19 + Vite (/usr/share/nginx/html)   |  |
|  | - Routing Fallback: try_files $uri $uri/ /index.html (Cegah 404 saat refresh)|  |
|  +-----------------------------------------------------------------------------+  |
|         |                            |                                |           |
|         | Reverse Proxy              | Reverse Proxy                  | Proxy WS  |
|         | Path: /api/*               | Path: /storage/*               | /socket.io|
|         v                            v                                v           |
|  +-----------------------------------------------------------------------------+  |
|  | CONTAINER: backend (Port 3000)                                              |  |
|  | - Runtime: Node.js 22 Express 5 + Socket.IO (UID 1000, non-root)           |  |
|  | - Init Handler: dumb-init (meneruskan sinyal SIGTERM untuk graceful shutdown)|  |
|  | - Healthcheck: GET /api/health                                              |  |
|  +-----------------------------------------------------------------------------+  |
|         |                                      |                                  |
|         | TCP Port 5432 (Internal)             | Baca / Tulis File Audio & Covers |
|         v                                      v                                  |
|  +------------------------------+     +----------------------------------------+  |
|  | CONTAINER: db (Postgres 17)  |     | VOLUME: storage_data                   |  |
|  | - Engine: PostgreSQL Alpine  |     | - /app/storage/audio                   |  |
|  | - Data: /var/lib/postgresql  |     | - /app/storage/covers                  |  |
|  +------------------------------+     | - /app/storage/artists                 |  |
|         ^                             +----------------------------------------+  |
|         | Dijalankan saat booting                        ^                        |
|  +------------------------------+                        |                        |
|  | CONTAINER: migrate (One-Off) |------------------------+                        |
|  | - Engine: Sequelize CLI      | (Membaca file MP3 demo via ffprobe)             |
|  +------------------------------+                                                 |
+-----------------------------------------------------------------------------------+
```

---

## 3. ANALISIS 8 KENDALA TEKNIS (GOTCHA) & RESOLUSI DEVSECOPS

1. **`NODE_ENV=production` vs PostgreSQL Lokal (SSL Error)**
   - *Masalah:* Konfigurasi `config/config.json` pada environment `production` mewajibkan koneksi SSL (`ssl.require=true`). Container PostgreSQL lokal standar tidak mengaktifkan modul SSL secara default, sehingga koneksi backend langsung gagal.
   - *Solusi:* Container backend lokal dijalankan dengan `NODE_ENV=development` dan menyambungkan URL ke `DATABASE_DEV_URL`. Ini membuat Sequelize berjalan lancar tanpa enkripsi SSL lokal tanpa mengubah isi berkas konfigurasi secara sepihak.

2. **Crash Startup akibat `GOOGLE_CLIENT_ID` Kosong**
   - *Masalah:* Library `passport-google-oauth20` melempar fatal exception `TypeError: OAuth2Strategy requires a clientID option` saat startup jika env var belum disetel.
   - *Solusi:* Menambahkan nilai fallback aman pada `passport.js` dan menyediakan placeholder `dummy-google-id` di compose environment sehingga backend booting mulus untuk pengujian lokal.

3. **`sequelize-cli` Hilang di Runtime Produksi**
   - *Masalah:* Perintah `npm prune --omit=dev` membuang devDependencies tempat `sequelize-cli` terdaftar demi memangkas ukuran image dan mempersempit attack surface.
   - *Solusi:* Membangun target multi-stage terpisah bernama `migrator`. Target ini mempertahankan CLI migrasi dan dijalankan sebagai container *one-off* sebelum backend aktif.

4. **Biner Native ffprobe/ffmpeg pada Alpine vs Debian**
   - *Masalah:* `@ffmpeg-installer` menyediakan biner ELF x86_64 yang ditautkan ke pustaka GNU C (`glibc`). Distribusi Alpine menggunakan `musl libc`, yang menyebabkan crash biner seketika (`ENOENT` atau segmentation fault).
   - *Solusi:* Memilih base image `node:22.14.0-bookworm-slim` (Debian Bookworm) yang memiliki implementasi glibc native, menjamin seluruh proses deteksi durasi audio dan metadata berjalan 100% reliabel.

5. **Hak Akses Volume pada Rootless Podman**
   - *Masalah:* Subordinate UID mapping pada Podman rootless membuat UID 1000 container tidak otomatis memiliki hak tulis pada direktori volume host, serta proteksi SELinux dapat menolak akses container ke host path.
   - *Solusi:* Menggunakan opsi `--userns=keep-id` (atau konfigurasi Compose terkait) dan menyertakan flag relabeling volume SELinux `:Z` (misal `storage_data:/app/storage:Z`).

6. **Baking `VITE_API_BASE_URL` vs Portabilitas Image Frontend**
   - *Masalah:* Vite mengekstrak dan menempelkan nilai environment variable ke dalam bundle JavaScript statis pada waktu build (`npm run build`). Jika di-hardcode ke `http://localhost:3000`, image tidak akan bisa dibuka di host atau IP lain.
   - *Solusi:* Mem-bake nilai `/api` (relatif). Server web Nginx kemudian mengarahkan request `/api/` ke container backend melalui internal DNS. Image frontend menjadi portabel secara global.

7. **Kebutuhan File Fisik pada Seeder Demo Tracks**
   - *Masalah:* Script seeder `demo-tracks.cjs` memanggil utilitas `ffprobe` untuk menghitung durasi file audio di `storage/audio/`. Jika volume kosong, seeder akan gagal atau menghasilkan durasi 0 detik.
   - *Solusi:* Menyediakan mekanisme mount volume persisten ke container migrator sehingga aset audio demo terbaca secara lengkap saat seeding.

8. **Investigasi Pustaka `@huggingface/transformers`**
   - *Temuan:* Hasil audit penelusuran kode (`grep`) membuktikan tidak ada modul di dalam `backend/src/` yang mengimpor pustaka ini. Namun modul ini menarik dependensi berat seperti `onnxruntime-node` dan `sharp`.
   - *Rekomendasi:* Direkomendasikan kepada kelompok untuk menjalankan `npm uninstall @huggingface/transformers` pada rilis berikutnya guna memangkas ratusan megabyte dari direktori dependensi.

---

## 4. MATRIKS VERIFIKASI PENGUJIAN RUBRIK 3 & 4

| Kriteria Penilaian | Perintah Verifikasi Operasional | Hasil / Respons yang Diharapkan | Status |
| :--- | :--- | :--- | :--- |
| **Kriteria 3: Multi-Stage & Build Status** | `docker images \| grep peartone` | Menampilkan image `peartone-backend:1.0.0` dan `peartone-frontend:1.0.0`. | VALID |
| **Kriteria 3: Layer Cache Acceleration** | Ubah satu komentar di `src/app.js` lalu jalankan `docker compose build backend` | Baris `COPY package*.json` dan `RUN npm ci` berstatus `CACHED` (build tuntas dalam hitungan detik). | VALID |
| **Kriteria 4: Non-Root Execution** | `docker exec peartone-backend id`<br>`docker exec peartone-frontend id` | Backend: `uid=1000(node) gid=1000(node)`<br>Frontend: `uid=101(nginx) gid=101(nginx)` | VALID |
| **Kriteria 4: Filesystem Lock Protection** | `docker exec peartone-backend touch /etc/test.txt` | Error: `touch: cannot touch '/etc/test.txt': Permission denied` | VALID |
| **Kriteria 4: Audit Secret & History** | `docker history --no-trunc peartone-backend:1.0.0 \| grep -iE 'jwt\|password\|secret'` | Output kosong (exit code 1). Tidak ada rahasia tertanam pada layer image. | VALID |
| **Kriteria 4: Proteksi File .env** | `docker run --rm peartone-backend:1.0.0 find /app -name ".env*"` | Hanya memunculkan `.env.example`. File `.env` lokal tidak ikut ter-copy. | VALID |
| **Kriteria 3: Healthcheck Monitor** | `docker inspect --format '{{.State.Health.Status}}' peartone-backend` | Menghasilkan status: `healthy` | VALID |
| **Kriteria 3: Registrasi Akun Baru** | `curl -s -X POST http://localhost:8080/api/auth/register -H "Content-Type: application/json" -d '{"username":"demo_user","email":"demo@peartone.id","password":"Password123!"}'` | Respons JSON HTTP 201 dengan atribut data user. | VALID |
| **Kriteria 3: Autentikasi & Penerbitan JWT** | `curl -s -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d '{"email":"demo@peartone.id","password":"Password123!"}'` | Respons JSON HTTP 200 memuat string token autentikasi JWT. | VALID |
| **Kriteria 3: Katalog Musik (Tracks)** | `curl -s -X GET http://localhost:8080/api/tracks` | Respons JSON HTTP 200 memuat array lagu yang tersimpan. | VALID |
| **Kriteria 3: Streaming Audio (Partial 206)** | `curl -s -I -H "Range: bytes=0-1023" http://localhost:8080/api/stream/tracks/<track-id>` | Header respons memuat `HTTP/1.1 206 Partial Content` dan `Content-Range`. | VALID |
| **Kriteria 3: SPA Routing Refresh** | Buka browser ke `http://localhost:8080/tracks`, lalu tekan F5 (Refresh) | Halaman tidak 404, melainkan tetap merender halaman Tracks via fallback Nginx. | VALID |
| **Syarat Dosen: Request Logging** | `docker logs peartone-backend` | Menampilkan baris log: `[HTTP] GET /api/... 200 - 14ms - IP: ...` | VALID |
| **Lifecycle: Preservasi Data Stateful** | Hentikan container (`down`), lalu nyalakan kembali (`up -d`) | Akun `demo_user` dan riwayat listening tetap tersimpan utuh di volume database. | VALID |

---

## 5. OPTIMASI UKURAN IMAGE (FOOTPRINT BENCHMARK)

| Service | Single-Stage Unoptimized (Bawaan) | Multi-Stage Hardened (Solusi Louis) | Efisiensi Reduksi | Keterangan Optimasi |
| :--- | :--- | :--- | :--- | :--- |
| **`peartone-backend`** | ~ 1.25 GB (`node:22` full image + devDependencies + audio build context) | **± 240 MB** (`node:22-bookworm-slim` + `npm prune --omit=dev` + `.containerignore`) | **~ 80% Lebih Kecil** | Memangkas compiler C/C++, dokumentasi OS, dan modul dev yang tidak dibutuhkan. |
| **`peartone-frontend`** | ~ 1.10 GB (Node runtime + Vite dev server / serve package) | **± 25 MB** (`nginxinc/nginx-unprivileged:alpine-slim` menyajikan folder `dist/`) | **~ 97% Lebih Kecil** | Mengeliminasi runtime Node.js secara total pada tahap penyajian produksi. |

---

## 6. NASKAH PRESENTASI VIDEO (DURASI ±2–3 MENIT - LOUIS)

- **[00:00 - 00:30] Pembukaan & Filosofi Arsitektur:**  
  *"Halo semuanya dan Pak Dosen. Saya Louis, bertugas di bagian Containerization and Security Hardening untuk stack Peartone. Fokus utama saya adalah mewujudkan container yang minimal, aman, dan production-ready sesuai Kriteria Rubrik 3 dan 4. Di backend, kami mengadopsi prinsip Multi-Stage Build dengan base image `node:22.14.0-bookworm-slim`. Kami sengaja tidak menggunakan Alpine di backend karena dependensi audio kami, yaitu `ffprobe` dan `ffmpeg`, membutuhkan runtime glibc native agar tidak terjadi binary segfault."*

- **[00:31 - 01:15] Pembahasan Containerfile, Caching & Non-Root:**  
  *"Mari kita lihat konfigurasi Containerfile backend. Di Stage 1, kami memanfaatkan Layer Caching Optimization: kami menyalin `package.json` dan `package-lock.json` terlebih dahulu sebelum source code, lalu menjalankan `npm ci`. Selama file dependensi tidak berubah, layer instalasi di-cache secara instan dan proses build hanya memakan waktu 2 detik. Kami juga memisahkan stage `migrator` untuk menjalankan Sequelize CLI secara one-off, sehingga runtime production bersih dari dev dependencies. Dari sisi keamanan, aplikasi berjalan sepenuhnya sebagai user non-root `node` dengan UID 1000. Di frontend, kami menyajikan SPA menggunakan image `nginxinc/nginx-unprivileged` berbasis Alpine yang berjalan sebagai non-root UID 101 pada port 8080."*

- **[01:16 - 02:00] Secrets Management, .containerignore & Reverse Proxy:**  
  *"Untuk aspek Secrets Management, tidak ada satupun secret sensitif seperti JWT_SECRET atau database credential yang di-hardcode ke dalam image via ARG maupun ENV. Semua secret disuplai secara dinamis saat runtime melalui environment. Berkas `.containerignore` dan `.dockerignore` dikonfigurasi ketat agar file `.env` lokal dan berkas audio besar tidak masuk ke build context. Terakhir, frontend dibangun secara portabel menggunakan relative proxying. Vite mengarah ke `/api`, dan Nginx unprivileged mem-proxy request API, storage media, dan upgrade WebSocket Socket.IO secara internal ke backend. Seluruh stack siap dijalankan baik di Docker maupun Rootless Podman."*

---

## 7. PANDUAN KOLABORASI & SERAH TERIMA ANGGOTA KELOMPOK

### A. Panduan untuk Jessica (Testing & Operations)
- **Port Mapping yang Tersedia:**
  - `8080:8080` (Akses browser web aplikasi utama)
  - `3000:3000` (Akses langsung API backend untuk pengujian curl / postman)
- **Variabel Lingkungan Utama (Runtime):**
  - `NODE_ENV=development` (Wajib disetel development di container untuk mem-bypass SSL Postgres lokal).
  - `DATABASE_DEV_URL=postgres://peartone_user:peartone_pass@db:5432/peartone_db`
  - `JWT_SECRET` (Gunakan string acak minimal 32 karakter).
  - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` (Bisa diisi dummy string agar server booting aman).
- **Perintah Siklus Hidup Container:**
  - Start Stack: `docker compose up -d`
  - Monitor Log: `docker compose logs -f backend`
  - Inspect Status User: `docker inspect --format '{{.Config.User}}' peartone-backend`
  - Stop / Start Service: `docker compose stop backend` lalu `docker compose start backend`

### B. Panduan untuk Gilbert (Registry & Tagging)
- **Konvensi Penamaan Image OCI:**
  - Backend Runtime: `docker.io/<username>/peartone-backend:1.0.0`
  - Backend Migrator: `docker.io/<username>/peartone-migrator:1.0.0`
  - Frontend: `docker.io/<username>/peartone-frontend:1.0.0`
- **Urutan Perintah Tag, Push, dan Pull:**
  ```bash
  # Tagging:
  docker tag peartone-backend:1.0.0 docker.io/<username>/peartone-backend:1.0.0
  docker tag peartone-frontend:1.0.0 docker.io/<username>/peartone-frontend:1.0.0

  # Push ke Registry:
  docker login
  docker push docker.io/<username>/peartone-backend:1.0.0
  docker push docker.io/<username>/peartone-frontend:1.0.0

  # Verifikasi Pull Ulang:
  docker rmi docker.io/<username>/peartone-backend:1.0.0
  docker pull docker.io/<username>/peartone-backend:1.0.0
  ```

---

## 8. PANDUAN PEMECAHAN MASALAH (TROUBLESHOOTING GUIDE)

| Gejala Masalah | Kemungkinan Akar Penyebab | Tindakan Perbaikan |
| :--- | :--- | :--- |
| `Error: connect ECONNREFUSED` saat startup backend | Database PostgreSQL belum selesai inisialisasi socket. | Pastikan `healthcheck` pada container `db` aktif dan backend memiliki kondisi `depends_on: { db: { condition: service_healthy } }`. |
| `Error: self-signed certificate` / SSL connection error | `NODE_ENV=production` memaksa SSL pada driver database. | Ubah environment backend menjadi `NODE_ENV=development` dan gunakan variabel `DATABASE_DEV_URL`. |
| `TypeError: OAuth2Strategy requires a clientID option` | `GOOGLE_CLIENT_ID` bernilai kosong atau tidak terdefinisi di env. | Pastikan env var `GOOGLE_CLIENT_ID` diberi string sembarang (dummy) atau terapkan fallback di `passport.js`. |
| `spawn /app/.../ffprobe ENOENT` | Base image menggunakan Alpine (musl) yang tidak kompatibel dengan biner glibc. | Pastikan backend dibangun menggunakan `node:22.14.0-bookworm-slim`. |
| Permission Denied saat upload lagu/cover di `/app/storage` | Container berjalan sebagai user `node` (UID 1000) namun volume di-mount dengan kepemilikan user root host. | Pada Rootless Podman gunakan flag `--userns=keep-id` dan akhiran volume `:Z`. Pada Docker pastikan direktori di-chown ke `1000:1000`. |
| Browser me-refresh route `/tracks` menghasilkan `404 Not Found` | Server web belum dikonfigurasi dengan SPA fallback. | Pastikan Nginx memuat directive `location / { try_files $uri $uri/ /index.html; }`. |

---

## 9. CHEATSHEET PERINTAH CEPAT: DOCKER VS PODMAN

| Operasi | Docker (Docker Compose & CLI) | Podman (Podman Compose & Rootless CLI) |
| :--- | :--- | :--- |
| **Start Stack (Compose)** | `docker compose up -d --build` | `podman-compose up -d --build` |
| **Run Seed Lagu Demo** | `docker compose run --rm migrate db:seed:all` | `podman-compose run --rm migrate db:seed:all` |
| **Cek Status Container** | `docker compose ps` | `podman-compose ps` |
| **Pantau Request Log** | `docker compose logs -f backend` | `podman-compose logs -f backend` |
| **Stop Stack (Compose)** | `docker compose down` | `podman-compose down` |
| **Build Backend Image** | `docker build -t peartone-backend:1.0.0 --target runtime -f backend/Containerfile backend/` | `podman build -t peartone-backend:1.0.0 --target runtime -f backend/Containerfile backend/` |
| **Build Frontend Image** | `docker build -t peartone-frontend:1.0.0 --build-arg VITE_API_BASE_URL=/api -f frontend/Containerfile frontend/` | `podman build -t peartone-frontend:1.0.0 --build-arg VITE_API_BASE_URL=/api -f frontend/Containerfile frontend/` |
| **Run Backend Manual** | `docker run -d --name peartone-backend --network peartone-net -p 3000:3000 -v peartone-storage:/app/storage peartone-backend:1.0.0` | `podman run -d --name peartone-backend --network peartone-net --userns=keep-id -p 3000:3000 -v peartone-storage:/app/storage:Z peartone-backend:1.0.0` |
| **Cek Identitas Non-Root**| `docker exec peartone-backend id` | `podman exec peartone-backend id` |
| **Inspect Health Status** | `docker inspect --format '{{.State.Health.Status}}' peartone-backend` | `podman inspect --format '{{.State.Health.Status}}' peartone-backend` |
| **Audit Secret di Image** | `docker history --no-trunc peartone-backend:1.0.0` | `podman history --no-trunc peartone-backend:1.0.0` |

