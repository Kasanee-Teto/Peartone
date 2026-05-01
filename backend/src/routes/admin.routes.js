import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import { uploadTrackFiles } from "../middlewares/upload.middleware.js";
import { uploadTrack } from "../controllers/adminTrack.controller.js";

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.post("/tracks", uploadTrackFiles, uploadTrack);

export default router;