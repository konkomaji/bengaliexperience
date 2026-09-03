import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FilmCard } from "../../components/uttamkumar/FilmCard";
import { UttamKumarLayout } from "../../components/uttamkumar/UttamKumarLayout";
import { UkFacts, UkHero, UkSection } from "../../components/uttamkumar/shared";
import { TOTAL_FILMS } from "../../data/uttamkumar/counts.generated";
import { ERA_LABEL, FILMS, LANDMARK_FILMS, type Film } from "../../data/uttamkumar/films";
import { MUSIC_CREDITS } from "../../data/uttamkumar/music";
import { PAGE_PATH, PAGE_SEO } from "../../data/seo";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import { buildJsonLd } from "../../lib/jsonld";
import { JsonLd } from "../../components/JsonLd";

/**
 * A curated viewing path for anyone new to his work, grouped by mood rather
 * than handing over one "best" title — the same "where to start" move
 * Kabir Suman's landmarks.ts makes for his songs.
 */
const STARTER_PATH: { theme: string; note: string; slugs: string[] }[] = [
  {
    theme: "If you want the art-cinema case for him",
    note: "Satyajit Ray directing the actor everyone else treated as a matinee idol.",
    slugs: ["nayak-1966", "chiriyakhana-1967"],
  },
  {
    theme: "If you want the Uttam-Suchitra romance at its peak",
    note: "The pairing's best-remembered work.",
    slugs: ["agni-pariksha-1954", "saptapadi-1961"],
  },
  {
    theme: "If you want range beyond the romantic lead",
    note: "A servant, a triple-role swashbuckler, a villain.",
    slugs: ["khokababur-pratyabartan-1960", "jhinder-bondi-1961", "stree-1972"],
  },
  {
    theme: "If you want the biggest hit of his career",
    note: "The Amanush/Sanyasi Raja run, and what mass Bengali cinema looked like at his peak.",
    slugs: ["amanush-1974", "sanyasi-raja-1975"],
  },
];

const WHERE_TO_WATCH =
  "No single licensed streaming source carries the whole catalogue, and what's available shifts without notice, so this page doesn't assert a fixed platform per film. In practice: Hoichoi and Amazon Prime Video's Bengali-classics libraries carry a rotating set of his best-known titles, and several studios (Angel Digital, SVF, Priya Bangla Movies) run official full-length uploads on YouTube. Check the title directly before assuming it's on any one of these.";

export function UttamKumarFilmsPage() {
  const seo = PAGE_SEO.uttamkumarFilms;
  useDocumentHead(seo, PAGE_PATH.uttamkumarFilms);

  const [era, setEra] = useState<keyof typeof ERA_LABEL | "all">("all");
  const [q, setQ] = useState("");

  const sorted = useMemo(() => [...FILMS].sort((a, b) => a.year - b.year || a.order - b.order), []);
  const filtered = useMemo(
    () =>
      sorted.filter((f) => {
        if (era !== "all" && f.detail?.era !== era) return false;
        if (q && !f.title.toLowerCase().includes(q.toLowerCase())) return false;
        return true;
      }),
    [sorted, era, q],
  );

  const acclaimed = LANDMARK_FILMS.filter((f) => f.detail?.acclaimed);
  const starterFilms = (slugs: string[]) => slugs.map((s) => FILMS.find((f) => f.slug === s)).filter((f): f is Film => !!f);

  return (
    <UttamKumarLayout active="films">
      <JsonLd data={buildJsonLd("uttamkumarFilms")} />
      <UkHero eyebrow="211 Films · The Filmography" h1={seo.h1} intro={seo.intro} />
      <UkFacts facts={seo.facts} />

      <UkSection id="acclaimed" heading={`Most Acclaimed (${acclaimed.length})`}>
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
          {acclaimed.map((f, i) => (
            <FilmCard key={f.slug} film={f} index={i} />
          ))}
        </div>
      </UkSection>

      <UkSection id="start" heading="Where to Start">
        <p className="mb-4 max-w-[62ch] text-[13.5px] leading-relaxed text-uk-on-void-muted">
          New to him? Four ways in, grouped by what you're in the mood for rather than one "best film."
        </p>
        <div className="flex flex-col gap-5">
          {STARTER_PATH.map((group) => (
            <div key={group.theme}>
              <p className="text-[13.5px] font-semibold text-uk-on-void">{group.theme}</p>
              <p className="mt-0.5 text-[12.5px] text-uk-on-void-muted">{group.note}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {starterFilms(group.slugs).map((f) => (
                  <Link
                    key={f.slug}
                    to={`/uttamkumar/film/${f.slug}`}
                    className="uk-mono rounded-sm border border-uk-gold/50 bg-uk-gold-container/25 px-2.5 py-1 text-[11px] font-semibold text-uk-on-gold-container hover:bg-uk-gold-container/45"
                  >
                    {f.title} ({f.year})
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </UkSection>

      <UkSection id="watch" heading="Where to Watch">
        <p className="max-w-[62ch] text-[13.5px] leading-relaxed text-uk-on-void-muted">{WHERE_TO_WATCH}</p>
      </UkSection>

      <UkSection id="all" heading={`All ${TOTAL_FILMS} Films`}>
        <div className="mb-4 flex flex-wrap gap-2">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title…"
            className="uk-mono min-w-0 flex-1 rounded-sm border border-uk-outline-variant bg-uk-void-dim px-2.5 py-1.5 text-[12px] text-uk-on-void placeholder:text-uk-on-void-muted"
          />
          <select
            value={era}
            onChange={(e) => setEra(e.target.value as typeof era)}
            className="uk-mono rounded-sm border border-uk-outline-variant bg-uk-void-dim px-2 py-1.5 text-[11px] text-uk-on-void"
          >
            <option value="all">All eras</option>
            {Object.entries(ERA_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <ol className="flex flex-col gap-1.5">
          {filtered.map((f) => (
            <li key={f.slug} className="flex items-baseline gap-2 border-b border-uk-outline-variant/60 py-1.5 text-[13px]">
              <span className="uk-mono w-11 shrink-0 text-uk-gold">{f.year}</span>
              {f.detail ? (
                <Link to={`/uttamkumar/film/${f.slug}`} className="font-medium text-uk-on-void hover:text-uk-gold hover:underline">
                  {f.title}
                </Link>
              ) : (
                <span className="text-uk-on-void">{f.title}</span>
              )}
              {f.role && <span className="text-uk-on-void-muted">— {f.role}</span>}
            </li>
          ))}
        </ol>
        {filtered.length === 0 && <p className="text-[13px] text-uk-on-void-muted">No films match that search.</p>}
      </UkSection>

      <UkSection id="music" heading="Also: Singer and Composer">
        <ul className="flex flex-col gap-1.5 text-[13px] text-uk-on-void-muted">
          {MUSIC_CREDITS.map((m) => (
            <li key={m.film}>
              {m.year} — <span className="text-uk-on-void">{m.film}</span>, as {m.role}. {m.note}
            </li>
          ))}
        </ul>
      </UkSection>
    </UttamKumarLayout>
  );
}
