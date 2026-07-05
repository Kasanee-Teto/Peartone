<div align="center">

<p>
  <img src="https://img.shields.io/badge/Node.js-Backend-43853D?logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-5.2.1-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/React-19.2.5-61DAFB?logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Vite-8.1.3-646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL">
</p>

<p>
  <img src="https://img.shields.io/badge/Sequelize-6.37.8-52B0E7?logo=sequelize&logoColor=white" alt="Sequelize">
  <img src="https://img.shields.io/badge/Socket.IO-4.8.3-010101?logo=socketdotio&logoColor=white" alt="Socket.IO">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.3.1-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Auth-JWT_+_Google_OAuth-4285F4?logo=google&logoColor=white" alt="JWT and Google OAuth">
  <img src="https://img.shields.io/badge/License-ISC-22C55E?logo=opensourceinitiative&logoColor=white" alt="ISC License">
</p>

# ✨ PeartOne

### Full-stack music streaming web app with authentication, audio streaming, playlists, likes, lyrics, listening history, albums, charts, and admin management.

</div>

---

## 🎬 Demo Video

Watch the demo here:

https://1drv.ms/v/c/8df62f32701f73be/IQBRhvar8OCrQ4s_TqyDHMg-AV5mnY4urcLIIURVGLb2Jfs?e=91tonE

---

## 🚀 Why PeartOne

PeartOne is a full-stack music platform built to demonstrate a modern streaming-style web application. It combines a React frontend, an Express API, PostgreSQL persistence, Sequelize models, JWT authentication, Google OAuth, media uploads, audio streaming, playlist management, and realtime listener updates.

It is designed as a practical portfolio project for learning how frontend, backend, database, authentication, file handling, and realtime features work together in one application.

<br>

- ⚡ Browse, search, and stream tracks from a backend API
- 🔐 Login, register, profile management, JWT auth, and Google OAuth
- 🎵 Manage artists, albums, tracks, lyrics, playlists, likes, and listening history
- 📊 Show top charts and listener-based popularity data
- 🛠️ Admin-only track upload and management with protected routes

---

## 🎯 Features

### A) Core Music Features

1. **Track discovery** — browse tracks, search tracks, and open track details.
2. **Audio streaming** — stream song files from backend endpoints.
3. **Artists and albums** — organize tracks by artist and album metadata.
4. **Lyrics support** — fetch lyrics for tracks, with admin-controlled lyric updates.
5. **Top charts** — rank tracks by popularity and listener activity.

### B) User Features

6. **Authentication** — register, login, logout, and view/update profile data.
7. **Google OAuth** — sign in through Google using Passport.
8. **Likes / favorites** — like, unlike, toggle, and list favorite tracks.
9. **Playlists** — create, view, delete, add tracks, remove tracks, and reorder playlists.
10. **Listening history** — add, list, and clear recently played tracks.

### C) Admin & Platform Features

11. **Role-based access** — separate normal user and admin permissions.
12. **Admin track management** — upload, list, and delete tracks.
13. **Media uploads** — handle track files, cover images, and artist images.
14. **Static storage serving** — expose media files from the backend storage directory.
15. **Realtime listener updates** — broadcast updated listener counts with Socket.IO.

---

## 🔴 Realtime Implementation

PeartOne uses Socket.IO on top of the Express HTTP server. When a client emits a `track-finished` event with a `trackId`, the backend increments the track listener count and broadcasts a `listeners-updated` event to connected clients.

### Live Use Cases

1. **Track listener count updates**  
   When users finish a track, the backend updates the listener count and emits the latest number.

2. **Charts and popularity signals**  
   Listener counts can support ranking, chart display, and popularity-based discovery.

3. **Frontend reactive UI**  
   Connected frontend clients can listen for realtime updates and refresh visible track metadata.

### Realtime Architecture

```txt
Frontend player event
→ Socket.IO client emits track-finished
→ Express + Socket.IO server receives event
→ Sequelize updates Track.listeners
→ Backend emits listeners-updated
→ Frontend receives update
→ UI refreshes listener count / popularity data
```

---

## 🧠 Architecture Highlights

