import { Link } from "react-router-dom";
import { PAGE_FAQ, PAGE_PATH, PAGE_SEO } from "../../data/seo";
import { TARAKESWAR } from "../../data/tarakeswar/core";
import { buildJsonLd } from "../../lib/jsonld";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import { JsonLd } from "../../components/JsonLd";
import { TarakeswarLayout } from "../../components/tarakeswar/TarakeswarLayout";
import { MapEmbed } from "../../components/tarakeswar/MapEmbed";
import { ParallaxFigure } from "../../components/tarakeswar/ParallaxFigure";
import { TaraFacts, TaraFaq, TaraGradientBand, TaraHero, TaraProse, TaraSection } from "../../components/tarakeswar/shared";
import { CalendarIcon, ClockIcon } from "../../components/icons";

const MELA_CALENDAR = [
  {
    name: "Maha Shivratri",
    when: "One night, in the Bengali month of Phalgun (February or March, lunar calendar, date shifts every year)",
    what: "The temple is reported to stay open through the night for prahar puja, the traditional four-watch Shivratri worship. The single busiest night of the year, concentrated rather than spread out.",
    post: "tarakeswar-shivratri-mela-guide",
  },
  {
    name: "Gajan",
    when: "Up to five days, ending on Chaitra Sankranti in mid April",
    what: "A Shaiva folk festival where devotees take temporary ascetic vows, known as Gajan Sannyasis, ending in Charak Puja.",
    post: null,
  },
  {
    name: "Shravani Mela (Bol Bom)",
    when: "The whole Bengali month of Shravan, roughly mid July to mid August",
    what: "By far the largest event of the year. Bol Bom pilgrims walk in on foot, commonly from Baidyabati, carrying Ganga water for the shivalinga. District figures put attendance at roughly 24 to 30 lakh across the month.",
    post: "shravani-mela-bol-bom-tarakeswar-complete-guide",
  },
];

/**
 * The temple page: the "landmarks and things to do" layer, and the section's
 * differentiator. Its job is to say what most pages about Tarakeswar do not:
 * that the founding story has two versions, that the timings are reported
 * rather than official, and that Shivratri and the Shravani Mela are two
 * different events people keep mixing up.
 */
