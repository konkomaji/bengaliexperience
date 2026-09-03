import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FilmCard } from "../../components/uttamkumar/FilmCard";
import { LifeReel } from "../../components/uttamkumar/LifeReel";
import { UttamKumarLayout } from "../../components/uttamkumar/UttamKumarLayout";
import { UkFacts, UkHero, UkSection } from "../../components/uttamkumar/shared";
import { TOTAL_FILMS } from "../../data/uttamkumar/counts.generated";
import { LANDMARK_FILMS } from "../../data/uttamkumar/films";
import { LIFE_EVENTS } from "../../data/uttamkumar/life";
import { QUOTES } from "../../data/uttamkumar/quotes";
import { CENTENARY_EVENTS } from "../../data/uttamkumar/centenary";
import { PAGE_PATH, PAGE_SEO } from "../../data/seo";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import { ArrowRightIcon } from "../../components/icons";
import { buildJsonLd } from "../../lib/jsonld";
import { JsonLd } from "../../components/JsonLd";

export function UttamKumarHubPage() {
  const seo = PAGE_SEO.uttamkumar;
  useDocumentHead(seo, PAGE_PATH.uttamkumar);

  const acclaimed = LANDMARK_FILMS.filter((f) => f.detail?.acclaimed);
  const spine = LIFE_EVENTS.filter((e) => [1926, 1952, 1954, 1967, 1974, 1980, 2026].includes(e.year));
  const latestCentenary = CENTENARY_EVENTS[0];

  return (
    <UttamKumarLayout active="hub">
      <JsonLd data={buildJsonLd("uttamkumar")} />
      <UkHero eyebrow="Mahanayak · The Great Hero" h1={seo.h1} intro={seo.intro} />
      <UkFacts facts={seo.facts} />

      {latestCentenary && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 240, damping: 22 }}
          className="mt-8 border-l-4 border-uk-gold bg-uk-curtain/40 px-5 py-4"
        >
          <p className="uk-mono text-[10px] uppercase tracking-[0.2em] text-uk-gold">Happening now — {latestCentenary.date}</p>
          <p className="mt-1 text-[14.5px] leading-snug text-uk-on-void">{latestCentenary.headline}</p>
          <Link to={PAGE_PATH.uttamkumarCentenary} className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-uk-gold hover:underline">
            The full centenary programme <ArrowRightIcon size={12} />
          </Link>
        </motion.div>
      )}

      <UkSection id="life" heading="A Life, in Brief">
        <LifeReel events={spine} />
        <Link to={PAGE_PATH.uttamkumarLife} className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-uk-gold hover:underline">
          The full life, chronologically <ArrowRightIcon size={12} />
        </Link>
      </UkSection>

      <UkSection id="acclaimed" heading={`Most Acclaimed (${acclaimed.length})`}>
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
          {acclaimed.slice(0, 10).map((f, i) => (
            <FilmCard key={f.slug} film={f} index={i} />
          ))}
        </div>
        <Link to={PAGE_PATH.uttamkumarFilms} className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-uk-gold hover:underline">
          All {TOTAL_FILMS} films <ArrowRightIcon size={12} />
        </Link>
      </UkSection>

      <UkSection id="suchitra" heading="Uttam & Suchitra">
        <p className="max-w-[58ch] text-[14px] leading-relaxed text-uk-on-void-muted">
          No pairing defined Bengali commercial cinema more completely — around 30 films together,
          the marketing that called them "Witness of Our Real Love," and the off-screen rumor
          examined honestly rather than repeated as fact.
        </p>
        <Link to={PAGE_PATH.uttamkumarSuchitra} className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-uk-gold hover:underline">
          Explore the pairing <ArrowRightIcon size={12} />
        </Link>
      </UkSection>

      <UkSection id="voice" heading="In Their Words">
        <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0">
          {QUOTES.slice(0, 3).map((q) => (
            <blockquote key={q.en.slice(0, 24)} className="min-w-[240px] snap-start border border-uk-outline-variant bg-uk-void-dim p-4 text-[13px] italic leading-snug text-uk-on-void sm:min-w-0">
              "{q.en}"
              <footer className="uk-mono mt-2 text-[10px] not-italic uppercase tracking-wide text-uk-gold">— {q.speaker}</footer>
            </blockquote>
          ))}
        </div>
        <Link to={PAGE_PATH.uttamkumarWords} className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-uk-gold hover:underline">
          Every voice, and the collaborators <ArrowRightIcon size={12} />
        </Link>
      </UkSection>
    </UttamKumarLayout>
  );
}
