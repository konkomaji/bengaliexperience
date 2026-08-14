import { BRAND, DRIVER } from "../data/brand";
import { EXPERIENCES } from "../data/experiences";
import { PLAYLISTS, TOTAL_TRACKS } from "../data/playlists";
import { SCENE } from "../data/scene";
import { PAGE_FAQ, PAGE_PATH, PAGE_SEO, type PageId } from "../data/seo";

/**
 * schema.org @graph, per page.
 *
 * Both pages share the entities that describe the project itself: the site,
 * the person behind it, the social card. What differs is what the page is
 * about. The home page's subject is the collection of experiences, so it
 * carries an ItemList of them. The bus page's subject is the music, so it
 * carries the MusicPlaylist.
 *
 * Tracklists are deliberately not enumerated. They live on YouTube and change
 * without a redeploy, so asserting a fixed one would mean asserting something
 * that is already going stale. The playlist-level facts are the ones that
 * stay true.
 *
 * Used at the edge by functions/_middleware.ts for crawlers, and re-applied
 * client side on navigation.
 */
export function buildJsonLd(pageId: PageId) {
  const seo = PAGE_SEO[pageId];
  const path = PAGE_PATH[pageId];
  const url = BRAND.url + path;
  const image = BRAND.url + BRAND.ogImage;
  const isHome = pageId === "home";

  /** One named human behind the site. An answer engine asked "who made this"
   *  should not have to guess, and an attributed page is a stronger thing to
   *  cite than an anonymous one. Person rather than Organization, because
   *  that is what this actually is. */
  const curator = {
    "@type": "Person",
    "@id": `${BRAND.url}/#curator`,
    name: DRIVER.name,
    description: DRIVER.bio,
    url: BRAND.url,
    sameAs: [DRIVER.href],
  };

  const website = {
    "@type": "WebSite",
    "@id": `${BRAND.url}/#website`,
    url: BRAND.url,
    name: BRAND.nameEn,
    alternateName: [BRAND.seoTitle, "Bengali Experience"],
    description: BRAND.tagline,
    inLanguage: ["en-IN", "bn-IN"],
    publisher: { "@id": `${BRAND.url}/#curator` },
  };

  const primaryImage = {
    "@type": "ImageObject",
    "@id": `${url}#primaryimage`,
    url: image,
    contentUrl: image,
    width: 1200,
    height: 630,
    caption: BRAND.ogImageAlt,
  };

  const webPage = {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: seo.title,
    description: seo.description,
    isPartOf: { "@id": `${BRAND.url}/#website` },
    inLanguage: "en-IN",
    primaryImageOfPage: { "@id": `${url}#primaryimage` },
    breadcrumb: { "@id": `${url}#breadcrumb` },
    // Everything here is free, and it is worth saying in the field built for
    // it rather than in the prose, where it would push the actual subject of
    // the page down the paragraph.
    isAccessibleForFree: true,
    mainEntity: { "@id": isHome ? `${BRAND.url}/#experiences` : `${BRAND.url}/#collection` },
    about: {
      "@type": "Thing",
      name: isHome ? "Bengali culture and nostalgia" : "Bengali bus driver music in West Bengal",
    },
  };

  const faq = {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: PAGE_FAQ[pageId].map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  // The home page is the top of the site, so its trail is one item. Listing
  // the site and then the same URL again as its own child is a loop dressed
  // up as a hierarchy.
  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: isHome
      ? [{ "@type": "ListItem", position: 1, name: BRAND.nameEn, item: url }]
      : [
          { "@type": "ListItem", position: 1, name: BRAND.nameEn, item: `${BRAND.url}/` },
          { "@type": "ListItem", position: 2, name: seo.h1, item: url },
        ],
  };

  /** The shelf. Planned entries are listed without a URL, which is the honest
   *  way to say "this is real and not built yet" in structured data. */
  const experiences = {
    "@type": "ItemList",
    "@id": `${BRAND.url}/#experiences`,
    name: "Bengali Experience: the collection",
    numberOfItems: EXPERIENCES.length,
    itemListElement: EXPERIENCES.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: e.name,
      description: e.blurb,
      ...(e.path ? { url: BRAND.url + e.path } : {}),
    })),
  };

  const collection = {
    "@type": "MusicPlaylist",
    "@id": `${BRAND.url}/#collection`,
    name: "Bengali Bus Driver Playlist",
    description:
      "Nonstop Bangla bangers from the 90s to the 20s, the songs a West Bengal bus driver actually plays, shuffled fresh on every visit.",
    url: BRAND.url + PAGE_PATH.busdriver,
    genre: ["Bengali music", "Bangla adhunik", "Bengali film music", "Bangla band"],
    inLanguage: ["bn-IN", "en-IN"],
    numTracks: TOTAL_TRACKS,
    isAccessibleForFree: true,
    creator: { "@id": `${BRAND.url}/#curator` },
    hasPart: PLAYLISTS.map((p) => ({
      "@type": "MusicPlaylist",
      name: p.youtubeTitle,
      url: `https://www.youtube.com/playlist?list=${p.id}`,
      numTracks: p.approxTracks,
    })),
  };

  // The old standalone hero illustration is gone; the driving scene is the
  // page's image now and the social card stands in for it, so this points at
  // the same file as the primary image, keeping its own caption of the bus.
  const busImage = {
    "@type": "ImageObject",
    "@id": `${BRAND.url}${PAGE_PATH.busdriver}#scene`,
    url: image,
    contentUrl: image,
    caption: SCENE.heroAlt,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      curator,
      website,
      primaryImage,
      webPage,
      faq,
      breadcrumb,
      ...(isHome ? [experiences] : [collection, busImage]),
    ],
  };
}
