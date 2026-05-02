import { Op } from "sequelize";
import db from "../models/index.js";
import BaseService from "./base.service.js";

const { Track, Artist, Album, TrackArtist } = db;

class TrackService extends BaseService {
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

  _orderConfig() {
    return [
      ['listeners', 'DESC'],
      [{ model: Artist, as: "Artists" }, TrackArtist, "artistOrder", "ASC"]
    ];
  }

  async list({ q, page = 1, limit = 10 } = {}) {
    const query = (q || "").trim();

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const offset = (pageNum - 1) * limitNum;

    const where = { isPublished: true };

    if (query) {
      where[Op.or] = [
        { title: { [Op.like]: `%${query}%` } },
        { genre: { [Op.like]: `%${query}%` } }
      ];
    }

    const { rows, count } = await Track.findAndCountAll({
      where,
      include: this._include(),
      order: this._orderConfig(),
      limit: limitNum,
      offset,
      distinct: true
    });

    return {
      ...this.success(rows, "Tracks fetched"),
      meta: {
        page: pageNum,
        limit: limitNum,
        total: count,
        totalPages: Math.ceil(count / limitNum)
      }
    };
  }

  async getById(id) {
    const track = await Track.findByPk(id, {
      include: this._include(),
      order: [this._orderConfig()[1]]
    });
    return this.success(track, "Track fetched");
  }

  async search(q) {
    const query = (q || "").trim();
    if (!query) return this.success([], "Empty query");

    const tracks = await Track.findAll({
      where: {
        isPublished: true,
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { genre: { [Op.like]: `%${query}%` } }
        ]
      },
      include: this._include(),
      order: this._orderConfig(),
    });

    return this.success(tracks, "Search results");
  }
}

export default new TrackService();
