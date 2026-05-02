import { useCallback, useEffect, useState } from "react";
import { http, httpRaw } from "../api/http.js";

const EMPTY_OPTIONS = Object.freeze({});
const EMPTY_OVERRIDE = Object.freeze({});
const DEFAULT_CONFIG = Object.freeze({ raw: false });

export function useFetch(
  path,
  options = EMPTY_OPTIONS,
  immediate = true,
  config = DEFAULT_CONFIG
) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const execute = useCallback(
    async (override = EMPTY_OVERRIDE) => {
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