import { Router } from "express";
import { getTrack, listTracks, searchTracks } from "../controllers/track.controller.js";

const router = Router();

router.get("/", listTracks);
router.get("/search", searchTracks);
router.get("/:id", getTrack);

export default router;