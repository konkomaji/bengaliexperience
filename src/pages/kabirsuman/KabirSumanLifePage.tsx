import { motion } from "framer-motion";
import { KabirSumanLayout } from "../../components/kabirsuman/KabirSumanLayout";
import { KsDispute, KsFaq, KsFacts, KsHero } from "../../components/kabirsuman/shared";
import { LIFE_EVENTS } from "../../data/kabirsuman/life";
import { PAGE_FAQ, PAGE_PATH, PAGE_SEO } from "../../data/seo";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import { buildJsonLd } from "../../lib/jsonld";
import { JsonLd } from "../../components/JsonLd";

const ERA_LABEL: Record<(typeof LIFE_EVENTS)[number]["era"], string> = {
  "before-music": "Before the records — radio, print, the years abroad",
  "the-albums": "The albums begin",
  politics: "Nandigram, and the Lok Sabha",
  "later-work": "Since 2014",
};

export function KabirSumanLifePage() {
  const seo = PAGE_SEO.kabirsumanLife;
  useDocumentHead(seo, PAGE_PATH.kabirsumanLife);

  let lastEra: string | null = null;

  return (
    <KabirSumanLayout active="life">
      <JsonLd data={buildJsonLd("kabirsumanLife")} />
      <KsHero eyebrow="সংক্ষেপে সুমন · A Life" h1={seo.h1} intro={seo.intro} />
      <KsFacts facts={seo.facts} />

      <ol className="mt-10 flex flex-col">
        {LIFE_EVENTS.map((e, i) => {
          const newEra = e.era !== lastEra;
          lastEra = e.era;
          return (
            <li key={`${e.year}-${e.headline.slice(0, 20)}`}>
              {newEra && (
                <p className="ks-mono mt-8 mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-ks-brass first:mt-0">
                  {ERA_LABEL[e.era]}
                </p>
              )}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 6) * 0.03 }}
                className="grid grid-cols-[64px_1fr] gap-3 border-t border-ks-outline-variant py-3.5 first:border-t-0 sm:grid-cols-[84px_1fr]"
              >
                <p className="ks-mono pt-0.5 text-[13px] font-semibold text-ks-red">
                  {e.year}
                  {e.date && <span className="mt-0.5 block text-[10px] font-normal text-ks-ink-muted">{e.date}</span>}
                </p>
                <div>
                  <p className="text-[14px] font-semibold leading-snug text-ks-ink">{e.headline}</p>
                  {e.detail && <p className="mt-1 text-[13px] leading-relaxed text-ks-ink-muted">{e.detail}</p>}
                  {e.dispute && <KsDispute>{e.dispute}</KsDispute>}
                </div>
              </motion.div>
            </li>
          );
        })}
      </ol>

      <div className="mt-14">
        <KsFaq items={PAGE_FAQ.kabirsumanLife} />
      </div>
    </KabirSumanLayout>
  );
}
