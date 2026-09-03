import { UttamKumarLayout } from "../../components/uttamkumar/UttamKumarLayout";
import { UkFacts, UkHero, UkSection, UkStub } from "../../components/uttamkumar/shared";
import { BFJA_AWARDS, FILMFARE_AWARDS, NATIONAL_AWARDS, POSTHUMOUS_HONORS, type Award } from "../../data/uttamkumar/awards";
import { PAGE_PATH, PAGE_SEO } from "../../data/seo";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import { buildJsonLd } from "../../lib/jsonld";
import { JsonLd } from "../../components/JsonLd";

function AwardRow({ a }: { a: Award }) {
  return (
    <li className="flex flex-wrap items-baseline gap-2 border-b border-uk-outline-variant/60 py-2 text-[13.5px]">
      <UkStub>{a.year}</UkStub>
      <span className="text-uk-on-void">{a.award}</span>
      {a.film && <span className="text-uk-on-void-muted">— {a.film}</span>}
      {a.note && <span className="text-[12px] text-uk-on-void-muted">({a.note})</span>}
    </li>
  );
}

export function UttamKumarAwardsPage() {
  const seo = PAGE_SEO.uttamkumarAwards;
  useDocumentHead(seo, PAGE_PATH.uttamkumarAwards);

  return (
    <UttamKumarLayout active="awards">
      <JsonLd data={buildJsonLd("uttamkumarAwards")} />
      <UkHero eyebrow="সম্মাননা · Awards & Honours" h1={seo.h1} intro={seo.intro} />
      <UkFacts facts={seo.facts} />

      <UkSection id="national" heading="National Film Awards">
        <ul>{NATIONAL_AWARDS.map((a, i) => <AwardRow key={i} a={a} />)}</ul>
      </UkSection>
      <UkSection id="bfja" heading="BFJA Awards">
        <ul>{BFJA_AWARDS.map((a, i) => <AwardRow key={i} a={a} />)}</ul>
      </UkSection>
      <UkSection id="filmfare" heading="Filmfare Awards">
        <ul>{FILMFARE_AWARDS.map((a, i) => <AwardRow key={i} a={a} />)}</ul>
      </UkSection>
      <UkSection id="posthumous" heading="Posthumous Honours">
        <ul className="flex flex-col gap-2.5">
          {POSTHUMOUS_HONORS.map((h) => (
            <li key={h.honor} className="border-b border-uk-outline-variant/60 pb-2.5 text-[13.5px]">
              <p><UkStub>{h.year}</UkStub> <span className="ml-1.5 font-semibold text-uk-on-void">{h.honor}</span></p>
              <p className="mt-1 text-uk-on-void-muted">{h.detail}</p>
            </li>
          ))}
        </ul>
      </UkSection>
    </UttamKumarLayout>
  );
}
