import { Router } from "express";
import { createArtist, listArtists, getArtistDetail } from "../controllers/artist.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import { uploadArtistImage } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/", listArtists);
router.get("/:id", getArtistDetail);
router.post("/", authMiddleware, adminMiddleware, uploadArtistImage, createArtist);

export default router;