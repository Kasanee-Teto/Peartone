# syntax=docker/dockerfile:1.7

# ==============================================================================
# STAGE 1: Dependencies Untuk Migrator (Termasuk devDependencies: sequelize-cli)
# Alasan: Dipisahkan agar stage runtime produksi tidak terkontaminasi paket dev
# ==============================================================================
# Catatan Digest: Ganti/tambahkan @sha256:<digest> hasil `docker inspect` di mesin Anda
FROM node:22.14.0-bookworm-slim AS deps-migrator
WORKDIR /app

COPY package.json package-lock.json ./

# Gunakan --ignore-scripts untuk mencegah postinstall supply-chain attack,
# lalu aktifkan izin eksekusi hanya untuk binary ffprobe/ffmpeg yang dibutuhkan
RUN npm ci --include=dev --ignore-scripts && \
    chmod +x node_modules/@ffprobe-installer/*/ffprobe \
             node_modules/@ffmpeg-installer/*/ffmpeg 2>/dev/null || true

# ==============================================================================
# STAGE 2: Dependencies Produksi Bersih (Hanya dependencies, tanpa devDependencies)
# Alasan: Lebih bersih & deterministik dibanding `cp -R` + `npm prune`
# ==============================================================================
FROM node:22.14.0-bookworm-slim AS deps-prod
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev --ignore-scripts && \
    chmod +x node_modules/@ffprobe-installer/*/ffprobe \
             node_modules/@ffmpeg-installer/*/ffmpeg 2>/dev/null || true && \
    npm cache clean --force

# ==============================================================================
# STAGE 3: Migrator (Target one-off untuk migrasi database dan seeding)
# ==============================================================================
FROM node:22.14.0-bookworm-slim AS migrator

# Hardening OS: tarik patch keamanan Debian terbaru untuk libc6/libssl3/dll
RUN apt-get update && \
    apt-get upgrade -y --no-install-recommends && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

WORKDIR /app
ENV NODE_ENV=development

# Perbaikan A-03: Gunakan --chown=node:node sejak awal agar tidak ada file milik root
COPY --chown=node:node --from=deps-migrator /app/node_modules ./node_modules
COPY --chown=node:node package.json .sequelizerc ./
COPY --chown=node:node config ./config
COPY --chown=node:node migrations ./migrations
COPY --chown=node:node seeders ./seeders
COPY --chown=node:node src ./src

# Perbaikan A-03: Pastikan folder storage dimiliki oleh node:node (UID 1000)
# agar saat volume pertama kali di-mount oleh migrator, kepemilikannya tidak root
RUN mkdir -p storage/audio storage/covers storage/artists storage/albums && \
    chown -R node:node /app/storage && \
    chmod -R 755 /app/storage

USER node
ENTRYPOINT ["npx", "sequelize-cli"]
CMD ["db:migrate"]

# ==============================================================================
# STAGE 4: Runtime Final (Minimal attack surface, non-root, zero curl, hardened)
# ==============================================================================
FROM node:22.14.0-bookworm-slim AS runtime

LABEL org.opencontainers.image.title="Peartone Backend" \
      org.opencontainers.image.version="1.0.1" \
      org.opencontainers.image.description="Hardened music streaming backend service" \
      org.opencontainers.image.authors="Louis <louis@peartone.local>"

# Perbaikan A-01:
# 1. Jalankan apt-get upgrade -y untuk menambal CVE OS Debian yang fixable
# 2. Hanya instal dumb-init (~50 KB); HAPUS curl untuk memangkas puluhan library rentan
RUN apt-get update && \
    apt-get upgrade -y --no-install-recommends && \
    apt-get install -y --no-install-recommends dumb-init && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000

# Salin HANYA node_modules produksi yang sudah bersih
COPY --chown=node:node --from=deps-prod /app/node_modules ./node_modules
COPY --chown=node:node package.json ./
COPY --chown=node:node config ./config
COPY --chown=node:node src ./src

# Siapkan direktori storage stateful dengan ownership user non-root 'node' (UID 1000)
# Perbaikan A-03: Instruksi VOLUME ["/app/storage"] dihapus dari Containerfile
# agar deklarasi volume dikelola secara eksplisit oleh compose.yaml
RUN mkdir -p storage/audio storage/covers storage/artists storage/albums && \
    chown -R node:node /app/storage && \
    chmod -R 755 /app/storage

# Jalankan sebagai non-root user bawaan Node (UID 1000 / GID 1000)
USER node

EXPOSE 3000

# Perbaikan A-01: Healthcheck native Node.js tanpa butuh paket curl/wget eksternal
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/api/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "src/server.js"]
