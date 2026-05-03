import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import { uploadTrackFiles } from "../middlewares/upload.middleware.js";
import { getTracks, uploadTrack, deleteTrack } from "../controllers/adminTrack.controller.js";

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/tracks", getTracks); 
router.post("/tracks", uploadTrackFiles, uploadTrack);
router.delete("/tracks/:id", deleteTrack);

export default router;