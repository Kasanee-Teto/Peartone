import { Router } from "express";
import { register, login, logout, getProfile, updateProfile, handleGoogleCallback } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import passport from "passport";

const router = Router();

router.get("/google", 
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);
router.get('/google/callback', 
    passport.authenticate('google', {
        failureRedirect: `${process.env.FRONTEND_URL}/login`,
        session: false
    }),
    handleGoogleCallback
)
router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getProfile);
router.put("/me", authMiddleware, updateProfile);
router.post("/logout", authMiddleware, logout);

export default router;