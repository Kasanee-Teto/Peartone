import asyncHandler from "../utils/asyncHandler.js";
import artistService from "../services/artist.service.js";

export const createArtist = asyncHandler(async (req, res) => {
  const result = await artistService.createArtist(req.body, req.file);
  res.status(201).json(result);
});