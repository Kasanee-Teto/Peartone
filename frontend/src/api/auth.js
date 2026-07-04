import { http, httpRaw } from "./http.js";

export const authApi = {
  register: ({ username, email, password }) =>
    httpRaw("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
      skipAuth: true
    }),

  login: ({ username, password }) =>
    httpRaw("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      skipAuth: true
    }),

  getProfile: () => http("/auth/me"),

  updateProfile: ({ username, email, location, bio }) =>
    http("/auth/me", {
      method: "PUT",
      body: JSON.stringify({ username, email, location, bio }),
    }),

  async loginAndStore(credentials) {
    try {
      const res = await this.login(credentials);

      if (!res || !res.data || !res.data.token) {
        throw new Error(res?.data?.message || "Invalid credentials or missing token.")
      }

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("pt_user", JSON.stringify(user));
      window.dispatchEvent(new Event("auth-changed"));
      return { token, user };

    } catch (err) {
      console.log("Login flow failed:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("pt_user");
      throw err;
    }
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