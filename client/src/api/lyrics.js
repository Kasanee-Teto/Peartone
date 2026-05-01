import { httpRaw } from "./http.js";

export const lyricsApi = {
  getByTrackId: (trackId) => httpRaw(`/lyrics/${trackId}`),
};