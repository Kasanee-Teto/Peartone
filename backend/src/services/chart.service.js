import db from "../models/index.js";
import BaseService from "./base.service.js";

const { Track, Album, Artist, TrackArtist } = db;

class ChartService extends BaseService {
  _include() {
    return [
      { model: Album, as: "Album" },
      {
        model: Artist,
        as: "Artists",
        through: { attributes: ["artistOrder", "role"] }
      }
    ];
  }

  async top({ limit = 10, genre } = {}) {
    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

    const where = { isPublished: true };
    if (genre) where.genre = genre;

    const tracks = await Track.findAll({
      where,
      include: this._include(),
      order: [
        [Track, 'listeners', 'DESC'], 
        [{ model: Artist, as: 'Artists' }, TrackArtist, 'artistOrder', 'ASC']
      ],
      limit: safeLimit,
      distinct: true,
      subQuery: true
    });

    return this.success(tracks, "Top charts fetched");
  }
}

export default new ChartService();