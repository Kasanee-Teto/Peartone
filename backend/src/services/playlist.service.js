import db from "../models/index.js";
import ApiError from "../utils/apiError.js";
import BaseService from "./base.service.js";

const { Playlist, PlaylistTrack, Track, Album, Artist, TrackArtist } = db;

class PlaylistService extends BaseService {
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

  async create(userId, { name, description, isPublic }) {
    if (!name) throw new ApiError(400, "Name is required!");
    const playlist = await Playlist.create({
      userId,
      name,
      description: description || null,
      isPublic: !!isPublic
    });
    return this.success(playlist, "Playlist created!");
  }

  async listMine(userId) {
    const playlists = await Playlist.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]]
    });
    return this.success(playlists, "Playlists fetched!");
  }

  async getMineById(userId, playlistId) {
    const playlist = await Playlist.findOne({ where: { id: playlistId, userId } });
    if (!playlist) throw new ApiError(404, "Playlist not found!");

    const items = await PlaylistTrack.findAll({
      where: { playlistId },
      order: [["position", "ASC"]],
      include: [{ model: Track, as: "Track", include: this._includeTrack() }]
    });

    const tracks = items.map((it) => ({
      ...it.track.toJSON(),
      position: it.position,
      addedAt: it.addedAt
    }));

    return this.success({ playlist, tracks }, "Playlist fetched!");
  }

  async addTrack(userId, playlistId, trackId) {
    const playlist = await Playlist.findOne({ where: { id: playlistId, userId } });
    if (!playlist) throw new ApiError(404, "Playlist not found");

    const max = await PlaylistTrack.max("position", { where: { playlistId } });
    const nextPos = (max || 0) + 1;

    try {
      await PlaylistTrack.create({
        playlistId,
        trackId,
        position: nextPos,
        addedBy: userId,
        addedAt: new Date()
      });
    } catch (error) {
      throw new ApiError(409, "Track already exists in playlist");
    }

    return this.success({ playlistId, trackId, position: nextPos }, "Track added to playlist");
  }

  async removeTrack(userId, playlistId, trackId) {
    const playlist = await Playlist.findOne({ where: { id: playlistId, userId } });
    if (!playlist) throw new ApiError(404, "Playlist not found");

    const deleted = await PlaylistTrack.destroy({ where: { playlistId, trackId } });
    if (!deleted) throw new ApiError(404, "Track not found in playlist");

    return this.success(null, "Track removed from playlist");
  }

  async reorder(userId, playlistId, items) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new ApiError(400, "Items must be a non-empty array");
    }

    const playlist = await Playlist.findOne({ where: { id: playlistId, userId } });
    if (!playlist) throw new ApiError(404, "Playlist not found");

    const posSet = new Set(items.map((item) => item.position));
    if (posSet.size !== items.length) throw new ApiError(400, "Duplicate positions are not allowed");

    const existing = await PlaylistTrack.findAll({ where: { playlistId } });
    const existingSet = new Set(existing.map((e) => e.trackId));

    for (const it of items) {
      if (!it.trackId || !it.position) throw new ApiError(400, "trackId and position are required");
      if (!existingSet.has(it.trackId)) throw new ApiError(400, `trackId not in playlist: ${it.trackId}`);
      if (it.position <= 0) throw new ApiError(400, "position must be > 0");
    }

    await db.sequelize.transaction(async (t) => {
      await PlaylistTrack.update(
        { position: db.Sequelize.literal("position + 1000000") },
        { where: { playlistId }, transaction: t }
      );

      for (const it of items) {
        await PlaylistTrack.update(
          { position: it.position },
          { where: { playlistId, trackId: it.trackId }, transaction: t }
        );
      }
    });

    return this.success(null, "Playlist reordered");
  }
}

export default new PlaylistService();