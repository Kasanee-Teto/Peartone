import express from "express";
import cors from "cors";
import db from "./models/index.js";

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
import chartRoutes from "./routes/chart.routes.js";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const { Track } = db;

app.use(cors());
app.use(express.json());

const io = new Server(
  httpServer,
  {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  }
);

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);
  socket.on("track-finished", async (data) => {
    const { trackId } = data;
    if (!trackId) return;
    try {
      await Track.increment(
        { listeners: 1 }, 
        { where: { id: trackId } }
      );
      const updatedTrack = await Track.findByPk(trackId);
      io.emit("listeners-updated", {
        trackId: trackId, newListeners: updatedTrack.listeners
      });
    } catch (err) {
      console.log(err);
    }
  });
});

app.use('/storage', express.static('storage'));

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
app.use("/api/charts", chartRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal Server Error",
    status
  });
});

export default httpServer;