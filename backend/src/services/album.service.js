import { Op } from "sequelize";
import db from "../models/index.js";
import BaseService from "./base.service.js";

const { Album, Artist, Track, TrackArtist } = db;

class AlbumService extends BaseService {
  _includeList() {
    return [
      { 
        model: Artist, 
        as: "Artist" 
      } 
    ];
  }

  _includeDetail() {
    return [
      { 
        model: Artist, 
        as: "Artist" 
      },
      {
        model: Track,
        as: "Tracks", 
        include: [
          {
            model: db.Artist,
            as: "Artists", 
            through: { attributes: ["artistOrder", "role"] },
            order: [[TrackArtist, "artistOrder", "ASC"]]
          }
        ]
      }
    ];
  }

  async list({ q, page = 1, limit = 10 } = {}) {
    const query = (q || "").trim();

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const offset = (pageNum - 1) * limitNum;

    const where = {};
    if (query) {
      where.title = { [Op.like]: `%${query}%` }; 
    }

    const { rows, count } = await Album.findAndCountAll({
      where,
      include: this._includeList(),
      order: [["createdAt", "DESC"]],
      limit: limitNum,
      offset,
      distinct: true
    });

    return {
      ...this.success(rows, "Albums fetched"),
      meta: {
        page: pageNum,
        limit: limitNum,
        total: count,
        totalPages: Math.ceil(count / limitNum)
      }
    };
  }

  async getById(id) {
    const album = await Album.findByPk(id, {
      include: this._includeDetail(), 
      order: [
        [{ model: Track, as: 'Tracks' }, "createdAt", "DESC"]
      ]
    });

    if (!album) {
      return this.error("Album not found!", 404);
    }

    return this.success(album, "Album fetched");
  }

  async search(q) {
    const query = (q || "").trim();
    if (!query) return this.success([], "Empty query");

    const albums = await Album.findAll({
      where: { title: { [Op.like]: `%${query}%` } }, 
      include: this._includeList(),
      order: [["createdAt", "DESC"]]
    });

    return this.success(albums, "Albums fetched");
  }
}

export default new AlbumService();
