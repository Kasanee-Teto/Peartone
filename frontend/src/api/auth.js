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

  getProfile: () => http("/auth/me"),

  updateProfile: ({ username, email, location, bio }) =>
    http("/auth/me", {
      method: "PUT",
      body: JSON.stringify({ username, email, location, bio }),
    }),

  async loginAndStore(credentials) {
    const res = await this.login(credentials);
    const { token, user } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("pt_user", JSON.stringify(user));
    window.dispatchEvent(new Event("auth-changed"));

    return { token, user };
  },

  async logout() {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        await http("/auth/logout", {
          method: "POST",
        });
      }
    } catch (err) {
      console.error("Logout request failed", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("pt_user"); 
      window.dispatchEvent(new Event('auth-changed'));
    }
  },
};