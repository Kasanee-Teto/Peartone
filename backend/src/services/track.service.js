import db from "../models/index.js";
import BaseService from "./base.service.js";
import ApiError from "../utils/apiError.js";

const { Track, TrackArtist, Artist, Album, sequelize, Sequelize } = db;

class TrackService extends BaseService {
  async createTrack(data, files) {
    const transaction = await sequelize.transaction();

    try {
      const audioFile = files?.audio?.[0];
      if (!audioFile) {
        throw new ApiError(400, "Audio file is required");
      }

      const track = await Track.create(
        {
          title: data.title,
          duration: data.duration || null,
          audioUrl: `/storage/audio/${audioFile.filename}`,
          coverUrl: files?.cover?.[0]
            ? `/storage/covers/${files.cover[0].filename}`
            : null,
          albumId: data.albumId || null
        },
        { transaction }
      );

      const artistIds = Array.isArray(data.artistIds)
        ? data.artistIds
        : data.artistIds
        ? JSON.parse(data.artistIds)
        : [];

      if (!artistIds.length) {
        throw new ApiError(400, "artistIds is required");
      }

      const trackArtists = artistIds.map((artistId) => ({
        trackId: track.id,
        artistId
      }));

      await TrackArtist.bulkCreate(trackArtists, { transaction });

      await transaction.commit();
      return this.success(track, "Track created");
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async getAllTracks() {
    const tracks = await Track.findAll({
      include: [
        { model: Artist, through: { attributes: [] } },
        { model: Album }
      ],
      order: [["createdAt", "DESC"]]
    });

    return this.success(tracks, "Tracks fetched");
  }

  async searchTracks(query) {
    if (!query) {
      return this.success([], "No query");
    }

    const tracks = await Track.findAll({
      include: [
        { model: Artist, through: { attributes: [] } },
        { model: Album }
      ],
      where: Sequelize.where(
        Sequelize.fn(
          "concat",
          Sequelize.col("Track.title"),
          " ",
          Sequelize.col("Artists.name"),
          " ",
          Sequelize.col("Album.title")
        ),
        {
          [Sequelize.Op.iLike]: `%${query}%`
        }
      )
    });

    return this.success(tracks, "Search results");
  }
}

export default new TrackService();