- **Frontend and backend are separated** into `frontend/` and `backend/`.
- **Backend uses Express** for REST endpoints and HTTP middleware.
- **Sequelize ORM** manages PostgreSQL models, migrations, and seeders.
- **JWT middleware** protects authenticated routes.
- **Admin middleware** protects admin-only actions.
- **Multer middleware** handles uploads for tracks and images.
- **Socket.IO** adds realtime listener updates.
- **Static media serving** exposes uploaded files through `/storage`.

---

## 💡 Design Considerations

- Keep public browsing endpoints separate from authenticated user actions.
- Use admin-only middleware for destructive or upload-related operations.
- Store secrets and deployment-specific values in environment variables.
- Keep media files out of normal JSON responses and serve them through storage paths.
- Use Sequelize migrations and seeders to keep database setup repeatable.
- Keep frontend API configuration in Vite environment variables.

---

## 🔧 Processing Models

### 🔄 Server-Side Flow

1. The request enters Express through a mounted `/api/*` route.
2. Middleware validates authentication, role access, JSON body, or uploaded files.
3. Controllers call model/service logic through Sequelize models.
4. The backend returns JSON data or streams media files back to the client.

### ⚡ Client-Side Flow

1. React pages and components call the configured API base URL.
2. Authenticated requests include the user token when required.
3. The UI renders tracks, playlists, likes, lyrics, albums, and history.
4. Socket.IO listens for realtime listener updates and updates visible state.

---

## 🏗️ Architecture & Stack

### Frontend (`frontend/`)

- React 19
- Vite 8
- React Router
- React Icons
- Socket.IO Client
- Tailwind CSS
- ESLint

### Backend (`backend/`)

- Node.js
- Express 5
- Sequelize 6
- PostgreSQL
- JWT authentication
- Passport + Google OAuth
- Multer file uploads
- Socket.IO
- FFmpeg / FFprobe utilities
- dotenv, CORS, bcryptjs

### Database

- PostgreSQL
- Sequelize CLI migrations
- Sequelize seeders
- Environment-based database URLs:
  - `DATABASE_DEV_URL` for development
  - `DATABASE_URL` for production

---

## 📦 Main Dependencies

### Frontend

- `react`
- `react-dom`
- `react-router-dom`
- `react-icons`
- `socket.io-client`
- `vite`
- `tailwindcss`

### Backend

- `express`
- `sequelize`
- `pg`
- `jsonwebtoken`
- `passport`
- `passport-google-oauth20`
- `multer`
- `socket.io`
- `bcryptjs`
- `fluent-ffmpeg`

---

## 📁 Project Structure

```txt
Peartone/
├── backend/
│   ├── config/
│   │   └── config.json
│   ├── migrations/
│   ├── seeders/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   └── routes/
│   ├── storage/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── styles/
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

Create `backend/.env` from `backend/.env.example`.

```env
JWT_SECRET=replace_with_a_long_random_secret
PORT=3000
FRONTEND_URL=http://localhost:5173

DATABASE_DEV_URL=postgres://user:password@localhost:5432/peartone_dev
DATABASE_URL=postgres://user:password@host:5432/peartone_prod

JWT_ISSUER=Peartone API
JWT_AUDIENCE=Peartone Client
NODE_ENV=development

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Frontend (`frontend/.env`)

Create `frontend/.env` from `frontend/.env.example`.

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

For production, replace localhost values with your deployed backend and frontend URLs.

---

## 🚀 Local Development

### 1. Clone

```bash
git clone https://github.com/Kasanee-Teto/Peartone.git
cd Peartone
```

### 2. Prepare PostgreSQL

Create a local PostgreSQL database, then place its URL in `backend/.env`.

```sql
CREATE DATABASE peartone_dev;
```

Example development URL:

```env
DATABASE_DEV_URL=postgres://postgres:password@localhost:5432/peartone_dev
```

### 3. Run Backend

```bash
cd backend
npm install
cp .env.example .env
npm run migrate
npm run seed
npm run dev
```

Backend default URL:

```txt
http://localhost:3000
```

API base URL:

```txt
http://localhost:3000/api
```

### 4. Run Frontend

