import db from "../models/index.js";
import BaseService from "./base.service.js";
import ApiError from "../utils/apiError.js";
import { Op } from "sequelize";

const { Artist } = db;

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
}

export default new ArtistService();