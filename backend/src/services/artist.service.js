import db from "../models/index.js";
import BaseService from "./base.service.js";
import ApiError from "../utils/apiError.js";
import { Op } from "sequelize";

const { Artist, Track, Album } = db;

class ArtistService extends BaseService {
  async createArtist(data, file) {
    if (!data.name) {
      throw new ApiError(400, "Artist name is required!");
    }

    const artist = await Artist.create({
      name: data.name,
      bio: data.bio || null,
      imageUrl: file ? `/storage/artists/${file.filename}` : null
    });

    return this.success(artist, "Artist created");
  }

  async list({ q, page = 1, limit = 10 } = {}) {
    const query = (q || "").trim();

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const offset = (pageNum - 1) * limitNum;

    const where = {};
    if (query) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${query}%` } },
        { bio: { [Op.iLike]: `%${query}%` } }
      ];
    }

    const { rows, count } = await Artist.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: limitNum,
      offset
    });

    return {
      ...this.success(rows, "Artists fetched"),
      meta: {
        page: pageNum,
        limit: limitNum,
        total: count,
        totalPages: Math.ceil(count / limitNum)
      }
    };
  }

  async getDetail(params) {
    const { id } = params;
    const artist = await Artist.findByPk(id, {
      include: [
        {
          model: Track,
          as: "Tracks",
          through: { attributes: ['role', 'artistOrder'] },
          attributes: ["id", "title", "duration", "listeners"],
        }, 
        {
          model: Album,
          as: "Albums",
          attributes: ["id", "title", "coverUrl", "releaseDate", "trackNumbers"]
        }
      ]
    });

    if (!artist) {
      throw new ApiError(404, "Artist not found");
    }

    return this.success(artist, "Artist found");
  }
}

export default new ArtistService();