import { useEffect, useState } from "react";

const ip = "localhost:5000"

export const useFetch = (key, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    method = "GET",
    body = null,
    headers = {},
    enabled = true,
  } = options;

  useEffect(() => {
    if (!enabled || !key) return;

    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`http://${ip}/${key}`, {
          method,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: body ? JSON.stringify(body) : null,
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [key, method, JSON.stringify(body), enabled]);

  return { data, loading, error };
};
