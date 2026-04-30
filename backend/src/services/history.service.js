import db from "../models/index.js";
import BaseService from "./base.service.js";

const { History, Track, Album, Artist, TrackArtist } = db;

class HistoryService extends BaseService {
  _includeTrack() {
    return [
      { model: Album, as: "album" },
      {
        model: Artist,
        as: "Artists",
        through: { attributes: ["artistOrder", "role"] },
        order: [[TrackArtist, "artistOrder", "ASC"]]
      }
    ];
  }

  async add(userId, payload) {
    const { trackId, msPlayed } = payload || {};
    if (!trackId) throw new Error("trackId is required");

    const row = await History.create({
      userId,
      trackId,
      playedAt: new Date(),
      msPlayed: msPlayed ?? null
    });

    return this.success(row, "History saved");
  }

  async list(userId, limit = 50) {
    const rows = await History.findAll({
      where: { userId },
      order: [["playedAt", "DESC"]],
      limit: Math.min(Number(limit) || 50, 200)
    });

    const trackIds = [...new Set(rows.map((r) => r.trackId).filter(Boolean))];
    const tracks = await Track.findAll({
      where: { id: trackIds },
      include: this._includeTrack()
    });
    const trackMap = new Map(tracks.map((t) => [t.id, t]));

    const result = rows.map((r) => ({
      ...r.toJSON(),
      track: r.trackId ? trackMap.get(r.trackId) || null : null
    }));

    return this.success(result, "History fetched");
  }
}

export default new HistoryService();