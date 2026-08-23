import { useEffect, useState } from "react";

/** One album's worth of lyrics: song slug -> stanzas -> lines. */
type LyricFile = Record<string, string[][]>;

const cache = new Map<string, Promise<LyricFile>>();

function fetchLyricFile(albumSlug: string): Promise<LyricFile> {
  let p = cache.get(albumSlug);
  if (!p) {
    p = fetch(`/kabirsuman/lyrics/${albumSlug}.json`).then((r) => {
      if (!r.ok) throw new Error(`lyrics fetch failed: ${albumSlug} (${r.status})`);
      return r.json();
    });
    cache.set(albumSlug, p);
  }
  return p;
}

/**
 * Fetches one song's stanzas on demand.
 *
 * The 317-song lyric corpus is ~660KB and lives one JSON file per album
 * under /public/kabirsuman/lyrics/ (see scripts/prepare-suman.mjs) rather
 * than in the JS bundle, so a visitor reading one song downloads that
 * song's album file — a few KB — not the whole catalogue.
 */
export function useSumanLyrics(albumSlug: string | null, songSlug: string) {
  const [stanzas, setStanzas] = useState<string[][] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setStanzas(null);
    setError(null);
    const key = albumSlug ?? "uncollected";
    let cancelled = false;
    fetchLyricFile(key)
      .then((file) => {
        if (cancelled) return;
        setStanzas(file[songSlug] ?? null);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e : new Error(String(e)));
      });
    return () => {
      cancelled = true;
    };
  }, [albumSlug, songSlug]);

  return { stanzas, error, loading: stanzas === null && error === null };
}
