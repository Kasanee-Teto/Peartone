import { authApi } from "../api/auth";

export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
export const ASSET_BASE = API_BASE.replace(/\/api\/?$/, "");

export const authFetch = (url, options = {}) => {
  const token = localStorage.getItem("token");
  return fetch(url, {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
};

export const buildCoverUrl = (coverUrl) => {
    if (!coverUrl) return null;
    if (coverUrl.startsWith("http")) return coverUrl;
    const cleanPath = coverUrl.startsWith("/") ? coverUrl : `/${coverUrl}`;
    return `${ASSET_BASE}${cleanPath}`;
};

export const handleLogout = async () => {
    try {
      await authApi.logout();
      setIsSidebarOpen(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };