import { useEffect, useRef, useState } from "react";

/**
 * Posts one increment to /api/pageview for `path` on mount (and again if
 * `path` changes, i.e. a client-side navigation to another Tarakeswar page),
 * and returns the resulting count. Returns `null` — and the footer simply
 * hides the counter — when the endpoint isn't there, which is the normal
 * case during `vite dev` without Wrangler, the same rule useAboardCount
 * follows for the "N aboard" figure.
 *
 * Guarded so a given path is only ever posted once per mount, even under
 * React StrictMode's dev-only double-invoke of effects.
 */
export function useTarakeswarPageViews(path: string): number | null {
  const [count, setCount] = useState<number | null>(null);
  const posted = useRef<string | null>(null);

  useEffect(() => {
    if (posted.current === path) return;
    posted.current = path;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/pageview", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ path }),
        });
        if (!res.ok) return;
        const data = (await res.json()) as { count?: number | null };
        if (!cancelled && typeof data.count === "number") setCount(data.count);
      } catch {
        /* offline or function not running locally — leave the counter hidden */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [path]);

  return count;
}