Open a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend default URL:

```txt
http://localhost:5173
```

### 5. Run Both at Once

From `frontend/`:

```bash
npm run dev:all
```

This runs:

```bash
npm --prefix ../backend run dev
npm --prefix . run dev
```

---

## 🧰 Useful Scripts

### Backend

Run from `backend/`.

```bash
npm run dev
npm start
npm run migrate
npm run seed
npm run jwt-key
```

| Script | Purpose |
|---|---|
| `npm run dev` | Start backend with Nodemon |
| `npm start` | Start backend with Node |
| `npm run migrate` | Run Sequelize migrations |
| `npm run seed` | Run Sequelize seeders |
| `npm run jwt-key` | Generate a random `JWT_SECRET` into `.env` |

### Frontend

Run from `frontend/`.

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run dev:all
```

| Script | Purpose |
|---|---|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run dev:all` | Start backend and frontend together |

---

## 🔒 Security Notes

- JWT authentication is used for protected routes.
- Admin routes require both authentication and admin authorization.
- Google OAuth credentials must stay in environment variables.
- Password-related logic should use hashing before storage.
- Do not commit real `.env` files or production database credentials.
- Validate uploaded media files before exposing them publicly.
- Keep production `DATABASE_URL` protected and use SSL where required.

---

## 🗄️ Database Configuration

Sequelize reads database settings from `backend/config/config.json`.

### Development

```json
{
  "use_env_variable": "DATABASE_DEV_URL",
  "dialect": "postgres"
}
```

### Production

```json
{
  "use_env_variable": "DATABASE_URL",
  "dialect": "postgres",
  "dialectOptions": {
    "ssl": {
      "require": true,
      "rejectUnauthorized": false
    }
  }
}
```

---

## 📚 API Endpoints

Base URL:

```txt
http://localhost:3000/api
```

### Legend

- **Public** — no login required
- **Auth** — login required
- **Admin** — admin role required

### Auth

| Method | Endpoint | Access | Purpose |
|---|---|---:|---|
| `GET` | `/auth/google` | Public | Start Google OAuth login |
| `GET` | `/auth/google/callback` | Public | Handle Google OAuth callback |
| `POST` | `/auth/register` | Public | Register a new user |
| `POST` | `/auth/login` | Public | Log in and receive auth token |
| `GET` | `/auth/me` | Auth | Get current user profile |
| `PUT` | `/auth/me` | Auth | Update current user profile |
| `POST` | `/auth/logout` | Auth | Log out current user |

### Tracks

| Method | Endpoint | Access | Purpose |
|---|---|---:|---|
| `GET` | `/tracks` | Public | List tracks |
| `GET` | `/tracks/search` | Public | Search tracks |
| `GET` | `/tracks/:id` | Public | Get track details |

### Artists

| Method | Endpoint | Access | Purpose |
|---|---|---:|---|
| `GET` | `/artists` | Public | List artists |
| `GET` | `/artists/:id` | Public | Get artist details |
| `POST` | `/artists` | Admin | Create artist with image upload |

### Albums

| Method | Endpoint | Access | Purpose |
|---|---|---:|---|
| `GET` | `/albums` | Public | List albums |
| `GET` | `/albums/search` | Public | Search albums |
| `GET` | `/albums/:id` | Public | Get album details |

### Likes

| Method | Endpoint | Access | Purpose |
|---|---|---:|---|
| `GET` | `/likes` | Auth | List liked tracks |
| `POST` | `/likes/:trackId` | Auth | Like a track |
| `DELETE` | `/likes/:trackId` | Auth | Unlike a track |
| `POST` | `/likes/:trackId/toggle` | Auth | Toggle like status |

### Playlists

| Method | Endpoint | Access | Purpose |
|---|---|---:|---|
| `POST` | `/playlists` | Auth | Create playlist |
| `GET` | `/playlists` | Auth | List current user's playlists |
| `GET` | `/playlists/:id` | Auth | Get one playlist |
| `DELETE` | `/playlists/:id` | Auth | Delete playlist |
| `POST` | `/playlists/:id/tracks` | Auth | Add track to playlist |
| `DELETE` | `/playlists/:id/tracks/:trackId` | Auth | Remove track from playlist |
| `PUT` | `/playlists/:id/reorder` | Auth | Reorder playlist tracks |

