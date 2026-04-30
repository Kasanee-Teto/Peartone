import asyncHandler from "../utils/asyncHandler.js";
import lyricsService from "../services/lyrics.service.js";

export const getLyrics = asyncHandler(
  async (req, res) => {
    const { trackId } = req.params;
    const result = await lyricsService.getByTrackId(trackId);
    res.status(200).json(result);
  }
);

export const upsertLyrics = asyncHandler(
  async (req, res) => {
    const { trackId } = req.params;
    const result = await lyricsService.upsert(trackId, req.body || {});
    res.status(200).json(result);
  }
);