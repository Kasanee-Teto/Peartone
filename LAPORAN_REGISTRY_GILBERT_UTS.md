# LAPORAN TEKNIS MANAJEMEN IMAGE REGISTRY, VERSION TAGGING & PACKAGING
## Proyek: Peartone Music Streaming Web Platform
**Mata Kuliah:** Pengembangan dan Operasi (SSD-A Sore)  
**Anggota Tim:** Gilbert (`gungil06` - Registry Management, Release Versioning, Documentation & Packaging Specialist)  
**Fokus Evaluasi:** Pemberian Tag Versi Image, Push & Pull Registry (`docker.io/gungil06`), Pembuktian Eksekusi Image Hasil Pull, Penyusunan README, dan Pengemasan Source Code (ZIP)

---

## 1. RINGKASAN TUGAS & STANDAR PENAMAAN IMAGE (OCI NAMING CONVENTION)

Seluruh image aplikasi Peartone diberi tag versi semantik (`1.0.1`) serta `latest`, lalu didistribusikan ke **Docker Hub Container Registry (`docker.io/gungil06`)** menggunakan Podman CLI.

| Komponen Layanan | Target Stage | Local Compose Tag | Registry URI (Versioned `1.0.1`) | Registry URI (`latest`) |
| :--- | :--- | :--- | :--- | :--- |
| **Backend API & Socket.IO** | `runtime` | `peartone-backend:1.0.1` | `docker.io/gungil06/peartone-backend:1.0.1` | `docker.io/gungil06/peartone-backend:latest` |
| **Database Migrator & Seeder** | `migrator` | `peartone-migrator:1.0.1` | `docker.io/gungil06/peartone-migrator:1.0.1` | `docker.io/gungil06/peartone-migrator:latest` |
| **Frontend SPA + Nginx Proxy** | `runtime` | `peartone-frontend:1.0.1` | `docker.io/gungil06/peartone-frontend:1.0.1` | `docker.io/gungil06/peartone-frontend:latest` |

---

## 2. TAHAPAN PELAKSANAAN & BUKTI VERIFIKASI

### Tahap 1: Pemberian Tag Versi & Push ke Docker Hub Registry (`docker.io/gungil06`)
```powershell
podman tag ghcr.io/kasanee-teto/peartone-migrator:1.0.1 docker.io/gungil06/peartone-migrator:1.0.1
podman tag ghcr.io/kasanee-teto/peartone-migrator:1.0.1 docker.io/gungil06/peartone-migrator:latest

podman tag ghcr.io/kasanee-teto/peartone-backend:1.0.1 docker.io/gungil06/peartone-backend:1.0.1
podman tag ghcr.io/kasanee-teto/peartone-backend:1.0.1 docker.io/gungil06/peartone-backend:latest

podman tag ghcr.io/kasanee-teto/peartone-frontend:1.0.1 docker.io/gungil06/peartone-frontend:1.0.1
podman tag ghcr.io/kasanee-teto/peartone-frontend:1.0.1 docker.io/gungil06/peartone-frontend:latest

podman images

podman login docker.io
podman push docker.io/gungil06/peartone-migrator:1.0.1
podman push docker.io/gungil06/peartone-migrator:latest
podman push docker.io/gungil06/peartone-backend:1.0.1
podman push docker.io/gungil06/peartone-backend:latest
podman push docker.io/gungil06/peartone-frontend:1.0.1
podman push docker.io/gungil06/peartone-frontend:latest
```

### Tahap 2: Hapus Image Lokal & Pull Ulang dari Registry (`podman rmi` & `podman pull`)
Menghapus seluruh salinan image lokal terlebih dahulu lalu mengunduh ulang (`podman pull`) dari `docker.io/gungil06` untuk membuktikan portabilitas penuh:
```powershell
podman rmi -f ghcr.io/kasanee-teto/peartone-migrator:1.0.1 ghcr.io/kasanee-teto/peartone-backend:1.0.1 ghcr.io/kasanee-teto/peartone-frontend:1.0.1
podman rmi -f docker.io/gungil06/peartone-migrator:1.0.1 docker.io/gungil06/peartone-migrator:latest
podman rmi -f docker.io/gungil06/peartone-backend:1.0.1 docker.io/gungil06/peartone-backend:latest
podman rmi -f docker.io/gungil06/peartone-frontend:1.0.1 docker.io/gungil06/peartone-frontend:latest

podman pull docker.io/gungil06/peartone-migrator:1.0.1
podman pull docker.io/gungil06/peartone-backend:1.0.1
podman pull docker.io/gungil06/peartone-frontend:1.0.1

podman images
```

