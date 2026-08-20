import { BRAND, DRIVER } from "../brand";
import { PAGE_FAQ, PAGE_PATH, PAGE_SEO, type PageId } from "../seo";
import { DIRECTORY_ENTRIES, type DirectoryCategory } from "./directory";
import { TARAKESWAR } from "./core";
import type { BlogPost } from "./blog";

/**
 * JSON-LD for the Tarakeswar section, kept separate from src/lib/jsonld.ts
 * (the Bengali Experience @graph) because the two subjects share nothing:
 * different curator relationship (this is a guide *about* a place, not a
 * built experience), different schema.org types, and a breadcrumb trail
 * that is three levels deep here against two on the rest of the site.
 * Called from the same two places every other page's JSON-LD is: the
 * client-side <JsonLd> component and functions/_middleware.ts, for the
 * crawlers that do not run either.
 */

const curator = {
  "@type": "Person",
  "@id": `${BRAND.url}/#curator`,
  name: DRIVER.name,
  description: DRIVER.bio,
  url: BRAND.url,
  sameAs: [DRIVER.href],
};

const publisher = { "@id": `${BRAND.url}/#curator` };

/** The section's one generated card (scripts/prepare-tarakeswar-og.mjs),
 *  shared by every Tarakeswar page and blog post as their primaryImage,
 *  the same role src/lib/jsonld.ts's primaryImage plays for the rest of
 *  the site. */
const primaryImage = {
  "@type": "ImageObject",
  "@id": `${BRAND.url}/tarakeswar#primaryimage`,
  url: `${BRAND.url}/tarakeswar/og.jpg`,
  contentUrl: `${BRAND.url}/tarakeswar/og.jpg`,
  width: 1200,
  height: 630,
  caption: "An illustrated riverside view of Tarakeswar: Dudhpukur pond and the temple's domes among the town's rooftops, titled Tarakeswar: Travel & Pilgrimage Guide.",
};

const DIRECTORY_SCHEMA_TYPE: Record<DirectoryCategory, string> = {
  eat: "Restaurant",
  sweets: "Store",
  stay: "LodgingBusiness",
  pharmacy: "Pharmacy",
  hospital: "Hospital",
  bank: "BankOrCreditUnion",
};

const hubBreadcrumb = [
  { "@type": "ListItem", position: 1, name: BRAND.nameEn, item: `${BRAND.url}/` },
  { "@type": "ListItem", position: 2, name: "Tarakeswar", item: BRAND.url + PAGE_PATH.tarakeswar },
];

function faqNode(url: string, pageId: PageId) {
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: PAGE_FAQ[pageId].map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** The four static Tarakeswar pages and the blog index. Individual blog
 *  posts use buildTarakeswarBlogPostJsonLd below instead. */
export function buildTarakeswarJsonLd(
  pageId: "tarakeswar" | "tarakeswarTemple" | "tarakeswarFood" | "tarakeswarReach" | "tarakeswarBlog",
) {
  const seo = PAGE_SEO[pageId];
  const path = PAGE_PATH[pageId];
  const url = BRAND.url + path;
  const isHub = pageId === "tarakeswar";

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
    primaryImageOfPage: { "@id": primaryImage["@id"] },
    isAccessibleForFree: true,
    about: { "@type": "Place", name: TARAKESWAR.name },
  };

  const subject = subjectFor(pageId);

  return {
    "@context": "https://schema.org",
    "@graph": [curator, webPage, primaryImage, breadcrumb, faqNode(url, pageId), ...subject],
  };
}

