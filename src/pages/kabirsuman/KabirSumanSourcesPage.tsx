import { KabirSumanLayout } from "../../components/kabirsuman/KabirSumanLayout";
import { KsHero, KsSection } from "../../components/kabirsuman/shared";
import { CROSS_CHECKED, OPEN_QUESTIONS, PRIMARY_SOURCES } from "../../data/kabirsuman/sources";
import { PAGE_PATH, PAGE_SEO } from "../../data/seo";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import { ExternalIcon } from "../../components/icons";
import { buildJsonLd } from "../../lib/jsonld";
import { JsonLd } from "../../components/JsonLd";

export function KabirSumanSourcesPage() {
  const seo = PAGE_SEO.kabirsumanSources;
  useDocumentHead(seo, PAGE_PATH.kabirsumanSources);

  return (
    <KabirSumanLayout active="sources">
      <JsonLd data={buildJsonLd("kabirsumanSources")} />
      <KsHero eyebrow="স্বীকৃতি · Credits" h1={seo.h1} intro={seo.intro} />

      <KsSection heading="The archive this is built from">
        {PRIMARY_SOURCES.map((s) => (
          <a
            key={s.url}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-3 flex items-start justify-between gap-3 border border-ks-outline bg-ks-paper-bright p-4 transition-colors hover:border-ks-red"
          >
            <div>
              <p className="text-[14px] font-semibold text-ks-ink">{s.name}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-ks-ink-muted">{s.usedFor}</p>
            </div>
            <ExternalIcon size={14} />
          </a>
        ))}
      </KsSection>

      <KsSection heading="Cross-checked against">
        <ul className="flex flex-col gap-2.5">
          {CROSS_CHECKED.map((s) => (
            <li key={s.url} className="border-b border-ks-outline-variant pb-2.5">
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[13.5px] font-semibold text-ks-red hover:underline">
                {s.name}
              </a>
              <p className="mt-0.5 text-[12.5px] text-ks-ink-muted">{s.usedFor}</p>
            </li>
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
