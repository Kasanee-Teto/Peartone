import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { addHistory, clearHistory, listHistory } from "../controllers/history.controller.js";

const router = Router();
router.use(authMiddleware);

router.get("/", listHistory);
router.post("/", addHistory);
router.delete("/", clearHistory);

export default router;