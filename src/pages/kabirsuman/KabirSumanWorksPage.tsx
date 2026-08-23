import { motion } from "framer-motion";
import { AlbumCard } from "../../components/kabirsuman/AlbumCard";
import { DispatchHero } from "../../components/kabirsuman/DispatchHero";
import { KabirSumanLayout } from "../../components/kabirsuman/KabirSumanLayout";
import { KsFaq, KsFacts, KsSection } from "../../components/kabirsuman/shared";
import { ALBUMS } from "../../data/kabirsuman/catalogue";
import { LATER_CREDITS } from "../../data/kabirsuman/laterCredits";
import { PAGE_FAQ, PAGE_PATH, PAGE_SEO } from "../../data/seo";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import { buildJsonLd } from "../../lib/jsonld";
import { JsonLd } from "../../components/JsonLd";

const CREDIT_TYPE_LABEL: Record<(typeof LATER_CREDITS)[number]["type"], string> = {
  film: "Film",
  live: "Live",
  compilation: "Compilation",
};

export function KabirSumanWorksPage() {
  const seo = PAGE_SEO.kabirsumanWorks;
  useDocumentHead(seo, PAGE_PATH.kabirsumanWorks);

  return (
    <KabirSumanLayout active="works">
      <JsonLd data={buildJsonLd("kabirsumanWorks")} />
      <DispatchHero eyebrow="সংগ্রহশালা · The Discography" h1={seo.h1} intro={seo.intro} />
      <KsFacts facts={seo.facts} />

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ALBUMS.map((a, i) => (
          <AlbumCard key={a.slug} album={a} index={i} />
        ))}
      </div>

      <KsSection
        id="later-credits"
        heading="Later & uncatalogued work"
      >
        <p className="mb-4 max-w-[60ch] text-[13px] leading-relaxed text-ks-ink-muted">
          The archive above stops updating in the mid-2010s. These are real credits from after that —
          or one compilation it never carried at all — sourced to their own labels rather than to
          sumanami.co.uk, with no lyric page because no lyric text is available to source one from.
        </p>
        <ul className="flex flex-col gap-3">
          {LATER_CREDITS.map((c, i) => (
            <motion.li
              key={c.roman}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ type: "spring", stiffness: 260, damping: 24, delay: i * 0.05 }}
              whileHover={{ y: -2 }}
              className="rounded-[var(--radius-md)] border-2 border-ks-ink bg-ks-paper-bright p-4 shadow-[0_2px_0_var(--color-ks-ink)]"
            >
              <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <span className="ks-bengali text-[15px] font-semibold text-ks-ink">{c.bn}</span>
                <span className="ks-mono text-[11px] text-ks-ink-muted">{c.roman}</span>
                <span className="ks-mono ml-auto rounded-full bg-ks-brass-container px-2 py-0.5 text-[11px] font-semibold text-ks-on-brass-container">
                  {c.year}
                  {c.yearUncertain ? "?" : ""}
                </span>
              </div>
              <p className="ks-mono mt-1 text-[10.5px] uppercase tracking-[0.16em] text-ks-brass-dim">
                {CREDIT_TYPE_LABEL[c.type]} · {c.label} · {c.role}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-ks-ink-muted">{c.note}</p>
            </motion.li>
          ))}
        </ul>
      </KsSection>

      <div className="mt-14">
        <KsFaq items={PAGE_FAQ.kabirsumanWorks} />
      </div>
    </KabirSumanLayout>
  );
}