### Lyrics

| Method | Endpoint | Access | Purpose |
|---|---|---:|---|
| `GET` | `/lyrics/:trackId` | Public | Get lyrics for a track |
| `PUT` | `/lyrics/:trackId` | Admin | Create or update lyrics |

### Streaming

| Method | Endpoint | Access | Purpose |
|---|---|---:|---|
| `GET` | `/stream/tracks/:id` | Public | Stream a track audio file |

### History

| Method | Endpoint | Access | Purpose |
|---|---|---:|---|
| `GET` | `/history` | Auth | List listening history |
| `POST` | `/history` | Auth | Add listening history entry |
| `DELETE` | `/history` | Auth | Clear listening history |

### Charts

| Method | Endpoint | Access | Purpose |
|---|---|---:|---|
| `GET` | `/charts/top` | Public | Get top chart tracks |

### Admin

| Method | Endpoint | Access | Purpose |
|---|---|---:|---|
| `GET` | `/admin/tracks` | Admin | List tracks for admin management |
| `POST` | `/admin/tracks` | Admin | Upload a new track with files |
| `DELETE` | `/admin/tracks/:id` | Admin | Delete a track |

### Static Media

| Path | Purpose |
|---|---|
| `/storage/*` | Serves uploaded/static media from backend storage |

---

## 🧪 Testing & Quality

No dedicated test script is currently defined in the available package scripts.

Recommended manual checks:

```bash
# Backend health / routing check
curl http://localhost:3000/api/tracks

# Auth flow check
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password"}'

# Frontend build check
cd frontend
npm run build
```

---

## 🔄 Reset Migrations & Seeders

Run from `backend/`.

Undo all seeders:

```bash
npx sequelize-cli db:seed:undo:all
```

Undo all migrations:

```bash
npx sequelize-cli db:migrate:undo:all
```

Run migrations and seeders again:

```bash
npm run migrate
npm run seed
```

---

## 🛠️ Common Troubleshooting

### Frontend cannot reach backend

Check `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Also make sure the backend is running on the same port as the frontend expects.

### Google OAuth redirects fail

Check the backend values:

```env
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Also confirm that your Google OAuth redirect URI matches the backend callback route.

### Media files return 404

PeartOne serves static files through:

```txt
/storage/*
```

Make sure uploaded or seeded media files exist inside the backend storage directory.

### Database connection fails

Check that:

- PostgreSQL is running.
- `DATABASE_DEV_URL` is valid.
- `NODE_ENV=development` is set for local development.
- Migrations have been run with `npm run migrate`.

---

## 🤝 Contributing

PRs and improvements are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push to your branch.
5. Open a Pull Request.

---

## 📜 License

This project currently declares the `ISC` license in `backend/package.json`.

---

## 🙏 Acknowledgements

- React, Vite, Express, Sequelize, PostgreSQL, Socket.IO, and Passport.
- Open-source contributors and libraries used in this project.
- Music streaming app patterns used as learning references.

---

## 👤 Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Kasanee-Teto">
        <img src="https://avatars.githubusercontent.com/Kasanee-Teto" width="80" style="border-radius: 50%;" alt="Kasanee-Teto"/>
        <br />
        <sub><b>Kasanee-Teto</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Jess2Jes">
        <img src="https://avatars.githubusercontent.com/Jess2Jes" width="80" style="border-radius: 50%;" alt="Jess2Jes"/>
        <br />
        <sub><b>Jess2Jes</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Solynixx">
        <img src="https://avatars.githubusercontent.com/Solynixx" width="80" style="border-radius: 50%;" alt="Solynixx"/>
        <br />
        <sub><b>Solynixx</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Milkdrinker-creator">
        <img src="https://avatars.githubusercontent.com/Milkdrinker-creator" width="80" style="border-radius: 50%;" alt="Milkdrinker-creator"/>
        <br />
        <sub><b>Milkdrinker-creator</b></sub>
      </a>
    </td>

  </tr>
</table>
