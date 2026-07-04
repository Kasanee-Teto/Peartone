import { authApi } from "../api/auth.js";

export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
export const ASSET_BASE = import.meta.env.VITE_ASSET_BASE_URL || API_BASE.replace(/\/api\/?$/, "");

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
    if (coverUrl.includes(ASSET_BASE)) return coverUrl;

    const cleanPath = coverUrl.startsWith("/") ? coverUrl : `/${coverUrl}`;
    return `${ASSET_BASE}${cleanPath}`;
};

export const getCoverUrl = (track) => {
  const raw =
    track?.cover_url ||
    track?.cover ||
    track?.coverUrl ||
    track?.image ||
    track?.imageUrl ||
    track?.Album?.cover ||
    track?.Album?.coverUrl ||
    "";

  return buildCoverUrl(raw);
};

export const handleLogout = async ( setIsSidebarOpen, navigate ) => {
  try {
    await authApi.logout();
    if (setIsSidebarOpen) setIsSidebarOpen(false);
    if (navigate) navigate("/login");
  } catch (err) {
    console.error("Logout failed", err);
  }
};