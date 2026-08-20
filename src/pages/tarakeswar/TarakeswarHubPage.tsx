import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PAGE_FAQ, PAGE_PATH, PAGE_SEO } from "../../data/seo";
import { TARAKESWAR } from "../../data/tarakeswar/core";
import { TARAKESWAR_NAV } from "../../data/tarakeswar/nav";
import { BLOG_POSTS } from "../../data/tarakeswar/blog";
import { buildJsonLd } from "../../lib/jsonld";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import { JsonLd } from "../../components/JsonLd";
import { TarakeswarLayout } from "../../components/tarakeswar/TarakeswarLayout";
import { MapEmbed } from "../../components/tarakeswar/MapEmbed";
import { ParallaxFigure } from "../../components/tarakeswar/ParallaxFigure";
import { TaraFacts, TaraFaq, TaraGradientBand, TaraHero, TaraSection } from "../../components/tarakeswar/shared";
import { ArrowRightIcon } from "../../components/icons";

/**
 * The Tarakeswar hub: a shelf, the same job src/pages/HomePage.tsx does for
 * the rest of the site, pointed at one place instead of a catalogue. Answer
 * first, then the four ways into the guide, then a map, then questions.
 */
export function TarakeswarHubPage() {
  const seo = PAGE_SEO.tarakeswar;
  useDocumentHead(seo, PAGE_PATH.tarakeswar);

  return (
    <TarakeswarLayout active="hub">
      <JsonLd data={buildJsonLd("tarakeswar")} />
      <div className="relative">
        <TaraGradientBand />
        <TaraHero eyebrow={TARAKESWAR.district} h1={seo.h1} intro={seo.intro} />
        <TaraFacts facts={seo.facts} />

        <ParallaxFigure
          src="/tarakeswar/gov/dudhpukur.jpg"
          alt="Aerial view of Dudhpukur, the sacred pond beside Tarakeswar temple, ringed by the town's rooftops and trees"
        >
          <figcaption className="bg-tara-surface-container px-4 py-2 text-[11px] text-tara-on-surface-muted">
            Dudhpukur, the pond beside the temple. Photo: Tarakeswar Shrabani Mela, Government of West Bengal.
          </figcaption>
        </ParallaxFigure>
      </div>

      <TaraSection heading="Get around this guide">
        <div className="grid grid-cols-2 gap-3">
          {TARAKESWAR_NAV.filter((n) => n.id !== "hub").map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
              whileHover={{ y: -4, scale: 1.02, transition: { type: "spring", stiffness: 380, damping: 20 } }}
              whileTap={{ scale: 0.96, transition: { type: "spring", stiffness: 500, damping: 24 } }}
            >
              <Link
                to={n.path}
                className="flex h-full flex-col justify-between gap-4 rounded-3xl border border-tara-outline-variant bg-tara-surface-container p-4 transition-colors hover:border-tara-primary/50 hover:bg-tara-primary-container/40 sm:p-5"
              >
                <motion.span
                  whileHover={{ rotate: -8, scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 420, damping: 16 }}
                  className="flex size-10 items-center justify-center rounded-2xl bg-tara-primary-container text-tara-on-primary-container"
                >
                  <n.icon size={20} />
                </motion.span>
                <span>
                  <span className="block text-[14.5px] font-extrabold leading-tight text-tara-on-surface sm:text-[15px]">
                    {n.label}
                  </span>
                  <span className="mt-1.5 flex items-center gap-1 text-[12px] font-semibold text-tara-secondary">
                    Open <ArrowRightIcon size={12} />
                  </span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </TaraSection>

      <TaraSection id="on-the-map" heading="On the map">
        <MapEmbed query={TARAKESWAR.mapsQuery} label="Taraknath Mandir, Tarakeswar" />
      </TaraSection>

      <TaraSection heading="From the blog">
        <ul className="flex flex-col gap-2.5">
          {BLOG_POSTS.slice(0, 4).map((p) => (
            <li key={p.slug}>
              <Link
                to={`${PAGE_PATH.tarakeswarBlog}/${p.slug}`}
                className="block rounded-2xl border border-tara-outline-variant bg-tara-surface px-4 py-3.5 transition-colors hover:border-tara-secondary/50 hover:bg-tara-secondary-container/30"
              >
                <span className="block text-[14px] font-bold leading-snug text-tara-on-surface">{p.title}</span>
                <span className="mt-1 block text-[12.5px] leading-relaxed text-tara-on-surface-muted">{p.excerpt}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          to={PAGE_PATH.tarakeswarBlog}
          className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-tara-primary hover:underline"
        >
          All {BLOG_POSTS.length} posts <ArrowRightIcon size={13} />
        </Link>
      </TaraSection>

      <TaraSection heading="Questions">
        <TaraFaq items={PAGE_FAQ.tarakeswar} />
      </TaraSection>
    </TarakeswarLayout>
  );
}
