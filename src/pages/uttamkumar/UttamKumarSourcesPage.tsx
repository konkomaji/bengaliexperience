import { UttamKumarLayout } from "../../components/uttamkumar/UttamKumarLayout";
import { UkHero, UkSection } from "../../components/uttamkumar/shared";
import { IMAGE_CREDITS, REJECTED_IMAGES } from "../../data/uttamkumar/credits";
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
      <UkSection id="images" heading={`Images (${IMAGE_CREDITS.length})`}>
        <p className="mb-4 max-w-[62ch] text-[13px] leading-relaxed text-uk-on-void-muted">
          Four images are self-hosted here, each verified individually rather than pulled wholesale
          from a category listing. Six other files in Wikimedia Commons' own Uttam Kumar category
          were reviewed and left out; the reason for each is below.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {IMAGE_CREDITS.map((c) => (
            <figure key={c.slug} className="border border-uk-outline-variant bg-uk-void-dim p-3">
              <img
                src={`/uttamkumar/photos/${c.slug}.webp`}
                alt={c.caption}
                loading="lazy"
                className="w-full rounded-sm object-cover"
              />
              <figcaption className="mt-2 text-[12.5px] leading-relaxed text-uk-on-void-muted">
                <p className="text-uk-on-void">{c.caption}</p>
                <p className="uk-mono mt-1 text-[10.5px]">
                  {c.author} ·{" "}
                  <a href={c.licenseUrl} target="_blank" rel="noreferrer" className="text-uk-gold hover:underline">
                    {c.license}
                  </a>{" "}
                  ·{" "}
                  <a href={c.sourceUrl} target="_blank" rel="noreferrer" className="text-uk-gold hover:underline">
                    source
                  </a>
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
        <ul className="mt-5 flex flex-col gap-2 text-[12.5px] leading-relaxed">
          {REJECTED_IMAGES.map((r) => (
            <li key={r.title} className="border-l-2 border-uk-outline-variant pl-3">
              <span className="font-semibold text-uk-on-void">{r.title}</span>
              <span className="text-uk-on-void-muted"> — {r.reason}</span>
            </li>
          ))}
        </ul>
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
