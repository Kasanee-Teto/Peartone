import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import trackRoutes from "./routes/track.routes.js";
import artistRoutes from "./routes/artist.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tracks", trackRoutes);
app.use("/api/artists", artistRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal Server Error",
    status
  });
});

export default app;