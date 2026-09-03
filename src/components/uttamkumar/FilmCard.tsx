import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Film } from "../../data/uttamkumar/films";
import { UTTAMKUMAR_FILM_PREFIX } from "../../data/seo";

/**
 * A generated typographic "poster" card rather than a real film still — see
 * the plan's legal note: only photography first published before ~1966 (the
 * Indian 60-year photograph-copyright window) could be self-hosted safely,
 * and no such set has been sourced and rights-checked yet. Every film gets
 * this same in-theme card until that curation pass happens, the same
 * fallback move the Marvel Atlas makes for a poster it doesn't have — never
 * a missing image, always a drawn one.
 */
export function FilmCard({ film, index }: { film: Film; index: number }) {
  const content = (
    <div className="group relative flex aspect-[2/3] flex-col justify-between overflow-hidden rounded-sm border border-uk-outline-variant bg-gradient-to-b from-uk-curtain to-uk-void-dim p-2.5 transition-transform group-hover:-translate-y-0.5">
      <div aria-hidden className="uk-sprockets absolute inset-x-0 top-0 h-3 opacity-60" />
      <p className="uk-mono relative text-[9px] font-semibold text-uk-gold">{film.year}</p>
      <p className="uk-marquee relative line-clamp-4 text-[13px] leading-tight text-uk-on-void">{film.title}</p>
      <div aria-hidden className="uk-sprockets absolute inset-x-0 bottom-0 h-3 rotate-180 opacity-60" />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: (index % 12) * 0.03 }}
    >
      {film.detail ? (
        <Link to={`${UTTAMKUMAR_FILM_PREFIX}/${film.slug}`} className="group block">
          {content}
        </Link>
      ) : (
        <div className="opacity-80">{content}</div>
      )}
    </motion.div>
  );
}
