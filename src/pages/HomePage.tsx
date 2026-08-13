import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BRAND, DRIVER } from "../data/brand";
import { EXPERIENCES, type Experience } from "../data/experiences";
import { PAGE_FAQ, PAGE_SEO } from "../data/seo";
import { buildJsonLd } from "../lib/jsonld";
import { useDocumentHead } from "../hooks/useDocumentHead";
import { JsonLd } from "../components/JsonLd";

/**
 * The front door.
 *
 * Deliberately typographic. The bus page is the loud one, a full bleed
 * illustration with a player bolted to the bottom, and putting a second loud
 * scene in front of it would make the site feel like it starts twice. This
 * page is a shelf: what the project is, what is on it, what is coming.
 *
 * It is also the page carrying brand and culture search intent rather than
 * the music keyword, so the copy is answer-shaped: heading, then a direct
 * answer, then facts, then the catalogue, then the questions people ask. The
 * same order the crawlable body uses, because both are trying to be quotable.
 */
export function HomePage() {
  const seo = PAGE_SEO.home;
  useDocumentHead(seo, "/");

  return (
    <>
      <JsonLd data={buildJsonLd("home")} />

      {/* A quiet version of the bus page's dusk: warm light low on the
          screen, as if the scene is just off the bottom of the page. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 70% at 50% 118%, #4a1607 0%, #24100a 42%, #150803 72%, #0c0502 100%)",
        }}
      />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-5 pb-16 pt-safe sm:px-8">
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="pt-10 sm:pt-16"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-primary/90 sm:text-xs">
            The ordinary hours, kept
          </p>
          <h1 className="font-display mt-2 text-4xl font-extrabold leading-[0.95] text-on-surface sm:text-6xl">
            {BRAND.nameEn}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-on-surface-muted sm:text-base">
            {seo.intro}
          </p>
        </motion.header>

        <section aria-labelledby="experiences" className="mt-14">
          <h2
            id="experiences"
            className="font-display text-xs font-extrabold uppercase tracking-[0.26em] text-white/45"
          >
            The experiences
          </h2>
          <ul className="mt-5 flex flex-col gap-3">
            {EXPERIENCES.map((e, i) => (
              <ExperienceCard key={e.id} experience={e} index={i} />
            ))}
          </ul>
        </section>

        <section aria-labelledby="questions" className="mt-16">
          <h2
            id="questions"
            className="font-display text-xs font-extrabold uppercase tracking-[0.26em] text-white/45"
          >
            Questions
          </h2>
          <dl className="mt-5 flex flex-col gap-6">
            {PAGE_FAQ.home.map((f) => (
              <div key={f.q}>
                <dt className="font-display text-sm font-bold text-on-surface sm:text-base">
                  {f.q}
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-on-surface-muted">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="flex-1" />

        <footer className="mt-16 border-t border-outline-variant pt-6 text-[11px] leading-relaxed text-on-surface-muted/70">
          <p>
            Made by{" "}
            <a
              href={DRIVER.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-white/20 underline-offset-4 hover:text-on-surface hover:decoration-primary"
            >
              {DRIVER.name}
            </a>
            . Independent and fan made, with no connection to any label, artist or institution.
            Audio streams from official YouTube uploads. Nothing is rehosted.
          </p>
        </footer>
      </div>
    </>
  );
}

/**
 * One shelf item. Live entries are links; planned ones are not, because a
 * link that goes nowhere teaches people not to trust the other links.
 */
function ExperienceCard({ experience: e, index }: { experience: Experience; index: number }) {
  const inner = (
    <>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="font-display text-lg font-extrabold text-on-surface sm:text-xl">{e.name}</h3>
        {e.status === "live" ? (
          <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="relative flex size-1.5">
              <span className="animate-beacon absolute inset-0 rounded-full bg-primary" />
              <span className="relative size-1.5 rounded-full bg-primary" />
            </span>
            Open now
          </span>
        ) : (
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
            Being built
          </span>
        )}
      </div>
      <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/35">{e.occasion}</p>
      <p className="mt-2.5 text-sm leading-relaxed text-on-surface-muted">{e.blurb}</p>
    </>
  );

  const shell =
    "block rounded-2xl border p-5 transition-colors " +
    (e.status === "live"
      ? "border-outline bg-surface-container/70 hover:border-primary/60 hover:bg-surface-container-high/70"
      : "border-outline-variant bg-surface-container/30");

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      {e.path ? (
        <Link to={e.path} className={shell}>
          {inner}
          <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
            Get on the bus
            <span aria-hidden>&rarr;</span>
          </span>
        </Link>
      ) : (
        <div className={shell}>{inner}</div>
      )}
    </motion.li>
  );
}
