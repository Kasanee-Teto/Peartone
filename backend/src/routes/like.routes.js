import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { likeTrack, listLiked, toggleLike, unlikeTrack } from "../controllers/like.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", listLiked);
router.post("/:trackId", likeTrack);
router.delete("/:trackId", unlikeTrack);
router.post("/:trackId/toggle", toggleLike);

export default router;