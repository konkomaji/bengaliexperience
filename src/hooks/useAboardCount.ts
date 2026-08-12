import { useEffect, useState } from "react";

const VISITOR_KEY = "be:visitorId";
const HEARTBEAT_MS = 45_000;

function visitorId(): string {
  let id = window.localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

/**
 * Polls /api/aboard for the live listener count. Returns null — and the
 * header simply hides the counter — when the endpoint isn't there, which is
 * the normal case during `vite dev` without Wrangler.
 */
export function useAboardCount(): number | null {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const id = visitorId();

    async function beat() {
      try {
        const res = await fetch("/api/aboard", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (!res.ok) return;
        const data = (await res.json()) as { count?: number };
        if (!cancelled && typeof data.count === "number") setCount(data.count);
      } catch {
        /* offline or function not running locally — leave the counter hidden */
      }
    }

    void beat();
    const timer = window.setInterval(beat, HEARTBEAT_MS);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  return count;
}
