# syntax=docker/dockerfile:1.7

# ==============================================================================
# STAGE 1: Build Frontend (Vite static compilation)
# ==============================================================================
FROM node:22.14.0-alpine AS build
WORKDIR /app

# Non-secret build argument untuk base URL API
# Default menggunakan relative path /api agar melalui reverse proxy Nginx
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Copy package manifests untuk layer cache
COPY package.json package-lock.json ./

# Install dependensi frontend
RUN npm ci

# Copy source code dan compile aset statis
COPY . ./
RUN npm run build

# ==============================================================================
# STAGE 2: Production Web Server (Nginx Unprivileged - Non-Root UID 101)
# ==============================================================================
FROM nginxinc/nginx-unprivileged:1.27-alpine-slim AS runtime

LABEL org.opencontainers.image.title="Peartone Frontend" \
      org.opencontainers.image.description="Vite + React SPA served via Nginx"

# Salin konfigurasi Nginx unprivileged
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf

# Salin hasil kompilasi statis dari stage build
COPY --chown=nginx:nginx --from=build /app/dist /usr/share/nginx/html

# Port default nginx-unprivileged adalah 8080
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:8080/ || exit 1

STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]
