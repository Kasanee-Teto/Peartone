const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

async function parseBody(res) {
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

export async function httpRaw(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = { ...(options.headers || {}) };
  const isFormData = options.body instanceof FormData;

  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const payload = await parseBody(res);

  if (!res.ok) throw new Error(payload?.message || "Request failed");
  return payload;
}

export async function http(path, options = {}) {
  const payload = await httpRaw(path, options);
  return payload?.data ?? payload;
}