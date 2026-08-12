import { useEffect } from "react";

/** Keeps the #ld-json script (pre-seeded in index.html, rewritten per route
 *  at the edge) accurate after client-side navigation too. */
export function JsonLd({ data }: { data: unknown }) {
  useEffect(() => {
    const el = document.getElementById("ld-json");
    if (el) el.textContent = JSON.stringify(data);
  }, [data]);
  return null;
}
