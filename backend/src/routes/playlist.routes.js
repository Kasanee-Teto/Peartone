import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  addTrackToPlaylist,
  createPlaylist,
  getMyPlaylist,
  listMyPlaylists,
  removeTrackFromPlaylist,
  reorderPlaylist
} from "../controllers/playlist.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", createPlaylist);
router.get("/", listMyPlaylists);
router.get("/:id", getMyPlaylist);

router.post("/:id/tracks", addTrackToPlaylist);
router.delete("/:id/tracks/:trackId", removeTrackFromPlaylist);

router.put("/:id/reorder", reorderPlaylist);

export default router;