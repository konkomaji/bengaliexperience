import { BRAND, DRIVER } from "../brand";
import { PAGE_FAQ, PAGE_PATH, type PageId } from "../seo";
import type { Film } from "./films";
import { TOTAL_FILMS } from "./counts.generated";
import { filmDescription, filmTitle } from "./dynamicSeo";
import { PAGE_SEO_UTTAMKUMAR, type UttamKumarPageId } from "./seo";

/**
 * JSON-LD for the Uttam Kumar section, kept separate from src/lib/jsonld.ts
 * for the reason kabirsuman/jsonld.ts is: a different subject (an actor's
 * body of work, not a built "experience"), its own breadcrumb depth, and a
 * dynamic film collection the other two sections don't have to handle.
 */

const curator = {
  "@type": "Person",
  "@id": `${BRAND.url}/#curator`,
  name: DRIVER.name,
  description: DRIVER.bio,
  url: BRAND.url,
  sameAs: [DRIVER.href],
};

/** The subject of the section: the actor, not this site's curator. */
const uttamKumar = {
  "@type": "Person",
  "@id": `${BRAND.url}/uttamkumar#person`,
  name: "Uttam Kumar",
  alternateName: ["Arun Kumar Chattopadhyay", "Mahanayak"],
  description: "Bengali film actor (1926–1980), known as Mahanayak, and the first-ever National Film Award winner for Best Actor.",
  birthDate: "1926-09-03",
  deathDate: "1980-07-24",
  url: BRAND.url + PAGE_PATH.uttamkumar,
  sameAs: ["https://en.wikipedia.org/wiki/Uttam_Kumar"],
};

const hubBreadcrumb = [
  { "@type": "ListItem", position: 1, name: BRAND.nameEn, item: `${BRAND.url}/` },
  { "@type": "ListItem", position: 2, name: "Uttam Kumar", item: BRAND.url + PAGE_PATH.uttamkumar },
];

function faqNode(url: string, pageId: PageId) {
  const items = PAGE_FAQ[pageId];
  if (!items.length) return null;
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** The nine fixed pages. Films use the builder below instead. */
export function buildUttamKumarJsonLd(pageId: UttamKumarPageId) {
  const seo = PAGE_SEO_UTTAMKUMAR[pageId];
  const path = PAGE_PATH[pageId];
  const url = BRAND.url + path;
  const isHub = pageId === "uttamkumar";

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: isHub
      ? hubBreadcrumb
      : [...hubBreadcrumb, { "@type": "ListItem", position: 3, name: seo.h1, item: url }],
  };

  const webPage = {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: seo.title,
    description: seo.description,
    inLanguage: "en-IN",
    breadcrumb: { "@id": `${url}#breadcrumb` },
    isAccessibleForFree: true,
    about: { "@id": uttamKumar["@id"] },
  };

  const extra =
    pageId === "uttamkumarFilms"
      ? [
          {
            "@type": "ItemList",
            "@id": `${BRAND.url}/uttamkumar#filmography`,
            name: "Uttam Kumar: complete filmography",
            numberOfItems: TOTAL_FILMS,
            about: { "@id": uttamKumar["@id"] },
          },
        ]
      : [];

  const faq = faqNode(url, pageId);

  return {
    "@context": "https://schema.org",
    "@graph": [curator, uttamKumar, webPage, breadcrumb, ...(faq ? [faq] : []), ...extra],
  };
}

/** One film page: a Movie, with its year, director and cast as plain facts. */
export function buildUttamKumarFilmJsonLd(film: Film) {
  const url = `${BRAND.url}/uttamkumar/film/${film.slug}`;
  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [...hubBreadcrumb, { "@type": "ListItem", position: 3, name: film.title, item: url }],
  };
  const movie = {
    "@type": "Movie",
    "@id": `${url}#movie`,
    name: film.title,
    datePublished: String(film.year),
    director: film.detail?.director ? { "@type": "Person", name: film.detail.director } : undefined,
    actor: [
      { "@type": "Person", "@id": uttamKumar["@id"], name: "Uttam Kumar" },
      ...(film.detail?.coStars ?? []).map((c) => ({ "@type": "Person", name: c })),
    ],
    description: filmDescription(film),
    inLanguage: "bn",
  };
  const webPage = {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: filmTitle(film),
    description: filmDescription(film),
    inLanguage: "en-IN",
    breadcrumb: { "@id": `${url}#breadcrumb` },
    isAccessibleForFree: true,
    mainEntity: { "@id": `${url}#movie` },
  };
  return { "@context": "https://schema.org", "@graph": [curator, uttamKumar, movie, webPage, breadcrumb] };
}
