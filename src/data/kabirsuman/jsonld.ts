import { BRAND, DRIVER } from "../brand";
import { PAGE_FAQ, PAGE_PATH, PAGE_SEO, type PageId } from "../seo";
import type { Album } from "./catalogue";
import type { ArchiveSong } from "./catalogue.generated";
import { albumDescription, albumTitle, songDescription, songTitle } from "./dynamicSeo";
import { TOTAL_ALBUMS, TOTAL_SONGS } from "./counts.generated";

/**
 * JSON-LD for the Kabir Suman section, kept separate from src/lib/jsonld.ts
 * for the same reason src/data/tarakeswar/jsonld.ts is: a different subject
 * (a MusicGroup's/Person's body of work, not a built "experience"), a
 * deeper breadcrumb, and — here — two dynamic collections (albums, songs)
 * neither of the other two sections has to handle.
 */

const curator = {
  "@type": "Person",
  "@id": `${BRAND.url}/#curator`,
  name: DRIVER.name,
  description: DRIVER.bio,
  url: BRAND.url,
  sameAs: [DRIVER.href],
};

/** The subject of the whole section: not this site's curator, the musician
 *  it is about. Person rather than MusicGroup — Suman recorded almost
 *  entirely as a solo artist. */
const suman = {
  "@type": "Person",
  "@id": `${BRAND.url}/kabirsuman#person`,
  name: "Kabir Suman",
  alternateName: ["Suman Chattopadhyay", "কবীর সুমন"],
  description:
    "Bengali singer-songwriter, journalist and broadcaster, born 1949, usually credited with starting jibonmukhi gaan.",
  url: BRAND.url + PAGE_PATH.kabirsuman,
  sameAs: ["https://en.wikipedia.org/wiki/Kabir_Suman", "https://bn.wikipedia.org/wiki/কবীর_সুমন"],
};

const hubBreadcrumb = [
  { "@type": "ListItem", position: 1, name: BRAND.nameEn, item: `${BRAND.url}/` },
  { "@type": "ListItem", position: 2, name: "Kabir Suman", item: BRAND.url + PAGE_PATH.kabirsuman },
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

type KsFixedPageId = "kabirsuman" | "kabirsumanLife" | "kabirsumanWorks" | "kabirsumanWords" | "kabirsumanSources";

/** The five fixed pages. Albums and songs use the two builders below instead. */
export function buildKabirSumanJsonLd(pageId: KsFixedPageId) {
  const seo = PAGE_SEO[pageId];
  const path = PAGE_PATH[pageId];
  const url = BRAND.url + path;
  const isHub = pageId === "kabirsuman";

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
    about: { "@id": suman["@id"] },
  };

  const extra =
    pageId === "kabirsumanWorks"
      ? [
          {
            "@type": "MusicPlaylist",
            "@id": `${BRAND.url}/kabirsuman#discography`,
            name: "Kabir Suman: complete discography",
            numTracks: TOTAL_SONGS,
            byArtist: { "@id": suman["@id"] },
            description: `${TOTAL_ALBUMS} albums, catalogued chronologically.`,
          },
        ]
      : [];

  const faq = faqNode(url, pageId);

  return {
    "@context": "https://schema.org",
    "@graph": [curator, suman, webPage, breadcrumb, ...(faq ? [faq] : []), ...extra],
  };
}

/** One album page: a MusicAlbum, its tracks as MusicComposition references. */
export function buildKabirSumanAlbumJsonLd(album: Album, songs: ArchiveSong[]) {
  const url = `${BRAND.url}/kabirsuman/album/${album.slug}`;
  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [...hubBreadcrumb, { "@type": "ListItem", position: 3, name: album.roman, item: url }],
  };
  const musicAlbum = {
    "@type": "MusicAlbum",
    "@id": `${url}#album`,
    name: album.roman,
    alternateName: album.bn,
    datePublished: album.yearUncertain ? undefined : String(album.year),
    byArtist: { "@id": suman["@id"] },
    numTracks: songs.length,
    image: album.cover ? BRAND.url + album.cover : undefined,
    track: songs.map((s) => ({
      "@type": "MusicComposition",
      name: s.roman,
      alternateName: s.bn,
      url: `${BRAND.url}/kabirsuman/song/${s.slug}`,
    })),
  };
  const webPage = {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: albumTitle(album),
    description: albumDescription(album),
    inLanguage: "en-IN",
    breadcrumb: { "@id": `${url}#breadcrumb` },
    isAccessibleForFree: true,
    mainEntity: { "@id": `${url}#album` },
  };
  return { "@context": "https://schema.org", "@graph": [curator, suman, musicAlbum, webPage, breadcrumb] };
}

/** One song page: a MusicComposition, with its lyric CreativeWork attached
 *  but not embedded — the text lives on the page and in the lyrics JSON,
 *  not duplicated a third time inside a script tag. */
export function buildKabirSumanSongJsonLd(song: ArchiveSong, album: Album | null) {
  const url = `${BRAND.url}/kabirsuman/song/${song.slug}`;
  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      ...hubBreadcrumb,
      ...(album
        ? [{ "@type": "ListItem", position: 3, name: album.roman, item: `${BRAND.url}/kabirsuman/album/${album.slug}` }]
        : []),
      { "@type": "ListItem", position: album ? 4 : 3, name: song.roman, item: url },
    ],
  };
  const composition = {
    "@type": "MusicComposition",
    "@id": `${url}#song`,
    name: song.roman,
    alternateName: song.bn,
    composer: { "@id": suman["@id"] },
    lyricist: { "@id": suman["@id"] },
    inAlbum: album ? { "@id": `${BRAND.url}/kabirsuman/album/${album.slug}#album` } : undefined,
    inLanguage: "bn",
  };
  const webPage = {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: songTitle(song, album),
    description: songDescription(song, album),
    inLanguage: "en-IN",
    breadcrumb: { "@id": `${url}#breadcrumb` },
    isAccessibleForFree: true,
    mainEntity: { "@id": `${url}#song` },
  };
  return { "@context": "https://schema.org", "@graph": [curator, suman, composition, webPage, breadcrumb] };
}
