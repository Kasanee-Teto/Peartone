import { httpRaw } from "./http.js";

export const historyApi = {
  list: ({ limit } = {}) => {
    const params = new URLSearchParams();
    if (limit) params.set("limit", String(limit));

    const qs = params.toString();
    return httpRaw(`/history${qs ? `?${qs}` : ""}`);
  },

  add: ({ trackId, msPlayed } = {}) =>
    httpRaw("/history", {
      method: "POST",
      body: JSON.stringify({ trackId, msPlayed }),
    }),

  clear: () =>
    httpRaw("/history", {
      method: "DELETE",
    }),
};
