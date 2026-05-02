import db from "../models/index.js";
import ApiError from "../utils/apiError.js";
import BaseService from "./base.service.js";
import { Op } from "sequelize";

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

    // Pastikan user ada di database sebelum insert
    const user = await db.User.findByPk(userId);
    if (!user) throw new ApiError(404, "User not found");

    const playlist = await Playlist.create({
      userId,
      name,
      description: description || null,
      isPublic: !!isPublic
    });
    return this.success(playlist, "Playlist created!");
  }

  async listMine(userId, { q, page = 1, limit = 10 } = {}) {
  const query = (q || "").trim();
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  const offset = (pageNum - 1) * limitNum;

  const where = { userId };
  if (query) {
    where[Op.or] = [
      { name: { [Op.like]: `%${query}%` } },
      { description: { [Op.like]: `%${query}%` } }
    ];
  }

  const { rows, count } = await Playlist.findAndCountAll({
  where,
  order: [["createdAt", "DESC"]],
  limit: limitNum,
  offset,
  distinct: true,
  include: [
    {
      model: PlaylistTrack,
      as: "PlaylistTracks",
      attributes: ["position"],
      required: false,
      include: [
        {
          model: Track,
          as: "Track",
          attributes: ["coverUrl"],
          required: false
        }
      ]
    }
  ]
});

  const data = rows.map((pl) => {
    const json = pl.toJSON();
    const plTracks = (json.PlaylistTracks || []).sort((a, b) => a.position - b.position);
    return {
      id: json.id,
      name: json.name,
      description: json.description,
      isPublic: json.isPublic,
      createdAt: json.createdAt,
      updatedAt: json.updatedAt,
      trackCount: plTracks.length,
      coverUrl: plTracks[0]?.Track?.coverUrl || null,
    };
  });

  return {
    ...this.success(data, "Playlists fetched!"),
    meta: { page: pageNum, limit: limitNum, total: count, totalPages: Math.ceil(count / limitNum) }
  };
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
      ...it.Track.toJSON(),
      position: it.position,
      addedAt: it.addedAt
    }));

    return this.success({ playlist, tracks }, "Playlist fetched!");
  }

  async addTrack(userId, playlistId, trackId) {
    const playlist = await Playlist.findOne({ where: { id: playlistId, userId } });
    if (!playlist) throw new ApiError(404, "Playlist not found");

    const existing = await PlaylistTrack.findOne({ where: { playlistId, trackId } });
    if (existing) throw new ApiError(409, "Track already exists in this playlist");

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
      throw new ApiError(409, "Failed to add track to playlist");
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

  async deletePlaylist(userId, playlistId) {
    const playlist = await Playlist.findOne({ where: { id: playlistId, userId } });
    if (!playlist) throw new ApiError(404, "Playlist not found");

    await PlaylistTrack.destroy({ where: { playlistId } });
    await Playlist.destroy({ where: { id: playlistId } });

    return this.success(null, "Playlist deleted");
  }
}

export default new PlaylistService();
