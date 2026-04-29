import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import authService from "../services/auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  const result = await authService.register({ email, password });
  res.status(201).json(result);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  const result = await authService.login({ email, password });
  res.status(200).json(result);
});