# syntax=docker/dockerfile:1.7

# ==============================================================================
# STAGE 1: Build Frontend (Vite static compilation)
# ==============================================================================
FROM node:22.14.0-alpine AS build
WORKDIR /app

# Non-secret build argument untuk base URL API (relative path via reverse proxy)
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

COPY package.json package-lock.json ./

# Hardening supply-chain: jalankan npm ci dengan --ignore-scripts
RUN npm ci --ignore-scripts

# Salin hanya file yang dibutuhkan untuk build Vite (bukan COPY . . buta)
COPY index.html vite.config.js eslint.config.js ./
COPY public ./public
COPY src ./src

RUN npm run build

# ==============================================================================
# STAGE 2: Production Web Server (Nginx Unprivileged - Non-Root UID 101)
# ==============================================================================
# Catatan Digest: Tambahkan @sha256:<digest> untuk penguncian imutabel
FROM nginxinc/nginx-unprivileged:1.27-alpine-slim AS runtime

LABEL org.opencontainers.image.title="Peartone Frontend" \
      org.opencontainers.image.version="1.0.1" \
      org.opencontainers.image.description="Hardened Vite + React SPA served via Nginx Unprivileged"

# Hardening OS Alpine: naikkan sementara ke root untuk menjalankan apk upgrade
# guna menambal CVE pada libcrypto3/libssl3/musl/nginx, lalu kembali ke UID 101
USER root
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Salin konfigurasi Nginx & hasil build statis dengan kepemilikan nginx (UID 101)
COPY --chown=101:101 nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=101:101 --from=build /app/dist /usr/share/nginx/html

# Kembali ke user non-root bawaan nginx-unprivileged (UID 101)
USER 101

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -fsS --max-time 2 -o /dev/null http://127.0.0.1:8080/ || exit 1

STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]
