import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import likeService from "../services/like.service.js";

export const listLiked = asyncHandler(
  async (req, res) => {
    const result = await likeService.listLiked(req.user.id);
    res.status(200).json(result);
  }
);

export const likeTrack = asyncHandler(
  async (req, res) => {
    const { trackId } = req.params;
    if (!trackId) throw new ApiError(400, "trackId is required");
    const result = await likeService.like(req.user.id, trackId);
    res.status(200).json(result);
  }
);

export const unlikeTrack = asyncHandler(
  async (req, res) => {
    const { trackId } = req.params;
    if (!trackId) throw new ApiError(400, "trackId is required");
    const result = await likeService.unlike(req.user.id, trackId);
    res.status(200).json(result);
  }
);

export const toggleLike = asyncHandler(
  async (req, res) => {
    const { trackId } = req.params;
    const result = await likeService.toggle(req.user.id, trackId);
    res.status(200).json(result);
  }
);