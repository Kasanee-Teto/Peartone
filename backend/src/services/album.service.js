import { Op } from "sequelize";
import db from "../models/index.js";
import BaseService from "./base.service.js";

const { Album, Artist, Track, TrackArtist } = db;

class AlbumService extends BaseService {
  _includeList() {
    return [
      { 
        model: Artist, 
        as: "Artists" 
      } 
    ];
  }

  _includeDetail() {
    return [
      { 
        model: Artist, 
        as: "Artists" 
      },
      {
        model: Track,
        as: "Track", 
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

  async list() {
    const albums = await Album.findAll({
      include: [{ model: Artist }], 
      order: [["createdAt", "DESC"]]
    });

    return this.success(albums, "Albums fetched");
  }

  async getById(id) {
    const album = await Album.findByPk(id, {
      include: [
        { model: Artist },
        {
          model: Track,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: db.Artist,
              through: { attributes: ["artistOrder", "role"] }
            }
          ]
        }
      ]
    });

    return this.success(album, "Album fetched");
  }

  async search(q) {
    const query = (q || "").trim();
    if (!query) return this.success([], "Empty query");

    const albums = await Album.findAll({
      where: { title: { [Op.iLike]: `%${query}%` } },
      include: [{ model: Artist }],
      order: [["createdAt", "DESC"]]
    });

    return this.success(albums, "Albums fetched");
  }
}

export default new AlbumService();