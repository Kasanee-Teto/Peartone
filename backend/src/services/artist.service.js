import db from "../models/index.js";
import BaseService from "./base.service.js";
import ApiError from "../utils/apiError.js";

const { Artist } = db;

class ArtistService extends BaseService {
  async createArtist(data, file) {
    if (!data.name) {
      throw new ApiError(400, "Artist name is required");
    }

    const artist = await Artist.create({
      name: data.name,
      bio: data.bio || null,
      imageUrl: file ? `/storage/artists/${file.filename}` : null
    });

    return this.success(artist, "Artist created");
  }
}

export default new ArtistService();