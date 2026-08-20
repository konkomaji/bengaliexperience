import { PAGE_FAQ, PAGE_PATH, PAGE_SEO } from "../../data/seo";
import { TARAKESWAR } from "../../data/tarakeswar/core";
import { DIRECTORY_ENTRIES, DIRECTORY_GAPS, type DirectoryCategory } from "../../data/tarakeswar/directory";
import { buildJsonLd } from "../../lib/jsonld";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import { JsonLd } from "../../components/JsonLd";
import { TarakeswarLayout } from "../../components/tarakeswar/TarakeswarLayout";
import { MapEmbed } from "../../components/tarakeswar/MapEmbed";
import { DirectoryCard } from "../../components/tarakeswar/DirectoryCard";
import { TaraFacts, TaraFaq, TaraGradientBand, TaraHero, TaraSection } from "../../components/tarakeswar/shared";
import { FoodIcon, MapPinIcon, PillIcon, TempleIcon } from "../../components/icons";

const GROUPS: { category: DirectoryCategory; label: string; icon: typeof FoodIcon }[] = [
  { category: "eat", label: "Eat", icon: FoodIcon },
  { category: "sweets", label: "Sweets", icon: FoodIcon },
  { category: "stay", label: "Stay", icon: TempleIcon },
  { category: "pharmacy", label: "Pharmacy", icon: PillIcon },
  { category: "hospital", label: "Hospital & clinic", icon: PillIcon },
  { category: "bank", label: "Bank & ATM", icon: MapPinIcon },
];

/**
 * The "eat and stay" layer: a real, checkable local directory, and an honest
 * note where a category (tea stalls, most sweet shops) has nothing checkable
 * to list. See src/data/tarakeswar/directory.ts for the sourcing rule.
 */
export function TarakeswarFoodPage() {
  const seo = PAGE_SEO.tarakeswarFood;
  useDocumentHead(seo, PAGE_PATH.tarakeswarFood);

  return (
    <TarakeswarLayout active="food">
      <JsonLd data={buildJsonLd("tarakeswarFood")} />
      <div className="relative">
        <TaraGradientBand />
        <TaraHero eyebrow="Eat & stay" h1={seo.h1} intro={seo.intro} />
        <TaraFacts facts={seo.facts} />
      </div>

      <p className="mt-6 text-[12px] leading-relaxed text-tara-on-surface-muted">
        Tap any place to open it on Google Maps directly, ratings, reviews, hours and all. The note under each one is
        this guide's own, not Google's.
      </p>

      {GROUPS.map((g) => {
        const rows = DIRECTORY_ENTRIES.filter((e) => e.category === g.category);
        if (!rows.length) return null;
        return (
          <TaraSection key={g.category} icon={<g.icon size={13} />} heading={g.label}>
            <div className="flex flex-col gap-2.5">
              {rows.map((e, i) => (
                <DirectoryCard key={e.name} entry={e} index={i} />
              ))}
            </div>
          </TaraSection>
        );
      })}

      <TaraSection heading="Where this list is honestly thin">
        <div className="flex flex-col gap-2.5">
          {DIRECTORY_GAPS.map((g) => (
            <div key={g.category} className="rounded-2xl border border-tara-outline-variant bg-tara-surface px-4 py-3">
              <p className="text-[13px] font-extrabold text-tara-on-surface">{g.category}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-tara-on-surface-muted">{g.note}</p>
            </div>
          ))}
        </div>
      </TaraSection>

      <TaraSection heading="On the map">
        <MapEmbed query={TARAKESWAR.mapsQuery} label="Taraknath Mandir, Tarakeswar" />
      </TaraSection>

      <TaraSection heading="Questions">
        <TaraFaq items={PAGE_FAQ.tarakeswarFood} />
      </TaraSection>
    </TarakeswarLayout>
  );
}
