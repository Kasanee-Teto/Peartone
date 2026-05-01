import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import { getLyrics, upsertLyrics } from "../controllers/lyrics.controller.js";

const router = Router();

router.get("/:trackId", getLyrics);

router.put("/:trackId", authMiddleware, adminMiddleware, upsertLyrics);

export default router;