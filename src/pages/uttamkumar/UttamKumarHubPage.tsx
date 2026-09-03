import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UttamKumarLayout } from "../../components/uttamkumar/UttamKumarLayout";
import { TheStrip } from "../../components/uttamkumar/TheStrip";
import { CreditedImage } from "../../components/uttamkumar/CreditedImage";
import { BigTitle, Curtain, Kicker, Read } from "../../components/uttamkumar/scenes";
import { TOTAL_FILMS } from "../../data/uttamkumar/counts.generated";
import { LANDMARK_FILMS } from "../../data/uttamkumar/films";
import { PAGE_PATH, PAGE_SEO } from "../../data/seo";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import { buildJsonLd } from "../../lib/jsonld";
import { JsonLd } from "../../components/JsonLd";

/**
 * The strip is the page. Not a hub with cards linking to sections — the
 * whole career laid out as the film it was shot on, opened by a full
 * -viewport title card and scrolled through frame by frame. The other
 * wings still exist for the things a strip can't hold (the awards ledger,
 * the books, the sources), but this is the thing itself.
 */
export function UttamKumarHubPage() {
  const seo = PAGE_SEO.uttamkumar;
  useDocumentHead(seo, PAGE_PATH.uttamkumar);

  return (
    <UttamKumarLayout active="hub" bleed>
      <JsonLd data={buildJsonLd("uttamkumar")} />

      <Curtain>
        <div className="grid gap-8 md:grid-cols-[1.6fr_minmax(0,1fr)] md:items-end">
          <div>
            <Kicker>1926 — 2026 · One hundred years</Kicker>
            <BigTitle className="mt-3">
              Two hundred
              <br />
              and eleven
              <br />
              <span className="text-uk-gold">films.</span>
            </BigTitle>
            <Read className="mt-6">
              Uttam Kumar made {TOTAL_FILMS} of them in thirty-two years — a film every eight weeks,
              from a debut nobody watched to a career Bengal still measures its cinema against. Below
              is not a list of them. It is the strip they were shot on, one frame per film, laid out
              in the order they came: thin and dim through the years he was called Flop Master
              General, jammed solid through the fifties, and running out, mid-scene, in July 1980.
            </Read>
            <p className="uk-mono mt-6 text-[10px] uppercase tracking-[0.3em] text-uk-on-void-muted">
              Tap any frame to project it
            </p>
          </div>
          <CreditedImage slug="portrait-sketch-murty" className="w-36 justify-self-start md:w-full md:max-w-[240px]" />
        </div>
      </Curtain>

      <TheStrip />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mt-16 max-w-4xl px-8 pb-4 sm:px-14"
      >
        <p className="uk-mono text-[9.5px] uppercase tracking-[0.3em] text-uk-gold">What the strip can't hold</p>
        <div className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {[
            { to: PAGE_PATH.uttamkumarFilms, label: "The filmography, searchable", note: `all ${TOTAL_FILMS}, filterable by era — ${LANDMARK_FILMS.length} with a full synopsis` },
            { to: PAGE_PATH.uttamkumarSuchitra, label: "Uttam & Suchitra", note: "the pairing as its own subject, rumor included" },
            { to: PAGE_PATH.uttamkumarLife, label: "The life, in full", note: "including the marriages and the 1976 broadcast" },
            { to: PAGE_PATH.uttamkumarAwards, label: "Awards & honours", note: "the first National Award for Best Actor ever given" },
            { to: PAGE_PATH.uttamkumarBooks, label: "The reading room", note: "two unfinished autobiographies, one real biography" },
            { to: PAGE_PATH.uttamkumarWords, label: "Voices", note: "Ray, Soumitra, Bachchan, Dilip Kumar" },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="group border-b border-uk-outline-variant/60 py-2.5 transition-colors hover:border-uk-gold"
            >
              <p className="text-[14px] font-semibold text-uk-on-void group-hover:text-uk-gold">{l.label}</p>
              <p className="text-[12px] text-uk-on-void-muted">{l.note}</p>
            </Link>
          ))}
        </div>
      </motion.div>
    </UttamKumarLayout>
  );
}
