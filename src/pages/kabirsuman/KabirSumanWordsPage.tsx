import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { KabirSumanLayout } from "../../components/kabirsuman/KabirSumanLayout";
import { KsFacts, KsHero } from "../../components/kabirsuman/shared";
import { SONG_BY_SLUG } from "../../data/kabirsuman/catalogue";
import { KABIRSUMAN_SONG_PREFIX, PAGE_PATH, PAGE_SEO } from "../../data/seo";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import { useSumanConcordance, type ConcordanceEntry } from "../../hooks/useSumanConcordance";
import { buildJsonLd } from "../../lib/jsonld";
import { JsonLd } from "../../components/JsonLd";

export function KabirSumanWordsPage() {
  const seo = PAGE_SEO.kabirsumanWords;
  useDocumentHead(seo, PAGE_PATH.kabirsumanWords);
  const { data, loading } = useSumanConcordance();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ConcordanceEntry | null>(null);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.trim();
    const list = q ? data.entries.filter((e) => e.w.includes(q)) : data.entries;
    return list.slice(0, 80);
  }, [data, query]);

  return (
    <KabirSumanLayout active="words">
      <JsonLd data={buildJsonLd("kabirsumanWords")} />
      <KsHero eyebrow="Concordance" h1={seo.h1} intro={seo.intro} />
      <KsFacts facts={seo.facts} />

      {data && (
        <p className="ks-mono mt-6 text-[11px] text-ks-ink-muted">
          {data.stats.tokens.toLocaleString("en")} words across {data.stats.songs} songs · {data.stats.indexed.toLocaleString("en")} indexed here
        </p>
      )}

      <div className="mt-4">
        <input
          type="search"
          inputMode="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(null);
          }}
          placeholder="খুঁজুন — search a Bengali word"
          className="ks-bengali w-full border-2 border-ks-ink bg-ks-paper-bright px-4 py-2.5 text-[16px] text-ks-ink placeholder:text-ks-ink-muted focus:outline-none"
        />
      </div>

      {loading && <p className="mt-6 text-[13px] text-ks-ink-muted">Loading the concordance…</p>}

      <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_1.2fr]">
        <ul className="flex max-h-[480px] flex-col divide-y divide-ks-outline-variant overflow-y-auto border border-ks-outline-variant">
          {filtered.map((e) => (
            <li key={e.w}>
              <button
                type="button"
                onClick={() => setSelected(e)}
                className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left transition-colors hover:bg-ks-paper-container ${
                  selected?.w === e.w ? "bg-ks-paper-container" : ""
                }`}
              >
                <span className="ks-bengali text-[15px] text-ks-ink">{e.w}</span>
                <span className="ks-mono text-[11px] text-ks-ink-muted">{e.n} · {e.s.length} songs</span>
              </button>
            </li>
          ))}
          {!loading && filtered.length === 0 && (
            <li className="px-3 py-4 text-[13px] text-ks-ink-muted">No word matches that.</li>
          )}
        </ul>

        <div className="border border-dashed border-ks-outline bg-ks-paper-container/50 p-4">
          {!selected && <p className="text-[13px] text-ks-ink-muted">Pick a word to see every song it appears in.</p>}
          {selected && (
            <>
              <p className="ks-bengali text-[22px] font-semibold text-ks-ink">{selected.w}</p>
              <p className="ks-mono mt-1 text-[11px] uppercase tracking-wide text-ks-brass-dim">
                {selected.n} occurrence{selected.n === 1 ? "" : "s"}, {selected.s.length} song{selected.s.length === 1 ? "" : "s"}
              </p>
              <ul className="mt-3 flex flex-col gap-1.5">
                {selected.s.map((slug) => {
                  const song = SONG_BY_SLUG[slug];
                  if (!song) return null;
                  return (
                    <li key={slug}>
                      <Link to={`${KABIRSUMAN_SONG_PREFIX}/${slug}`} className="ks-bengali text-[13.5px] text-ks-ink hover:text-ks-red hover:underline">
                        {song.bn}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </div>
    </KabirSumanLayout>
  );
}