export function TarakeswarTemplePage() {
  const seo = PAGE_SEO.tarakeswarTemple;
  useDocumentHead(seo, PAGE_PATH.tarakeswarTemple);

  return (
    <TarakeswarLayout active="temple">
      <JsonLd data={buildJsonLd("tarakeswarTemple")} />
      <div className="relative">
        <TaraGradientBand variant="secondary" />
        <TaraHero eyebrow="Temple & mela" h1={seo.h1} intro={seo.intro} />
        <TaraFacts facts={seo.facts} />

        <ParallaxFigure
          src="/tarakeswar/gov/temple.jpg"
          alt="The ornately painted entrance canopy of Taraknath Mandir, packed with devotees during darshan"
        >
          <figcaption className="bg-tara-surface-container px-4 py-2 text-[11px] text-tara-on-surface-muted">
            The temple entrance during darshan. Photo: Tarakeswar Shrabani Mela, Government of West Bengal.
          </figcaption>
        </ParallaxFigure>
      </div>

      <TaraSection heading="History: two stories, not one">
        <TaraProse
          paragraphs={[
            `Old accounts of who built the temple, and when, do not agree. One names Raja Bharamalla Rao as the builder in around 1729. Another describes a devotee, Vishnu Das, who is said to have found the shivalinga after a cow was seen pouring milk over a buried stone, followed by a dream telling him to build a temple over it. Both are told locally today, and neither is confirmed by a primary source found in research for this guide.`,
          ]}
        />
        <Link
          to={`${PAGE_PATH.tarakeswarBlog}/tarakeswar-temple-history-two-legends`}
          className="mt-3 inline-block text-[13px] font-bold text-tara-primary hover:underline"
        >
          Read the full history →
        </Link>
      </TaraSection>

      <TaraSection heading="Architecture and Dudhpukur">
        <TaraProse
          paragraphs={[
            "The temple is built in Bengal's atchala style, a tiered, sloping roof, with a natmandir, a prayer hall, in front of the main shrine. Smaller shrines to Kali and Lakshmi-Narayan sit within the same complex.",
            "Dudhpukur, meaning milk pond, is the pond just north of the temple where pilgrims traditionally bathe or pray before darshan.",
          ]}
        />
      </TaraSection>

      <TaraSection icon={<ClockIcon size={13} />} heading="Darshan timings">
        <div className="rounded-2xl border border-tara-secondary/30 bg-tara-secondary-container/40 p-4">
          <p className="text-[13.5px] leading-relaxed text-tara-on-secondary-container">
            Commonly reported as roughly <strong>5 to 5:30 am until 1 to 1:30 pm</strong>, reopening from about{" "}
            <strong>4 pm until 7 to 8:30 pm</strong>, with longer hours on Shivratri, Gajan and the Mondays of
            Shravan. No official source publishes fixed timings, so this is a guide, not a promise. Morning aarti is
            commonly reported around 10 am, and sandhya aarti with bhog around 6 to 6:30 pm.
          </p>
        </div>
        <Link
          to={`${PAGE_PATH.tarakeswarBlog}/tarakeswar-temple-timings-best-time-for-darshan`}
          className="mt-3 inline-block text-[13px] font-bold text-tara-primary hover:underline"
        >
          When to go for a quiet darshan →
        </Link>
      </TaraSection>

      <TaraSection icon={<CalendarIcon size={13} />} heading="The mela calendar">
        <div className="flex flex-col gap-3">
          {MELA_CALENDAR.map((m) => (
            <div key={m.name} className="rounded-2xl border border-tara-outline-variant bg-tara-surface-container p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h3 className="text-[14.5px] font-extrabold text-tara-on-surface">{m.name}</h3>
                <span className="text-[11px] font-semibold uppercase tracking-wide text-tara-secondary">{m.when}</span>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-tara-on-surface-muted">{m.what}</p>
              {m.post && (
                <Link
                  to={`${PAGE_PATH.tarakeswarBlog}/${m.post}`}
                  className="mt-2 inline-block text-[12.5px] font-bold text-tara-primary hover:underline"
                >
                  Full guide →
                </Link>
              )}
            </div>
          ))}
        </div>
        <p className="mt-3 text-[12.5px] leading-relaxed text-tara-on-surface-muted">
          Shivratri and the Shravani Mela get mixed up online often enough to be worth repeating: Shivratri is one
          night; the Shravani Mela runs the whole month of Shravan and is far larger.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <figure className="overflow-hidden rounded-2xl border border-tara-outline-variant">
            <img
              src="/tarakeswar/gov/mela.jpg"
              alt="Bol Bom pilgrims in red and orange, carrying a decorated kanwar pole with peacock feathers along a road during the Shravani Mela"
              width={1360}
              height={906}
              loading="lazy"
              className="aspect-square w-full object-cover"
            />
          </figure>
          <figure className="overflow-hidden rounded-2xl border border-tara-outline-variant">
            <img
              src="/tarakeswar/gov/bolbom-rain.jpg"
              alt="Bare-chested Bol Bom pilgrims carrying kanwar poles with pots of Ganga water, walking barefoot in monsoon rain"
              width={1360}
              height={906}
              loading="lazy"
              className="aspect-square w-full object-cover"
            />
          </figure>
        </div>
        <p className="mt-2 text-[11px] text-tara-on-surface-muted">
          Bol Bom pilgrims during the Shravani Mela. Photos: Tarakeswar Shrabani Mela, Government of West Bengal.
        </p>
      </TaraSection>

      <TaraSection heading="On the map">
        <MapEmbed query={TARAKESWAR.mapsQuery} label="Taraknath Mandir, Tarakeswar" />
      </TaraSection>

      <TaraSection heading="Questions">
        <TaraFaq items={PAGE_FAQ.tarakeswarTemple} />
      </TaraSection>
    </TarakeswarLayout>
  );
}
