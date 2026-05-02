import db from "../models/index.js";
import BaseService from "./base.service.js";

const { History, Track, Album, Artist, TrackArtist } = db;

class HistoryService extends BaseService {
  _includeTrack() {
    return [
      { model: Album, as: "Album" },
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
    const limitNum = Math.min(Number(limit) || 50, 200);

    const rows = await History.findAll({
      where: { userId },
      order: [["playedAt", "DESC"]],
      limit: limitNum,
      include: [
        {
          model: Track,
          as: "Track",
          include: this._includeTrack()
        }
      ]
    });

    return this.success(rows, "History fetched");
  }

  async clear(userId) {
    const deleted = await History.destroy({ where: { userId } });
    return this.success({ deleted }, "History cleared");
  }
}

export default new HistoryService();