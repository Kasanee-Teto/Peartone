import { Router } from "express";
import { createArtist } from "../controllers/artist.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import { uploadArtistImage } from "../middlewares/upload.middleware.js";

const router = Router();

router.post("/", authMiddleware, adminMiddleware, uploadArtistImage, createArtist);

export default router;