function subjectFor(pageId: PageId) {
  const geo = { "@type": "GeoCoordinates", latitude: TARAKESWAR.coordinates.lat, longitude: TARAKESWAR.coordinates.lng };
  const address = {
    "@type": "PostalAddress",
    addressLocality: "Tarakeswar",
    addressRegion: "West Bengal",
    postalCode: TARAKESWAR.pincode,
    addressCountry: "IN",
  };

  if (pageId === "tarakeswar") {
    return [
      {
        "@type": "TouristDestination",
        "@id": `${BRAND.url}/tarakeswar#place`,
        name: TARAKESWAR.name,
        alternateName: ["Tarkeswar", "Tarakeshwar", "Tarkeshwar"],
        description:
          "A temple town in Hooghly district, West Bengal, built around the Taraknath Mandir, one of Bengal's most visited Shiva temples.",
        address,
        geo,
        publisher,
        touristType: ["Pilgrims", "Day trippers", "Devotees of Shiva"],
      },
    ];
  }

  if (pageId === "tarakeswarTemple") {
    return [
      {
        "@type": ["TouristAttraction", "PlaceOfWorship"],
        "@id": `${BRAND.url}${PAGE_PATH.tarakeswarTemple}#temple`,
        name: TARAKESWAR.templeName,
        alternateName: "Taraknath Mandir",
        description:
          "A Shiva temple in Tarakeswar, West Bengal, worshipped as Baba Taraknath, generally dated to around 1729, built in Bengal's atchala style.",
        address,
        geo,
        publisher,
        isAccessibleForFree: true,
      },
    ];
  }

  if (pageId === "tarakeswarFood") {
    return [
      {
        "@type": "ItemList",
        "@id": `${BRAND.url}${PAGE_PATH.tarakeswarFood}#directory`,
        name: "Tarakeswar directory: places to eat, stay and essential services",
        numberOfItems: DIRECTORY_ENTRIES.length,
        itemListElement: DIRECTORY_ENTRIES.map((e, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": DIRECTORY_SCHEMA_TYPE[e.category],
            name: e.name,
            address: { "@type": "PostalAddress", addressLocality: "Tarakeswar", addressRegion: "West Bengal", addressCountry: "IN", streetAddress: e.area },
          },
        })),
      },
    ];
  }

  if (pageId === "tarakeswarReach") {
    return [
      {
        "@type": "HowTo",
        "@id": `${BRAND.url}${PAGE_PATH.tarakeswarReach}#howto`,
        name: "How to reach Tarakeswar",
        description: "Reaching Tarakeswar from Kolkata and Howrah by train, road or bus.",
        step: [
          {
            "@type": "HowToStep",
            name: "By train",
            text: "Take a direct EMU local from Howrah station to Tarakeswar station, about 1.5 hours, with roughly 35 to 38 trains running each day.",
          },
          {
            "@type": "HowToStep",
            name: "By road",
            text: "Drive via State Highway 2 or State Highway 15; most map tools show 55 to 65 km from central Kolkata, roughly 1 to 2 hours depending on traffic.",
          },
          {
            "@type": "HowToStep",
            name: "By bus",
            text: "Take an SBSTC or private bus from Esplanade, Babughat, Arambagh or Serampore, roughly 2.5 to 3.5 hours.",
          },
        ],
      },
    ];
  }

  // tarakeswarBlog: the index page's subject is the list of posts, kept
  // lightweight here since each post carries its own full BlogPosting node.
  return [
    {
      "@type": "Blog",
      "@id": `${BRAND.url}${PAGE_PATH.tarakeswarBlog}#blog`,
      name: "The Tarakeswar Blog",
      publisher,
    },
  ];
}

/** One BlogPosting + FAQPage + BreadcrumbList per post. */
export function buildTarakeswarBlogPostJsonLd(post: BlogPost) {
  const url = `${BRAND.url}${PAGE_PATH.tarakeswarBlog}/${post.slug}`;

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      ...hubBreadcrumb,
      { "@type": "ListItem", position: 3, name: "Blog", item: BRAND.url + PAGE_PATH.tarakeswarBlog },
      { "@type": "ListItem", position: 4, name: post.title, item: url },
    ],
  };

  const article = {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    headline: post.h1,
    description: post.description,
    url,
    inLanguage: "en-IN",
    isAccessibleForFree: true,
    datePublished: post.publishedDate,
    dateModified: post.updatedDate ?? post.publishedDate,
    author: { "@id": `${BRAND.url}/#curator` },
    publisher,
    image: { "@id": primaryImage["@id"] },
    about: { "@type": "Place", name: TARAKESWAR.name },
    articleSection: post.category,
  };

  const faq = {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: post.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [curator, primaryImage, article, breadcrumb, faq],
  };
}
