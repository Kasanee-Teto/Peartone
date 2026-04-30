import asyncHandler from "../utils/asyncHandler.js";
import trackService from "../services/track.service.js";

export const createTrack = asyncHandler(async (req, res) => {
  const result = await trackService.createTrack(req.body, req.files);
  res.status(201).json(result);
});

export const getAllTracks = asyncHandler(async (req, res) => {
  const result = await trackService.getAllTracks();
  res.status(200).json(result);
});

export const searchTracks = asyncHandler(async (req, res) => {
  const result = await trackService.searchTracks(req.query.q);
  res.status(200).json(result);
});