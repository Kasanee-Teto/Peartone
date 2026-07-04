import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import authService from "../services/auth.service.js";

const FRONTEND_URL = process.env.FRONTEND_URL;

export const handleGoogleCallback = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(`${FRONTEND_URL}/login?error=no_user_profile`);
    }
    const result = await authService.findOrCreateGoogleUser(req.user);
    console.log("Service Result:", result);
    const token = result.token || result.data?.token;
    
    return res.redirect(`${FRONTEND_URL}/login-success?token=${token}`);
  } catch (err) {
    console.log("Error in handleGoogleCallback:", err);
    return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
  }
}

export const getProfile = asyncHandler(async (req, res) => {
  const result = await authService.getProfile(req.user.id);
  res.status(200).json(result);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { username, email, location, bio } = req.body || {};
  const result = await authService.updateProfile(req.user.id, { username, email, location, bio });
  res.status(200).json(result);
});

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new ApiError(400, "Username, email and password are required");
  }
  const result = await authService.register({ username, email, password });
  res.status(201).json(result);
});

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ApiError(400, "Username and password are required");
  }
  const result = await authService.login({ username, password });
  res.status(200).json(result);
});

export const logout = asyncHandler(async (req, res) => {
  const result = await authService.logout(req.user.id);
  res.status(200).json(result);
});