### Tahap 3: Pembuktian Aplikasi Berjalan dari Image Hasil Pull (`compose.registry.yaml`)
Untuk membuktikan bahwa aplikasi berjalan 100% dari image hasil pull tanpa proses build lokal, digunakan berkas [`compose.registry.yaml`](compose.registry.yaml) yang **tidak memiliki blok `build:`** sama sekali dan langsung mereferensikan `image: docker.io/gungil06/peartone-*:1.0.1`:
```powershell
podman compose -f compose.registry.yaml up -d
podman compose -f compose.registry.yaml run --rm migrate db:seed:all
podman ps
curl.exe http://localhost:3000/api/health
curl.exe http://localhost:8080/api/health
curl.exe http://localhost:8080/api/tracks
```

### Tahap 4: Penyusunan README & Pengemasan ZIP
1. **Dokumentasi [`README.md`](README.md):** Memuat arsitektur container, langkah build, tagging versi `1.0.1`, push/pull `docker.io/gungil06`, serta cara menjalankan aplikasi dari image hasil pull.
2. **Pengemasan Source Code & Berkas Pendukung ke ZIP:**
   - `Peartone-UTS.zip` (Arsip lengkap mencakup source code, `Containerfile`, `compose.yaml`, `compose.registry.yaml`, `.github/workflows/build-images.yml`, `README.md`, laporan teknis, dan aset media).
   - `Peartone-UTS-SourceOnly.zip` (Arsip ringan tanpa berkas audio MP3 berukuran besar, disiapkan apabila portal pengumpulan memiliki batas ukuran unggahan).

---

## 3. NASKAH PRESENTASI VIDEO (DURASI ±2 MENIT - GILBERT)

- **[00:00 - 00:35] Pembukaan, Tagging Versi & Push ke Docker Hub (`docker.io/gungil06`):**  
  *"Halo Pak Dosen dan rekan-rekan, saya Gilbert. Pada proyek Peartone ini, saya bertanggung jawab atas pemberian tag versi pada image, proses push dan pull dari Container Registry, pembuktian bahwa aplikasi dapat berjalan dari image hasil pull, penyusunan panduan di README, serta pengemasan seluruh source code ke dalam ZIP. Untuk versioning, kami menerapkan semantic tag `1.0.1` dan `latest` pada ketiga service kami di bawah namespace Docker Hub saya: `docker.io/gungil06/peartone-migrator:1.0.1`, `peartone-backend:1.0.1`, dan `peartone-frontend:1.0.1`, lalu mengunggahnya menggunakan `podman push`."*

- **[00:36 - 01:20] Proses Pull dari Registry & Pembuktian Aplikasi Berjalan:**  
  *"Untuk membuktikan bahwa aplikasi berjalan murni dari image registry tanpa bergantung pada build lokal, saya menghapus seluruh image lokal dengan `podman rmi`, lalu menjalankan `podman pull` untuk mengunduh image `docker.io/gungil06/peartone-migrator:1.0.1`, `backend:1.0.1`, dan `frontend:1.0.1`. Setelah terunduh dan terlihat di `podman images`, saya menjalankan stack menggunakan berkas `compose.registry.yaml` yang khusus hanya memanggil `image:` dari `docker.io/gungil06` tanpa instruksi `build:`. Terlihat pada `podman ps` bahwa seluruh container berstatus `Up`, endpoint `/api/health` merespons status `healthy`, dan aplikasi Peartone dapat digunakan di browser pada `http://localhost:8080`."*

- **[01:21 - 02:00] Dokumentasi README & Pengemasan ZIP:**  
  *"Seluruh langkah build, pemberian tag versi, push dan pull registry, serta cara menjalankan container telah saya dokumentasikan secara terstruktur di dalam `README.md`. Terakhir, seluruh kode sumber aplikasi beserta berkas pendukungnya seperti `Containerfile`, `compose.yaml`, `compose.registry.yaml`, dan laporan teknis telah saya gabungkan ke dalam arsip `Peartone-UTS.zip` yang bersih dari folder `node_modules` dan siap dikumpulkan. Terima kasih."*
