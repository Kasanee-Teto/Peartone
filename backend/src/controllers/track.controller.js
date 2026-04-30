import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import trackService from "../services/track.service.js";

export const listTracks = asyncHandler(async (req, res) => {
  const result = await trackService.list();
  res.status(200).json(result);
});

export const getTrack = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await trackService.getById(id);
  if (!result.data) throw new ApiError(404, "Track not found");
  res.status(200).json(result);
});

export const searchTracks = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const result = await trackService.search(q);
  res.status(200).json(result);
});