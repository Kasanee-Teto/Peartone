import { Router } from "express";
import { streamTrack } from "../controllers/stream.controller.js";

const router = Router();

router.get("/tracks/:id", streamTrack);

export default router;