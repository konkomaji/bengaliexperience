import { DispatchHero } from "../../components/kabirsuman/DispatchHero";
import { KabirSumanLayout } from "../../components/kabirsuman/KabirSumanLayout";
import { ReelTimeline } from "../../components/kabirsuman/ReelTimeline";
import { KsFaq, KsFacts } from "../../components/kabirsuman/shared";
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

  return (
    <KabirSumanLayout active="life">
      <JsonLd data={buildJsonLd("kabirsumanLife")} />
      <DispatchHero eyebrow="সংক্ষেপে সুমন · A Life" h1={seo.h1} intro={seo.intro} />
      <KsFacts facts={seo.facts} />

      <div className="mt-10">
        <ReelTimeline events={LIFE_EVENTS} full groupLabel={(e) => ERA_LABEL[e.era]} />
      </div>

      <div className="mt-14">
        <KsFaq items={PAGE_FAQ.kabirsumanLife} />
      </div>
    </KabirSumanLayout>
  );
}
