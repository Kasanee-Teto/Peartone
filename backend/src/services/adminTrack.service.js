import path from "path";
import db from "../models/index.js";
import ApiError from "../utils/apiError.js";
import BaseService from "./base.service.js";

const { Track, TrackArtist, Artist, Album } = db;

class AdminTrackService extends BaseService {
  async create({ userId, body, files }) {
    const { title, duration, albumId, artistIds } = body || {};
    if (!title) throw new ApiError(400, "Title is required!");
    if (!duration) throw new ApiError(400, "Duration is required!");

    let parsedArtistIds = [];
    if (artistIds) {
      try {
        parsedArtistIds = typeof artistIds === "string" ? JSON.parse(artistIds) : artistIds;
      } catch {
        throw new ApiError(400, "artistIds must be a JSON array of UUIDs");
      }
    }
    if (!Array.isArray(parsedArtistIds) || parsedArtistIds.length === 0) {
      throw new ApiError(400, "artistIds is required (at least 1 artist)");
    }

    if (albumId) {
      const album = await Album.findByPk(albumId);
      if (!album) throw new ApiError(404, "Album not found");
    }

    const artists = await Artist.findAll({ where: { id: parsedArtistIds } });
    if (artists.length !== parsedArtistIds.length) {
      throw new ApiError(400, "Some artistIds are invalid");
    }

    const audioFile = files?.audio?.[0];
    if (!audioFile) throw new ApiError(400, "Audio file is required!");

    const coverFile = files?.cover?.[0];

    const audioPath = path.posix.join("storage", "audio", audioFile.filename);
    const audioUrl = `/${audioPath}`;
    const coverUrl = coverFile ? `/${path.posix.join("storage", "covers", coverFile.filename)}` : null;

    const track = await db.sequelize.transaction(async (t) => {
      const created = await Track.create(
        {
          albumId: albumId || null,
          title,
          duration: Number(duration),
          audioUrl,
          audioPath,
          mimeType: audioFile.mimetype || "audio/mpeg",
          fileSize: audioFile.size || 0,
          coverUrl,
          isPublished: true,
          uploadedBy: userId
        },
        { transaction: t }
      );

      for (let i = 0; i < parsedArtistIds.length; i++) {
        await TrackArtist.create(
          {
            trackId: created.id,
            artistId: parsedArtistIds[i],
            artistOrder: i + 1,
            role: i === 0 ? "primary" : "featured"
          },
          { transaction: t }
        );
      }

      return created;
    });

    return this.success(track, "Track uploaded");
  }

  async getAll({ userId }) {
    const tracks = await Track.findAll({
      where: { uploadedBy: userId },
      include: [
        { model: Artist, as: "Artists", through: { attributes: [] } },
        { model: Album, as: "Album", attributes: ["id", "title"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    return this.success(tracks, "Tracks fetched");
  }

  async remove({ userId, trackId }) {
    const track = await Track.findOne({ where: { id: trackId, uploadedBy: userId } });
    if (!track) throw new ApiError(404, "Track not found or unauthorized");
    await track.destroy();
    return this.success(null, "Track deleted");
  }
}

export default new AdminTrackService();