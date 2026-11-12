# syntax=docker/dockerfile:1.7

# ==============================================================================
# STAGE 1: Dependencies Cache (deps)
# Mengunduh dan mengompilasi dependency produksi dan migrator
# ==============================================================================
FROM node:22.14.0-bookworm-slim AS deps
WORKDIR /app

# Menginstal dependensi build OS bila dibutuhkan oleh modul native
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package manifests terlebih dahulu untuk memanfaatkan OCI layer caching
COPY package.json package-lock.json ./

# Install SEMUA dependensi (termasuk devDependencies untuk sequelize-cli di migrator)
RUN npm ci --include=dev

# Buat salinan modul produksi bersih (tanpa devDependencies) untuk runtime final
RUN cp -R node_modules /tmp/node_modules_all && \
    npm prune --omit=dev && \
    cp -R node_modules /tmp/node_modules_prod

# ==============================================================================
# STAGE 2: Migrator (Target one-off untuk migrasi database dan seeding)
# ==============================================================================
FROM node:22.14.0-bookworm-slim AS migrator
WORKDIR /app
ENV NODE_ENV=development

# Salin modul lengkap (berisi sequelize-cli) dari stage deps
COPY --from=deps /tmp/node_modules_all ./node_modules
COPY package.json .sequelizerc ./
COPY config ./config
COPY migrations ./migrations
COPY seeders ./seeders
COPY src ./src

# Buat folder storage dummy agar seeder ffprobe tidak gagal jika storage di-mount
RUN mkdir -p storage/audio storage/covers storage/artists

USER node
ENTRYPOINT ["npx", "sequelize-cli"]
CMD ["db:migrate"]

# ==============================================================================
# STAGE 3: Runtime Final (Minimal attack surface, non-root, production hardened)
# ==============================================================================
FROM node:22.14.0-bookworm-slim AS runtime

# Label metadata OCI standar
LABEL org.opencontainers.image.title="Peartone Backend" \
      org.opencontainers.image.description="Music streaming backend service" \
      org.opencontainers.image.authors="Louis <louis@peartone.local>"

# Install dumb-init untuk menangani PID 1 signal forwarding (SIGTERM / SIGINT)
RUN apt-get update && apt-get install -y --no-install-recommends \
    dumb-init \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Atur environment produksi dasar
ENV NODE_ENV=production \
    PORT=3000

# Salin HANYA modul produksi dari stage deps
COPY --chown=node:node --from=deps /tmp/node_modules_prod ./node_modules
COPY --chown=node:node package.json ./
COPY --chown=node:node config ./config
COPY --chown=node:node src ./src

# Siapkan direktori storage stateful dengan ownership user non-root 'node' (UID 1000)
RUN mkdir -p storage/audio storage/covers storage/artists storage/albums && \
    chown -R node:node /app/storage && \
    chmod -R 755 /app/storage

# Deklarasikan volume stateful
VOLUME ["/app/storage"]

# Pindah ke user non-root bawaan Node.js
USER node

# Expose port aplikasi
EXPOSE 3000

# Healthcheck menggunakan endpoint /api/health
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Gunakan exec form dumb-init untuk meneruskan sinyal graceful shutdown ke Node.js
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "src/server.js"]
