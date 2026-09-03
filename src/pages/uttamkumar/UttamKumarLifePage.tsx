import { CreditedImage } from "../../components/uttamkumar/CreditedImage";
import { LifeReel } from "../../components/uttamkumar/LifeReel";
import { UttamKumarLayout } from "../../components/uttamkumar/UttamKumarLayout";
import { UkFaq, UkFacts, UkHero, UkSection } from "../../components/uttamkumar/shared";
import { LIFE_EVENTS } from "../../data/uttamkumar/life";
import { PAGE_FAQ, PAGE_PATH, PAGE_SEO } from "../../data/seo";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import { buildJsonLd } from "../../lib/jsonld";
import { JsonLd } from "../../components/JsonLd";

export function UttamKumarLifePage() {
  const seo = PAGE_SEO.uttamkumarLife;
  useDocumentHead(seo, PAGE_PATH.uttamkumarLife);

  return (
    <UttamKumarLayout active="life">
      <JsonLd data={buildJsonLd("uttamkumarLife")} />
      <UkHero eyebrow="A Life" h1={seo.h1} intro={seo.intro} />
      <UkFacts facts={seo.facts} />

      <UkSection id="timeline" heading="The Full Timeline, 1926–2026">
        <LifeReel events={LIFE_EVENTS} full />
      </UkSection>

      <UkSection id="beyond" heading="Beyond the Screen">
        <p className="max-w-[62ch] text-[14px] leading-relaxed text-uk-on-void-muted">
          A tribute that only lists the awards isn't a complete life. Marked in the timeline above:
          his marriage to Gauri Chatterjee in 1948, and his 1963 marriage to Supriya Devi without
          ever formalising a divorce from the first; the philanthropy of Shilpi Sangshad, run without
          salary; and the one real public controversy of his career — the 1976 Mahalaya broadcast
          that turned opinion against him for a season, and the apology that followed. None of it is
          hidden here, and none of it is dwelt on beyond what's actually documented.
        </p>
        <CreditedImage slug="morgan-house-testimonial" className="mt-5 max-w-md" />
      </UkSection>

      <div className="mt-14">
        <UkFaq items={PAGE_FAQ.uttamkumarLife} />
      </div>
    </UttamKumarLayout>
  );
}
