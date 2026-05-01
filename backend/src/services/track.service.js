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

  async list({ q, page = 1, limit = 10 } = {}) {
    const query = (q || "").trim();

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const offset = (pageNum - 1) * limitNum;

    const where = { isPublished: true };

    if (query) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${query}%` } },
        { genre: { [Op.iLike]: `%${query}%` } }
      ];
    }

    const { rows, count } = await Track.findAndCountAll({
      where,
      include: this._include(),
      order: [
        ["createdAt", "DESC"], 
        [{ model: Artist, as: 'Artists' }, TrackArtist, 'artistOrder', 'ASC'] 
      ],
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
        order: [[ { model: Artist, as: 'Artists' }, TrackArtist, 'artistOrder', 'ASC' ]]
      });
      return this.success(track, "Track fetched");
  }

  async search(q) {
    const query = (q || "").trim();
    if (!query) return this.success([], "Empty query");

    const orderConfig = [
      ["createdAt", "DESC"],
      [{ model: Artist, as: 'Artists' }, TrackArtist, 'artistOrder', 'ASC']
    ];

    const tracks = await Track.findAll({
      where: {
        isPublished: true,
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { genre: { [Op.iLike]: `%${query}%` } },
          { '$Album.title$': { [Op.iLike]: `%${query}%` } },
          { '$Artists.name$': { [Op.iLike]: `%${query}%` } }
        ]
      },
      include: this._include(),
      order: orderConfig,
      subQuery: false
    });

    const tracksByRelation = await Track.findAll({
      where: { isPublished: true },
      include: [
        { 
          model: Album, 
          as: "Album", 
          where: { title: { [Op.iLike]: `%${query}%` } }, 
          required: true 
        },
        {
          model: Artist,
          as: "Artists",
          through: { attributes: ["artistOrder", "role"] },
          where: { name: { [Op.iLike]: `%${query}%` } },
          required: true 
        }
      ],
      order: orderConfig
    });

    const tracksByTitle = await Track.findAll({
      where: { isPublished: true, title: { [Op.iLike]: `%${query}%` } },
      include: this._include(),
      order: orderConfig
    });

    const map = new Map();
    [...tracks, ...tracksByRelation,...tracksByTitle].forEach((t) => map.set(t.id, t));
    return this.success([...map.values()], "Search results");
  }
}

export default new TrackService();