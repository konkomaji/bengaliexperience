import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlbumCard } from "../../components/kabirsuman/AlbumCard";
import { DispatchHero } from "../../components/kabirsuman/DispatchHero";
import { KabirSumanLayout } from "../../components/kabirsuman/KabirSumanLayout";
import { LandmarkTile } from "../../components/kabirsuman/LandmarkTile";
import { QuoteClipping } from "../../components/kabirsuman/QuoteClipping";
import { ReelTimeline } from "../../components/kabirsuman/ReelTimeline";
import { KsFacts, KsSection } from "../../components/kabirsuman/shared";
import { ALBUMS } from "../../data/kabirsuman/catalogue";
import { LANDMARKS } from "../../data/kabirsuman/landmarks";
import { LIFE_EVENTS } from "../../data/kabirsuman/life";
import { QUOTES } from "../../data/kabirsuman/quotes";
import { PAGE_PATH, PAGE_SEO } from "../../data/seo";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import { ArrowRightIcon } from "../../components/icons";
import { buildJsonLd } from "../../lib/jsonld";
import { JsonLd } from "../../components/JsonLd";

export function KabirSumanHubPage() {
  const seo = PAGE_SEO.kabirsuman;
  useDocumentHead(seo, PAGE_PATH.kabirsuman);

  const debut = LIFE_EVENTS.find((e) => e.year === 1992);
  const spine = LIFE_EVENTS.filter((e) => [1949, 1992, 2009, 2014, 2020].includes(e.year));

  return (
    <KabirSumanLayout active="hub">
      <JsonLd data={buildJsonLd("kabirsuman")} />
      <DispatchHero eyebrow="একটি শ্রদ্ধার্ঘ্য · A Tribute Archive" h1={seo.h1} intro={seo.intro} />
      <KsFacts facts={seo.facts} />

      {debut && (
        <motion.blockquote
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 240, damping: 22 }}
          className="ks-bengali mt-8 border-l-4 border-ks-red bg-ks-paper-bright px-5 py-4 text-[18px] italic leading-snug text-ks-ink"
        >
          "প্রথমত আমি তোমাকে চাই" — the opening line of Tomake Chai, 1992.
        </motion.blockquote>
      )}

      <KsSection id="voice" heading="In His Own Words">
        <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0">
          {QUOTES.map((q, i) => (
            <QuoteClipping key={q.en.slice(0, 24)} quote={q} index={i} />
          ))}
        </div>
      </KsSection>

      <KsSection id="life" heading="A Life, in Brief">
        <ReelTimeline events={spine} />
        <Link to={PAGE_PATH.kabirsumanLife} className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ks-red hover:underline">
          The full life, chronologically <ArrowRightIcon size={12} />
        </Link>
      </KsSection>

      <KsSection id="landmarks" heading="Where to Start — 25 Songs">
        <div className="grid gap-2.5 sm:grid-cols-2">
          {LANDMARKS.slice(0, 8).map((l, i) => (
            <LandmarkTile key={l.bn} landmark={l} index={i} />
          ))}
        </div>
      </KsSection>

      <KsSection id="works" heading={`The Discography (${ALBUMS.length})`}>
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
          {ALBUMS.slice(0, 8).map((a) => (
            <AlbumCard key={a.slug} album={a} />
          ))}
        </div>
        <Link to={PAGE_PATH.kabirsumanWorks} className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ks-red hover:underline">
          All {ALBUMS.length} albums <ArrowRightIcon size={12} />
        </Link>
      </KsSection>

      <KsSection heading="শব্দকোষ · His Vocabulary, Counted">
        <p className="max-w-[55ch] text-[14px] leading-relaxed text-ks-ink-muted">
          Every recurring word across all 317 songs, indexed — the first searchable map of a
          lyricist's own vocabulary, not a summary of it. Search গান and watch it turn up in 115
          different songs, from a man whose most common noun is "song" itself.
        </p>
        <Link to={PAGE_PATH.kabirsumanWords} className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ks-red hover:underline">
          Search the lexicon <ArrowRightIcon size={12} />
        </Link>
      </KsSection>
    </KabirSumanLayout>
  );
}
