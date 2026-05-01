import asyncHandler from "../utils/asyncHandler.js";
import artistService from "../services/artist.service.js";

export const createArtist = asyncHandler(async (req, res) => {
  const result = await artistService.createArtist(req.body, req.file);
  res.status(201).json(result);
});

export const listArtists = asyncHandler(async (req, res) => {
  const { q, page, limit } = req.query;
  const result = await artistService.list({ q, page, limit });
  res.status(200).json(result);
});