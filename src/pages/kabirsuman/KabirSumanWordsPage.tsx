import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { DispatchHero } from "../../components/kabirsuman/DispatchHero";
import { KabirSumanLayout } from "../../components/kabirsuman/KabirSumanLayout";
import { KsFacts, KsSection } from "../../components/kabirsuman/shared";
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

  const top10 = data?.entries.slice(0, 10) ?? [];
  const maxN = top10[0]?.n ?? 1;

  return (
    <KabirSumanLayout active="words">
      <JsonLd data={buildJsonLd("kabirsumanWords")} />
      <DispatchHero eyebrow="শব্দকোষ · A Vocabulary, Counted" h1={seo.h1} intro={seo.intro} />
      <KsFacts facts={seo.facts} />

      {top10.length > 0 && (
        <KsSection id="top-words" heading="His ten most-used words">
          <p className="mb-4 max-w-[55ch] text-[13px] leading-relaxed text-ks-ink-muted">
            Not a guess at his themes — a straight count. Tap any bar to see every song it turns up in.
          </p>
          <div className="flex flex-col gap-1.5">
            {top10.map((e, i) => (
              <motion.button
                key={e.w}
                type="button"
                onClick={() => setSelected(e)}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ type: "spring", stiffness: 260, damping: 24, delay: i * 0.05 }}
                className="group grid grid-cols-[26px_60px_1fr_44px] items-center gap-2 rounded-[var(--radius-xs)] px-1 py-1 text-left transition-colors hover:bg-ks-paper-container/70"
              >
                <span className="ks-mono text-[11px] text-ks-ink-muted">{i + 1}</span>
                <span className="ks-bengali truncate text-[14px] font-semibold text-ks-ink">{e.w}</span>
                <span className="h-4 overflow-hidden rounded-full bg-ks-paper-container">
                  <motion.span
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(e.n / maxN) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 120, damping: 22, delay: 0.1 + i * 0.05 }}
                    className="block h-full rounded-full bg-ks-red group-hover:bg-ks-red-dim"
                  />
                </span>
                <span className="ks-mono text-right text-[11px] text-ks-ink-muted">{e.n}</span>
              </motion.button>
            ))}
          </div>
        </KsSection>
      )}

      <KsSection id="search" heading="Search every recurring word">
        {data && (
          <p className="ks-mono mb-3 text-[11px] text-ks-ink-muted">
            {data.stats.tokens.toLocaleString("en")} words across {data.stats.songs} songs · {data.stats.indexed.toLocaleString("en")} indexed here
          </p>
        )}

        <input
          type="search"
          inputMode="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(null);
          }}
          placeholder="খুঁজুন — search a Bengali word"
          className="ks-bengali w-full rounded-[var(--radius-sm)] border-2 border-ks-ink bg-ks-paper-bright px-4 py-2.5 text-[16px] text-ks-ink placeholder:text-ks-ink-muted focus:outline-none"
        />

        {loading && <p className="mt-6 text-[13px] text-ks-ink-muted">Loading the lexicon…</p>}

        <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_1.2fr]">
          <ul className="flex max-h-[480px] flex-col divide-y divide-ks-outline-variant overflow-y-auto rounded-[var(--radius-sm)] border border-ks-outline-variant">
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

          <div className="rounded-[var(--radius-sm)] border border-dashed border-ks-outline bg-ks-paper-container/50 p-4">
            {!selected && <p className="text-[13px] text-ks-ink-muted">Pick a word to see every song it appears in.</p>}
            {selected && (
              <motion.div key={selected.w} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 280, damping: 26 }}>
                <p className="ks-bengali text-[22px] font-semibold text-ks-ink">{selected.w}</p>
                <p className="ks-mono mt-1 text-[11px] uppercase tracking-wide text-ks-brass-dim">
                  {selected.n} occurrence{selected.n === 1 ? "" : "s"}, {selected.s.length} song{selected.s.length === 1 ? "" : "s"}
                </p>

                <DecadeSparkline byDecade={selected.d} />

                <ul className="mt-3 flex max-h-[220px] flex-col gap-1.5 overflow-y-auto">
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
              </motion.div>
            )}
          </div>
        </div>
      </KsSection>
    </KabirSumanLayout>
  );
}

/** A small decade-by-decade bar reading for one word — the concordance's own
 *  "when did he use this" answer, not just "how often." */
function DecadeSparkline({ byDecade }: { byDecade: Record<string, number> }) {
  const decades = Object.keys(byDecade).sort();
  if (decades.length < 2) return null;
  const max = Math.max(...decades.map((d) => byDecade[d]));
  return (
    <div className="mt-3 flex items-end gap-1.5 border-t border-ks-outline-variant pt-3">
      {decades.map((d) => (
        <div key={d} className="flex flex-1 flex-col items-center gap-1">
          <span
            aria-hidden
            className="w-full rounded-t-sm bg-ks-brass"
            style={{ height: `${Math.max(6, (byDecade[d] / max) * 40)}px` }}
          />
          <span className="ks-mono text-[9px] text-ks-ink-muted">{d}s</span>
        </div>
      ))}
    </div>
  );
}
