import { Router } from "express";
import { createTrack, getAllTracks, searchTracks } from "../controllers/track.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import { uploadTrackFiles } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/", getAllTracks);
router.get("/search", searchTracks);

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  uploadTrackFiles,
  createTrack
);

export default router;