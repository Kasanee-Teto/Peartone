import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import albumService from "../services/album.service.js";

export const listAlbums = asyncHandler(async (req, res) => {
  const { q, page, limit } = req.query;
  const result = await albumService.list({ q, page, limit });
  res.status(200).json(result);
});

export const getAlbum = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await albumService.getById(id);
  if (!result.data) throw new ApiError(404, "Album not found");
  res.status(200).json(result);
});

export const searchAlbums = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const result = await albumService.search(q);
  res.status(200).json(result);
});