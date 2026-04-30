import db from "../models/index.js";
import ApiError from "../utils/apiError.js";
import BaseService from "./base.service.js";

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

  async listLiked(userId) {
    const liked = await LikedTrack.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Track,
          as: "Track",
          include: this._includeTrack()
        }
      ]
    });

    const tracks = liked.map((row) => ({
      ...row.track.toJSON(),
      likedAt: row.createdAt
    }));

    return this.success(tracks, "Liked tracks fetched");
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