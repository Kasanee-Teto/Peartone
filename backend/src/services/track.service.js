import { Op } from "sequelize";
import db from "../models/index.js";
import BaseService from "./base.service.js";

const { Track, Artist, Album, TrackArtist } = db;

class TrackService extends BaseService {
    _include() {
      return [
        { 
          model: Album, 
          as: "Album",
          attributes: ["id", "title", "coverUrl", "releaseDate", "trackNumbers"]
        },
        {
          model: Artist,
          as: "Artists",
          attributes: ["id", "name", "imageUrl"],
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


  _likeOp() {
    return db.sequelize.getDialect() === "postgres" ? Op.iLike : Op.like;
  }

  async list({ q, page = 1, limit = 10 } = {}) {
    const query = (q || "").trim();
    const likeOp = this._likeOp();

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const offset = (pageNum - 1) * limitNum;

    const where = { isPublished: true };

    if (query) {
      where[Op.or] = [
        { title: { [likeOp]: `%${query}%` } },
        { genre: { [likeOp]: `%${query}%` } }, 
        { '$Artists.name$': { [likeOp]: `%${query}%` } },
        { '$Album.title$': { [likeOp]: `%${query}%` } },
      ];
    }

    const { rows, count } = await Track.findAndCountAll({
      where,
      attributes: { exclude: ["audioPath", "uploadedBy", "fileSize", "mimeType"] },
      include: this._include(),
      order: this._orderConfig(),
      limit: limitNum,
      offset,
      subQuery: false,
      distinct: true
    });

    return {
      ...this.success(rows, "Tracks fetched"),
      meta: { page: pageNum, limit: limitNum, total: count, totalPages: Math.ceil(count / limitNum) }
    };
  }

  async search(q) {
    const query = (q || "").trim();
    if (!query) return this.success([], "Empty query");
    const likeOp = this._likeOp();

    const tracks = await Track.findAll({
      where: {
        isPublished: true,
        [Op.or]: [
          { title: { [likeOp]: `%${query}%` } },
          { genre: { [likeOp]: `%${query}%` } },
          { '$Artists.name$': { [likeOp]: `%${query}%` } },
          { '$Album.title$': { [likeOp]: `%${query}%` } },
        ]
      },
      include: this._include(),
      order: this._orderConfig(),
      subQuery: false,
    });

    return this.success(tracks, "Search results");
  }
}

export default new TrackService();