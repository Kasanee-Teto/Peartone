import { httpRaw } from "./http.js";

export const likesApi = {
  list: ({ q, page, limit } = {}) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));

    const qs = params.toString();
    return httpRaw(`/likes${qs ? `?${qs}` : ""}`);
  },

  like: (trackId) =>
    httpRaw(`/likes/${trackId}`, {
      method: "POST",
    }),

  unlike: (trackId) =>
    httpRaw(`/likes/${trackId}`, {
      method: "DELETE",
    }),

  toggle: (trackId) =>
    httpRaw(`/likes/${trackId}/toggle`, {
      method: "POST",
    }),
};
