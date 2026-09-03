import { Link } from "react-router-dom";
import { IMAGE_CREDIT_BY_SLUG } from "../../data/uttamkumar/credits";
import { PAGE_PATH } from "../../data/seo";

/**
 * The one place an image and its credit line are wired together, so every
 * use of a self-hosted photo on this site carries visible attribution at
 * the point of use — not just centrally on /uttamkumar/credits. Throws at
 * import time on an unknown slug, the same "wrong reference breaks the
 * build, not the page" rule films.ts's merge-check uses.
 */
export function CreditedImage({ slug, className }: { slug: string; className?: string }) {
  const credit = IMAGE_CREDIT_BY_SLUG[slug];
  if (!credit) throw new Error(`CreditedImage: no credit entry for "${slug}" in src/data/uttamkumar/credits.ts`);

  return (
    <figure className={className}>
      <img src={`/uttamkumar/photos/${slug}.webp`} alt={credit.caption} loading="lazy" className="w-full rounded-sm object-cover" />
      <figcaption className="uk-mono mt-1.5 text-[10px] leading-snug text-uk-on-void-muted">
        {credit.caption}{" "}
        <Link to={PAGE_PATH.uttamkumarSources} className="text-uk-gold hover:underline">
          ({credit.author}, {credit.license})
        </Link>
      </figcaption>
    </figure>
  );
}
