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
        through: { attributes: ["artistOrder", "role"] },
        order: [[TrackArtist, "artistOrder", "ASC"]]
      }
    ];
  }

  async list() {
    const tracks = await Track.findAll({
      where: { isPublished: true },
      include: this._include(),
      order: [["createdAt", "DESC"]]
    });
    return this.success(tracks, "Tracks fetched");
  }

  async getById(id) {
    const track = await Track.findByPk(id, { include: this._include() });
    return this.success(track, "Track fetched");
  }

  async search(q) {
    const query = (q || "").trim();
    if (!query) return this.success([], "Empty query");

    const tracks = await Track.findAll({
      where: { isPublished: true },
      include: [
        { model: Album, as: "Album", where: { title: { [Op.iLike]: `%${query}%` } }, required: false },
        {
          model: Artist,
          as: "Artists",
          through: { attributes: ["artistOrder", "role"] },
          where: { name: { [Op.iLike]: `%${query}%` } },
          required: false
        }
      ],
      having: undefined,
      order: [["created_at", "DESC"]]
    });

    const tracksByTitle = await Track.findAll({
      where: { isPublished: true, title: { [Op.iLike]: `%${query}%` } },
      include: this._include(),
      order: [["createdAt", "DESC"]]
    });

    const map = new Map();
    [...tracks, ...tracksByTitle].forEach((t) => map.set(t.id, t));
    return this.success([...map.values()], "Search results");
  }
}

export default new TrackService();