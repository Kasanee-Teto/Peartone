import db from "../models/index.js";
import ApiError from "../utils/apiError.js";
import BaseService from "./base.service.js";

const { Lyrics , Track } = db;

class LyricsService extends BaseService {
  async getByTrackId(trackId) {
    const lyric = await Lyrics.findByPk(trackId);
    if (!lyric) throw new ApiError(404, "Lyrics not found!");
    return this.success(lyric, "Lyrics fetched!");
  }

  async upsert(trackId, { language = "id", text }) {
    if (!text) throw new ApiError(400, "text is required!");

    const track = await Track.findByPk(trackId);
    if (!track) throw new ApiError(404, "Track not found!");

    const [lyric] = await Lyrics.upsert(
      { trackId, language, text },
      { returning: true }
    );

    return this.success(lyric, "Lyrics saved!");
  }
}

export default new LyricsService();