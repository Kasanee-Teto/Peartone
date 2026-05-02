import db from "../models/index.js";
import ApiError from "../utils/apiError.js";
import BaseService from "./base.service.js";
import { ForeignKeyConstraintError, Op, UniqueConstraintError } from "sequelize";

const { LikedTrack, Track, Album, Artist, TrackArtist, User } = db;

class LikeService extends BaseService {
  _includeTrack() {
    return [
      { model: Album, as: "Album" },
      {
        model: Artist,
        as: "Artists",
        through: { attributes: ["artistOrder", "role"] }
      }
    ];
  }

  _orderConfig() {
    return [
      ["createdAt", "DESC"], 
      [{ model: Track, as: "Track" }, { model: Artist, as: "Artists" }, TrackArtist, "artistOrder", "ASC"]
    ];
  }

  async listLiked(userId, { q, page = 1, limit = 10 } = {}) {
    const query = (q || "").trim();
    const likeOperator = db.sequelize.getDialect() === "postgres" ? Op.iLike : Op.like;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const offset = (pageNum - 1) * limitNum;

    const trackWhere = {};
    if (query) {
      trackWhere[Op.or] = [
        { title: { [likeOperator]: `%${query}%` } },
        { genre: { [likeOperator]: `%${query}%` } }
      ];
    }

    const { rows, count } = await LikedTrack.findAndCountAll({
      where: { userId },
      limit: limitNum,
      offset,
      distinct: true,
      order: this._orderConfig(),
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
      ...row.Track.toJSON(),
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
    trackId = String(trackId || "").trim();
    if (!trackId) throw new ApiError(400, "trackId is required");

    const track = await Track.findByPk(trackId);
    if (!track) throw new ApiError(404, "Track not found");

    const existing = await LikedTrack.findOne({ where: { userId, trackId } });
    if (existing) {
      return this.success(null, "Track liked!");
    }

    const now = new Date();
    await LikedTrack.create({ userId, trackId, createdAt: now, updatedAt: now });
    return this.success(null, "Track liked!");
  }

  async unlike(userId, trackId) {
    trackId = String(trackId || "").trim();
    if (!trackId) throw new ApiError(400, "trackId is required");

    const deleted = await LikedTrack.destroy({ where: { userId, trackId } });
    if (!deleted) throw new ApiError(404, "Like not found");
    return this.success(null, "Track unliked!");
  }

  async toggle(userId, trackId) {

    trackId = String(trackId || "").trim();
    if (!trackId) throw new ApiError(400, "trackId is required");

    const user = await User.findByPk(userId);
    if (!user) throw new ApiError(401, "User not found. Please login again");

    const track = await Track.findByPk(trackId);
    if (!track) throw new ApiError(404, "Track not found");

    const existing = await LikedTrack.findOne({ where: { userId, trackId } });
    if (existing) {
      await existing.destroy();
      return this.success({ liked: false }, "Unliked");
    }

    try {
      await LikedTrack.create({ userId, trackId });
      return this.success({ liked: true }, "Liked");
    } catch (dbError) {
      if (dbError instanceof UniqueConstraintError) {
        return this.success({ liked: true }, "Liked");
      }

      if (dbError instanceof ForeignKeyConstraintError) {
        throw new ApiError(400, "Cannot like this track right now");
      }

      throw dbError;
    }
  }
}

export default new LikeService();