// client/src/hooks/useFetch.js
import { useEffect, useState } from "react";

export default function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(url));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController();
    let active = true;

    // set state dengan aman
    setLoading(true);
    setError("");

    (async () => {
      try {
        const res = await fetch(url, { ...options, signal: controller.signal });

        const contentType = res.headers.get("content-type") || "";
        const isJson = contentType.includes("application/json");
        const body = isJson ? await res.json() : await res.text();

        if (!res.ok) {
          const msg =
            (isJson && body?.message) ||
            (typeof body === "string" ? body.slice(0, 120) : "") ||
            `Request failed (${res.status})`;
          throw new Error(msg);
        }

        if (active) setData(body);
      } catch (err) {
        if (!active) return;
        if (err.name === "AbortError") return;
        setError(err.message || "Fetch error");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
      controller.abort();
    };
    // sengaja depend hanya url supaya tidak loop karena options object berubah terus
  }, [url]);

  return { data, loading, error };
}