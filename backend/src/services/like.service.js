import db from "../models/index.js";
import ApiError from "../utils/apiError.js";
import BaseService from "./base.service.js";
import { Op } from "sequelize";

const { LikedTrack, Track, Album, Artist, TrackArtist } = db;

class LikeService extends BaseService {
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

  async listLiked(userId, { q, page = 1, limit = 10 } = {}) {
    const query = (q || "").trim();

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const offset = (pageNum - 1) * limitNum;

    const trackWhere = {};
    if (query) {
      trackWhere[Op.or] = [
        { title: { [Op.iLike]: `%${query}%` } },
        { genre: { [Op.iLike]: `%${query}%` } }
      ];
    }

    const { rows, count } = await LikedTrack.findAndCountAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      limit: limitNum,
      offset,
      distinct: true,
      include: [
        {
          model: Track,
          as: "Track",
          where: query ? trackWhere : undefined,
          required: !!query, 
          include: this._includeTrack()
        }
      ]
    });

    const tracks = rows.map((row) => ({
      ...row.track.toJSON(),
      likedAt: row.createdAt
    }));

    return {
      ...this.success(tracks, "Liked tracks fetched"),
      meta: {
        page: pageNum,
        limit: limitNum,
        total: count,
        totalPages: Math.ceil(count / limitNum)
      }
    };
  }

  async like(userId, trackId) {
    await LikedTrack.findOrCreate({
      where: { userId, trackId },
      defaults: { userId, trackId, createdAt: new Date() }
    });
    return this.success(null, "Track liked!");
  }

  async unlike(userId, trackId) {
    const deleted = await LikedTrack.destroy({ where: { userId, trackId } });
    if (!deleted) throw new ApiError(404, "Like not found");
    return this.success(null, "Track unliked!");
  }

  async toggle(userId, trackId) {
    const existing = await LikedTrack.findOne({ where: { userId, trackId } });
    if (existing) {
      await existing.destroy();
      return this.success({ liked: false }, "Unliked");
    }
    await LikedTrack.create({ userId, trackId, createdAt: new Date() });
    return this.success({ liked: true }, "Liked");
  }
}

export default new LikeService();