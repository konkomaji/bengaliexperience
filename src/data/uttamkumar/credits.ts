/**
 * Every self-hosted image in this section, with real provenance — not a
 * blanket "images via Wikimedia Commons" line. See
 * scripts/prepare-uttamkumar-images.mjs for why these four and not the six
 * other files in Commons' Uttam Kumar category, and for the exact source
 * URLs these were fetched from.
 *
 * Text reuse is credited separately, in the same spirit: 136 of the 211
 * film pages carry a synopsis drawn from that film's own Wikipedia article
 * (see src/data/uttamkumar/extracts.generated.ts), reused under CC BY-SA 4.0
 * with a link back to the exact article on the film's own page.
 */
export interface ImageCredit {
  slug: string;
  /** what it actually shows */
  caption: string;
  author: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
}

export const IMAGE_CREDITS: ImageCredit[] = [
  {
    slug: "centenary-stamp",
    caption: "India Post's 2009 commemorative postage stamp, issued for his 83rd birth anniversary.",
    author: "India Post, Government of India",
    license: "Government Open Data License – India (GODL)",
    licenseUrl: "https://data.gov.in/government-open-data-license-india",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Uttam_Kumar_2009_stamp_of_India.jpg",
  },
  {
    slug: "portrait-sketch-murty",
    caption: "A charcoal pencil portrait, drawn and dedicated to the public domain by the artist.",
    author: "Ponnada Murty",
    license: "CC0 1.0 (Public Domain Dedication)",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Uttam_Kumar,_legendary_actor_of_Bengali_cinema_-_charcoal_pencil_sketch.jpg",
  },
  {
    slug: "portrait-sketch-ghosh",
    caption: "A second original portrait tribute, drawn and dedicated to the public domain by the artist.",
    author: "Saptarshi Ghosh",
    license: "CC0 1.0 (Public Domain Dedication)",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Utttam-Sapta.jpg",
  },
  {
    slug: "morgan-house-testimonial",
    caption:
      "A framed guestbook testimonial signed by Uttam Kumar and Supriya Devi, on display at Morgan House, Kalimpong, dated 29 November.",
    author: "Subhrajyoti07",
    license: "CC0 1.0 (Public Domain Dedication)",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Morgan_House_Kalimpong_Testimonial_of_Mahanayak_Uttam_Kumar_and_Supriya.jpg",
  },
];

export const IMAGE_CREDIT_BY_SLUG: Record<string, ImageCredit> = Object.fromEntries(
  IMAGE_CREDITS.map((c) => [c.slug, c]),
);

/** For every rejected Commons file, why — shown on the credits page so the
 *  gap reads as a decision, not an oversight. */
export const REJECTED_IMAGES: { title: string; reason: string }[] = [
  {
    title: "Basanta Chowdhury & Uttam Kumar..jpg",
    reason: "A photograph of an existing vintage print, not an original work — the underlying photo's own rights are unresolved regardless of the uploader's \"own work\" tag.",
  },
  {
    title: "Ukinnishithe.jpg",
    reason: "A film-still screenshot. A screenshot doesn't create a new licence over the film frame it's taken from.",
  },
  {
    title: "Durgadas-bannerjee.jpg",
    reason: "A different actor (Durgadas Bandopadhyay), mis-filed into this category — a misattribution risk, not just a licensing one.",
  },
  {
    title: "UttamKumar.jpg",
    reason: "A genuinely free photo, but of a Kolkata street at night with an indistinct statue far in frame — not usable as an image of him.",
  },
  {
    title: "The signature by Uttam Kumar.png",
    reason: "Plausibly fine (signatures generally aren't copyrightable), but sourced from a third party's Facebook post with a chain of custody this project can't verify — left out for a cleaner credits page.",
  },
];
