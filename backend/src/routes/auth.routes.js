import { Router } from "express";
import { register, login, logout, getProfile, updateProfile } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getProfile);
router.put("/me", authMiddleware, updateProfile);
router.post("/logout", authMiddleware, logout);

export default router;