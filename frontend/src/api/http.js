const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api";

async function parseBody(res) {
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

function normalizePath(path) {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export async function httpRaw(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = { ...(options.headers || {}) };
  const isFormData = options.body instanceof FormData;

  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  // auto attach Bearer token
  if (token) headers.Authorization = `Bearer ${token}`;

  const url = `${API_BASE_URL}${normalizePath(path)}`;

  const res = await fetch(url, { ...options, headers });
  const payload = await parseBody(res);

  if (!res.ok) {
    const msg =
      (typeof payload === "object" && payload?.message) ||
      (typeof payload === "string" && payload) ||
      "Request failed";
    throw new Error(msg);
  }

  return payload;
}

export async function http(path, options = {}) {
  const payload = await httpRaw(path, options);
  return payload?.data ?? payload;
}