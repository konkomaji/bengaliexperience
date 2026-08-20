import { Link } from "react-router-dom";
import { PAGE_FAQ, PAGE_PATH, PAGE_SEO } from "../../data/seo";
import { TARAKESWAR } from "../../data/tarakeswar/core";
import { buildJsonLd } from "../../lib/jsonld";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import { JsonLd } from "../../components/JsonLd";
import { TarakeswarLayout } from "../../components/tarakeswar/TarakeswarLayout";
import { MapEmbed } from "../../components/tarakeswar/MapEmbed";
import { TaraFacts, TaraFaq, TaraGradientBand, TaraHero, TaraProse, TaraSection } from "../../components/tarakeswar/shared";
import { RoadIcon, TrainIcon } from "../../components/icons";

/**
 * The how to reach page: the one place on the site that explicitly says
 * distance figures for Tarakeswar disagree between sources, rather than
 * picking a single number and asserting it, which is what every competing
 * page in this space does.
 */
export function TarakeswarReachPage() {
  const seo = PAGE_SEO.tarakeswarReach;
  useDocumentHead(seo, PAGE_PATH.tarakeswarReach);

  return (
    <TarakeswarLayout active="reach">
      <JsonLd data={buildJsonLd("tarakeswarReach")} />
      <div className="relative">
        <TaraGradientBand variant="secondary" />
        <TaraHero eyebrow="How to reach" h1={seo.h1} intro={seo.intro} />
        <TaraFacts facts={seo.facts} />
      </div>

      <TaraSection icon={<TrainIcon size={13} />} heading="By train">
        <TaraProse
          paragraphs={[
            "Tarakeswar Railway Station is the terminus of the Howrah-Tarakeswar branch line, opened in 1885, roughly 58 km from Howrah. Direct EMU locals run through the day, with somewhere around 35 to 38 trains daily, so there is rarely a long wait. The ride takes about 1.5 hours, no change needed.",
          ]}
        />
        <Link
          to={`${PAGE_PATH.tarakeswarBlog}/howrah-to-tarakeswar-train-vs-car-vs-bus`}
          className="mt-3 inline-block text-[13px] font-bold text-tara-primary hover:underline"
        >
          Train vs car vs bus, compared →
        </Link>
      </TaraSection>

      <TaraSection icon={<RoadIcon size={13} />} heading="By road">
        <div className="rounded-2xl border border-tara-secondary/30 bg-tara-secondary-container/40 p-4">
          <p className="text-[13.5px] leading-relaxed text-tara-on-secondary-container">
            Most map tools show somewhere between <strong>55 and 65 km</strong> from central Kolkata, mainly along
            State Highway 2 or State Highway 15, a drive of roughly <strong>1 to 2 hours</strong> depending on
            traffic. Different route calculators genuinely disagree here (figures anywhere from about 44 to 85 km
            have been reported), so this is given as a range rather than a single number to trust blindly. Check
            your own maps app on the day.
          </p>
        </div>
      </TaraSection>

      <TaraSection heading="By bus">
        <TaraProse
          paragraphs={[
            "State-run SBSTC buses and private buses run from Esplanade and Babughat in Kolkata, as well as from Arambagh and Serampore, taking roughly 2.5 to 3.5 hours, longer than the train but a reasonable option if train timings do not line up.",
          ]}
        />
      </TaraSection>

      <TaraSection heading="Flying in">
        <TaraProse
          paragraphs={[
            "Netaji Subhas Chandra Bose International Airport in Kolkata is the nearest airport. The official Tarakeswar Shrabani Mela government site gives the distance as about 70 km, roughly 2 hours by prepaid taxi, though the same site separately gives 65 km by road, so treat this as an approximate range.",
          ]}
        />
      </TaraSection>

      <TaraSection heading="Getting around once you're there">
        <TaraProse
          paragraphs={[
            "Toto (e-rickshaw) is the usual way to cover the roughly 1 km from the railway station to the temple, about a 10-minute ride for a small fare. Auto-rickshaws and cycle-rickshaws also run to nearby villages and towns.",
          ]}
        />
      </TaraSection>

      <TaraSection heading="On the map">
        <MapEmbed query={TARAKESWAR.mapsQuery} label="Taraknath Mandir, Tarakeswar" />
      </TaraSection>

      <TaraSection heading="Questions">
        <TaraFaq items={PAGE_FAQ.tarakeswarReach} />
      </TaraSection>
    </TarakeswarLayout>
  );
}
