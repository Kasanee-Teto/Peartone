import { httpRaw } from "./http.js";

export const playlistsApi = {
  listMine: () => httpRaw("/playlists"),
  getMine: (id) => httpRaw(`/playlists/${id}`),

  create: (name) =>
    httpRaw("/playlists", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),

  delete: (id) =>
    httpRaw(`/playlists/${id}`, {
      method: "DELETE",
    }),

  addTrack: (playlistId, trackId) =>
    httpRaw(`/playlists/${playlistId}/tracks`, {
      method: "POST",
      body: JSON.stringify({ trackId }),
    }),

  removeTrack: (playlistId, trackId) =>
    httpRaw(`/playlists/${playlistId}/tracks/${trackId}`, {
      method: "DELETE",
    }),
};