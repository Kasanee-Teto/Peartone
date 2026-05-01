import { useCallback, useEffect, useState } from "react";
import { http, httpRaw } from "../api/http.js";

export function useFetch(
  path,
  options = {},
  immediate = true,
  config = { raw: false }
) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const execute = useCallback(
    async (override = {}) => {
      setLoading(true);
      setError("");

      try {
        const finalOptions = { ...options, ...override };

        const result = config?.raw
          ? await httpRaw(path, finalOptions)
          : await http(path, finalOptions);

        setData(result);
        return result;
      } catch (err) {
        setError(err?.message || "Request failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [path, options, config?.raw]
  );

  useEffect(() => {
    if (!immediate) return;
    execute();
  }, [execute, immediate]);

  return { data, error, loading, execute };
}