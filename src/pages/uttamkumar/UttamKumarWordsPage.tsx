import { CreditedImage } from "../../components/uttamkumar/CreditedImage";
import { UttamKumarLayout } from "../../components/uttamkumar/UttamKumarLayout";
import { UkHero, UkSection } from "../../components/uttamkumar/shared";
import { QUOTES } from "../../data/uttamkumar/quotes";
import { COLLABORATORS } from "../../data/uttamkumar/people";
import { PAGE_PATH, PAGE_SEO } from "../../data/seo";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import { buildJsonLd } from "../../lib/jsonld";
import { JsonLd } from "../../components/JsonLd";

export function UttamKumarWordsPage() {
  const seo = PAGE_SEO.uttamkumarWords;
  useDocumentHead(seo, PAGE_PATH.uttamkumarWords);

  return (
    <UttamKumarLayout active="words">
      <JsonLd data={buildJsonLd("uttamkumarWords")} />
      <div className="flex flex-col-reverse items-start gap-6 sm:flex-row sm:gap-8">
        <UkHero eyebrow="Voices" h1={seo.h1} intro={seo.intro} />
        <CreditedImage slug="portrait-sketch-ghosh" className="w-32 shrink-0 sm:w-40" />
      </div>

      <UkSection id="quotes" heading="In Their Words">
        <div className="grid gap-4 sm:grid-cols-2">
          {QUOTES.map((q) => (
            <blockquote key={q.en.slice(0, 24)} className="border border-uk-outline-variant bg-uk-void-dim p-4 text-[14px] italic leading-snug text-uk-on-void">
              "{q.en}"
              <footer className="uk-mono mt-2 text-[10.5px] not-italic uppercase tracking-wide text-uk-gold">
                — {q.speaker}
                <span className="ml-1.5 block text-uk-on-void-muted normal-case tracking-normal">{q.source}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </UkSection>

      <UkSection id="collaborators" heading="Collaborators">
        <div className="flex flex-col gap-5">
          {COLLABORATORS.map((c) => (
            <div key={c.name} className="border-l-2 border-uk-gold/70 pl-4">
              <p className="text-[14.5px] font-semibold text-uk-on-void">
                {c.name} <span className="uk-mono ml-1.5 text-[10px] font-normal uppercase tracking-wide text-uk-on-void-muted">{c.role}</span>
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-uk-on-void-muted">{c.blurb}</p>
            </div>
          ))}
        </div>
      </UkSection>
    </UttamKumarLayout>
  );
}
