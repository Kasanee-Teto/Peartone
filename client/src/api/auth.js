import { http, httpRaw } from "./http.js";

export const authApi = {
  register: ({ username, email, password }) =>
    httpRaw("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    }),

  login: ({ username, password }) =>
    httpRaw("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  async loginAndStore(credentials) {
    const res = await this.login(credentials);
    const { token, user } = res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("pt_user", JSON.stringify(user));
    return { token, user };
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("pt_user");
  },
};