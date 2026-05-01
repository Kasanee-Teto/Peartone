import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import authService from "../services/auth.service.js";

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