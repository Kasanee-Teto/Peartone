import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import playlistService from "../services/playlist.service.js";

export const createPlaylist = asyncHandler(
  async (req, res) => {
    const result = await playlistService.create(req.user.id, req.body || {});
    res.status(201).json(result);
  }
);

export const listMyPlaylists = asyncHandler(async (req, res) => {
  const { q, page, limit } = req.query;
  const result = await playlistService.listMine(req.user.id, { q, page, limit });
  res.status(200).json(result);
});

export const getMyPlaylist = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, "id is required!");
    const result = await playlistService.getMineById(req.user.id, id);
    res.status(200).json(result);
  }
);

export const addTrackToPlaylist = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const { trackId } = req.body || {};
    if (!trackId) throw new ApiError(400, "trackId is required!");
    const result = await playlistService.addTrack(req.user.id, id, trackId);
    res.status(200).json(result);
  }
);

export const removeTrackFromPlaylist = asyncHandler(
  async (req, res) => {
    const { id, trackId } = req.params;
    const result = await playlistService.removeTrack(req.user.id, id, trackId);
    res.status(200).json(result);
  }
);

export const reorderPlaylist = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const { items } = req.body || {};
    const result = await playlistService.reorder(req.user.id, id, items);
    res.status(200).json(result);
  }
);