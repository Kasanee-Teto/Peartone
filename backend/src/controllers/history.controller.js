import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import historyService from "../services/history.service.js";

export const addHistory = asyncHandler(async (req, res) => {
  try {
    const result = await historyService.add(req.user.id, req.body || {});
    res.status(201).json(result);
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

export const listHistory = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  const result = await historyService.list(req.user.id, limit);
  res.status(200).json(result);
});

export const clearHistory = asyncHandler(async (req, res) => {
  const result = await historyService.clear(req.user.id);
  res.status(200).json(result);
});