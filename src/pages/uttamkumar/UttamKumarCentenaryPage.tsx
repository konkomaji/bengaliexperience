import { UttamKumarLayout } from "../../components/uttamkumar/UttamKumarLayout";
import { UkFaq, UkFacts, UkHero, UkProse, UkSection } from "../../components/uttamkumar/shared";
import { CENTENARY_EVENTS, CENTENARY_INTRO } from "../../data/uttamkumar/centenary";
import { PAGE_FAQ, PAGE_PATH, PAGE_SEO } from "../../data/seo";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import { buildJsonLd } from "../../lib/jsonld";
import { JsonLd } from "../../components/JsonLd";

export function UttamKumarCentenaryPage() {
  const seo = PAGE_SEO.uttamkumarCentenary;
  useDocumentHead(seo, PAGE_PATH.uttamkumarCentenary);

  return (
    <UttamKumarLayout active="centenary">
      <JsonLd data={buildJsonLd("uttamkumarCentenary")} />
      <UkHero eyebrow="2026 · The Centenary Year" h1={seo.h1} intro={seo.intro} />
      <UkFacts facts={seo.facts} />

      <UkSection id="intro" heading="A Living Record">
        <UkProse paragraphs={[CENTENARY_INTRO]} />
      </UkSection>

      <UkSection id="events" heading="The Programme">
        <ol className="flex flex-col gap-5">
          {CENTENARY_EVENTS.map((e) => (
            <li key={e.headline} className="border-l-2 border-uk-gold/70 pl-4">
              <p className="uk-mono text-[11px] uppercase tracking-wide text-uk-gold">{e.date}</p>
              <p className="mt-1 text-[14.5px] font-semibold leading-snug text-uk-on-void">{e.headline}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-uk-on-void-muted">{e.detail}</p>
              <p className="uk-mono mt-1.5 text-[10.5px] text-uk-on-void-muted">Source: {e.source}</p>
            </li>
          ))}
        </ol>
      </UkSection>

      <div className="mt-14">
        <UkFaq items={PAGE_FAQ.uttamkumarCentenary} />
      </div>
    </UttamKumarLayout>
  );
}
