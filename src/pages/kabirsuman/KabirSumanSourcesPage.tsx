import { motion } from "framer-motion";
import { DispatchHero } from "../../components/kabirsuman/DispatchHero";
import { KabirSumanLayout } from "../../components/kabirsuman/KabirSumanLayout";
import { KsSection } from "../../components/kabirsuman/shared";
import { CROSS_CHECKED, OPEN_QUESTIONS, PRIMARY_SOURCES } from "../../data/kabirsuman/sources";
import { PAGE_PATH, PAGE_SEO } from "../../data/seo";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import { ExternalIcon, StampIcon } from "../../components/icons";
import { buildJsonLd } from "../../lib/jsonld";
import { JsonLd } from "../../components/JsonLd";

export function KabirSumanSourcesPage() {
  const seo = PAGE_SEO.kabirsumanSources;
  useDocumentHead(seo, PAGE_PATH.kabirsumanSources);

  return (
    <KabirSumanLayout active="sources">
      <JsonLd data={buildJsonLd("kabirsumanSources")} />
      <DispatchHero eyebrow="স্বীকৃতি · Credits" h1={seo.h1} intro={seo.intro} />

      <KsSection heading="The archive this is built from">
        <div className="flex flex-col gap-3">
          {PRIMARY_SOURCES.map((s, i) => (
            <motion.a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ type: "spring", stiffness: 260, damping: 24, delay: i * 0.05 }}
              whileHover={{ y: -2, rotate: -0.4 }}
              className="flex items-start gap-3 rounded-[var(--radius-md)] border-2 border-ks-ink bg-ks-paper-bright p-4 shadow-[0_2px_0_var(--color-ks-ink)]"
            >
              <span aria-hidden className="mt-0.5 shrink-0 text-ks-red/70">
                <StampIcon size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-ks-ink">{s.name}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-ks-ink-muted">{s.usedFor}</p>
              </div>
              <ExternalIcon size={14} />
            </motion.a>
          ))}
        </div>
      </KsSection>

      <KsSection heading="Cross-checked against">
        <ul className="flex flex-col gap-2.5">
          {CROSS_CHECKED.map((s, i) => (
            <motion.li
              key={s.url}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ type: "spring", stiffness: 260, damping: 24, delay: i * 0.04 }}
              className="border-b border-ks-outline-variant pb-2.5"
            >
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[13.5px] font-semibold text-ks-red hover:underline">
                {s.name}
              </a>
              <p className="mt-0.5 text-[12.5px] text-ks-ink-muted">{s.usedFor}</p>
            </motion.li>
          ))}
        </ul>
      </KsSection>

      <KsSection heading="Open questions">
        <p className="mb-3 text-[13px] leading-relaxed text-ks-ink-muted">
          Stated plainly rather than silently resolved. Each is also flagged in place, on the page it affects.
        </p>
        <ul className="flex flex-col gap-2">
          {OPEN_QUESTIONS.map((q) => (
            <li key={q.slice(0, 30)} className="ks-mono border-l-2 border-ks-brass/70 pl-3 text-[12.5px] leading-relaxed text-ks-ink-muted">
              {q}
            </li>
          ))}
        </ul>
      </KsSection>
    </KabirSumanLayout>
  );
}
