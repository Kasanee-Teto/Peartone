# 🎤 PeartOne 🎵🎶

PeartOne is a full-stack music streaming web app with authentication, audio streaming, track discovery, playlists, likes, lyrics, listening history, albums, and charts.

This repository contains:
- `client/` — Frontend (React + Vite)
- `backend/` — Backend API (Express + Sequelize)

---

## Tech Stack

### Frontend (`client/`)
- React
- Vite
- React Router
- React Icons

### Backend (`backend/`)
- Node.js + Express
- Sequelize ORM
- JWT Authentication
- Multer (file uploads)
- Static file serving for `/storage`
- DB dialect(s): Postgres 

---

## 20 Features

1. **User authentication** (JWT-based login/register)
2. **Role system** (`admin` / `user`)
3. **User profile fields** (e.g., `location`, `bio`)
4. **Track listing** (browse all tracks)
5. **Track search & filtering** (query-based discovery)
6. **Track details** (track metadata, cover, duration, etc.)
7. **Audio streaming endpoint** (play songs from backend)
8. **Static media hosting** via `/storage` (covers, audio, images)
9. **Artists module** (create/list/search artists)
10. **Artist details** (artist profile and related tracks)
11. **Albums module** (album metadata)
12. **Album → Tracks relationship**
13. **Likes (favorites)** (like/unlike tracks per user)
14. **Playlists (library)** (create and manage playlists)
15. **Playlist track management** (add/remove tracks)
16. **Playlist track counts** (trackNumbers / trackCount patterns)
17. **Lyrics support** (store and fetch lyrics per track)
18. **Listening history** (recently played / history records)
19. **Top charts** (ranking tracks by popularity/listeners)
20. **Admin endpoints** (admin-only operations / management)

> Note: Exact feature names and request/response shapes depend on the routes under `backend/src/routes/`.

---

## Backend Routes (Overview)

Base routes mounted in `backend/src/app.js`:

- `/api/auth`
- `/api/artists`
- `/api/tracks`
- `/api/likes`
- `/api/playlists`
- `/api/lyrics`
- `/api/admin`
- `/api/stream`
- `/api/history`
- `/api/albums`
- `/api/charts`

Static files:
- `/storage/*` → served from `backend/storage`

---

## Database Configuration (Tailored to this repo)

### PostgreSQL
The backend includes Postgres drivers (`pg`, `pg-hstore`).  
To use Postgres, you need a Sequelize config file like `backend/config/config.json`. If you add it, update the config to use `"dialect": "postgres"` and your DB credentials.

---

## Environment Variables (Backend)

See: `backend/.env.example`

Required/minimal:
- `JWT_SECRET=...`
- `PORT=3000`
- `NODE_ENV=development`

Optional (used for JWT claims):
- `JWT_ISSUER=Peartone API`
- `JWT_AUDIENCE=Peartone Client`

---

## Getting Started (Development)

### 1) Clone
```bash
git clone https://github.com/Kasanee-Teto/Peartone.git
cd Peartone
```

### 2) Run Backend
```bash
cd backend
npm install
```

Create your `.env`:
```bash
cp .env.example .env
```

(Optionally generate a random JWT secret)
```bash
npm run jwt-key
```

Run migrations & seeders:
```bash
npm run migrate
npm run seed
```

Start backend:
```bash
npm run dev
# or
npm start
```

Backend usually runs at:
- `http://localhost:3000`

---

### 3) Run Frontend
```bash
cd client
npm install
npm run dev
```

Frontend usually runs at:
- `http://localhost:5173`

---

### 4) Run Both at Once
From `client/`:
```bash
npm run dev:all
```

---

## API Quick Examples

> Base URL (local): `http://localhost:3000/api`

### 1) Login
```bash
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password"}'
```

### 2) Get Tracks
```bash
curl "http://localhost:3000/api/tracks?page=1&limit=10"
```

### 3) Create Playlist (Authenticated)
Replace `<TOKEN>` with your JWT:
```bash
curl -X POST "http://localhost:3000/api/playlists" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"name":"My Playlist","description":"My favorites","isPublic":false}'
```

---

## Reset Migrations & Seeders (Optional)

From `backend/`:

Undo all seeders:
```bash
npx sequelize-cli db:seed:undo:all
```

Undo all migrations:
```bash
npx sequelize-cli db:migrate:undo:all
```

Then re-run:
```bash
npm run migrate
npm run seed
```

---

## Project Structure (High Level)

```
Peartone/
  backend/
    src/
      app.js
      routes/
      controllers/
      services/
      models/
    migrations/
    seeders/
    storage/
    database.sqlite
    .env.example
  client/
    src/
      pages/
      components/
      api/
      hooks/
      styles/
```

---

## Notes

- If the frontend can’t reach the backend, ensure your frontend base URL / proxy is configured to hit `/api/*`.
- Demo tracks may reference media under `backend/storage`. Ensure those files exist to avoid 404 for covers/audio.
