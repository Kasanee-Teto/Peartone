import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import artistRoutes from "./routes/artist.routes.js";
import trackRoutes from "./routes/track.routes.js";
import likeRoutes from "./routes/like.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import lyricsRoutes from "./routes/lyrics.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import streamRoutes from "./routes/stream.routes.js";
import historyRoutes from "./routes/history.routes.js";
import albumRoutes from "./routes/album.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/storage", express.static("storage"));

app.use("/api/auth", authRoutes);
app.use("/api/artists", artistRoutes);
app.use("/api/tracks", trackRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/lyrics", lyricsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stream", streamRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/albums", albumRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal Server Error",
    status
  });
});

export default app;