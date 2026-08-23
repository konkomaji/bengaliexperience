import { useEffect, useState } from "react";

export interface ConcordanceEntry {
  /** the word */
  w: string;
  /** total occurrences across the catalogue */
  n: number;
  /** song slugs it appears in, sorted */
  s: string[];
  /** occurrences by decade, e.g. { "1990": 12, "2000": 4 } */
  d: Record<string, number>;
}

export interface Concordance {
  stats: { tokens: number; uniqueForms: number; indexed: number; songs: number };
  entries: ConcordanceEntry[];
}

let promise: Promise<Concordance> | null = null;

/**
 * Loads the whole concordance once, on first use, and caches it — it is one
 * ~420KB file (see scripts/lib/concordance.mjs) which is too large to want
 * in the JS bundle by default but small enough to hold in memory whole once
 * a visitor actually opens the search page, rather than re-fetching per
 * keystroke.
 */
export function useSumanConcordance() {
  const [data, setData] = useState<Concordance | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!promise) {
      promise = fetch("/kabirsuman/concordance.json").then((r) => {
        if (!r.ok) throw new Error(`concordance fetch failed (${r.status})`);
        return r.json();
      });
    }
    let cancelled = false;
    promise.then((d) => !cancelled && setData(d)).catch((e) => !cancelled && setError(e));
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, error, loading: !data && !error };
}
