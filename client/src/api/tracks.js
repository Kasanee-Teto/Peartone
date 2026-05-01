import { httpRaw } from "./http.js";

export const tracksApi = {
  list: ({ q, page, limit } = {}) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));

    const qs = params.toString();
    return httpRaw(`/tracks${qs ? `?${qs}` : ""}`);
  },
};