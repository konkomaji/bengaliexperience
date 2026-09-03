import { UttamKumarLayout } from "../../components/uttamkumar/UttamKumarLayout";
import { UkHero, UkSection } from "../../components/uttamkumar/shared";
import { BOOK_SOURCES, CENTENARY_SOURCES, OPEN_QUESTIONS, PRIMARY_SOURCES, type Source } from "../../data/uttamkumar/sources";
import { PAGE_PATH, PAGE_SEO } from "../../data/seo";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import { buildJsonLd } from "../../lib/jsonld";
import { JsonLd } from "../../components/JsonLd";

function SourceRow({ s }: { s: Source }) {
  return (
    <li className="border-b border-uk-outline-variant/60 py-2.5 text-[13px]">
      <a href={s.url} target="_blank" rel="noreferrer" className="font-semibold text-uk-gold hover:underline">
        {s.name}
      </a>
      <p className="mt-0.5 text-uk-on-void-muted">{s.usedFor}</p>
    </li>
  );
}

export function UttamKumarSourcesPage() {
  const seo = PAGE_SEO.uttamkumarSources;
  useDocumentHead(seo, PAGE_PATH.uttamkumarSources);

  return (
    <UttamKumarLayout active="sources">
      <JsonLd data={buildJsonLd("uttamkumarSources")} />
      <UkHero eyebrow="Sources and Credits" h1={seo.h1} intro={seo.intro} />

      <UkSection id="primary" heading="Biography &amp; Filmography">
        <ul>{PRIMARY_SOURCES.map((s) => <SourceRow key={s.url} s={s} />)}</ul>
      </UkSection>
      <UkSection id="centenary" heading="2026 Centenary Coverage">
        <ul>{CENTENARY_SOURCES.map((s) => <SourceRow key={s.url} s={s} />)}</ul>
      </UkSection>
      <UkSection id="books" heading="Books">
        <ul>{BOOK_SOURCES.map((s) => <SourceRow key={s.url} s={s} />)}</ul>
      </UkSection>
      <UkSection id="open" heading="Open Questions">
        <ul className="flex flex-col gap-2 text-[13px] leading-relaxed text-uk-on-void-muted">
          {OPEN_QUESTIONS.map((q) => (
            <li key={q.slice(0, 30)}>{q}</li>
          ))}
        </ul>
      </UkSection>
    </UttamKumarLayout>
  );
}
