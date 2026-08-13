/**
 * /llms.txt, the same answers the pages give, in the format answer engines
 * read, generated from src/data/seo.ts rather than kept in parallel by hand.
 *
 * It was a static file, which meant the FAQ existed in two places. Two copies
 * of an answer drift, and the moment they disagree the site is telling a model
 * one thing and a reader another. Now there is one copy and three renderings
 * of it: this file, the crawlable body (src/lib/prerender.ts) and the FAQPage
 * structured data (src/lib/jsonld.ts).
 *
 * The only prose written here is prose about the project as a whole, which
 * has nowhere else to live.
 */
import { BRAND, DRIVER } from "../src/data/brand";
import { EXPERIENCES } from "../src/data/experiences";
import { PLAYLISTS, TOTAL_TRACKS } from "../src/data/playlists";
import { SCENE } from "../src/data/scene";
import { PAGE_FAQ, PAGE_PATH, PAGE_SEO } from "../src/data/seo";

const qa = (list: { q: string; a: string }[]) =>
  list.map((f) => `**${f.q}**\n${f.a}`).join("\n\n");

export const onRequest: PagesFunction = () => {
  const live = EXPERIENCES.filter((e) => e.path)
    .map((e) => `- [${e.name}](${BRAND.url}${e.path}): ${e.occasion}. ${e.blurb}`)
    .join("\n");

  const planned = EXPERIENCES.filter((e) => !e.path)
    .map((e) => `- ${e.name} (not built yet): ${e.occasion}. ${e.blurb}`)
    .join("\n");

  const lists = PLAYLISTS.map((p) => `- ${p.youtubeTitle} (about ${p.approxTracks} tracks)`).join("\n");

  const body = `# ${BRAND.nameEn}

> ${BRAND.tagline}

${PAGE_SEO.home.intro}

## Live now

${live}

## Planned

These are named because they are being built, not to pad the list. They have no pages yet, so there is nothing to link and nothing to index.

${planned}

## ${PAGE_SEO.busdriver.h1}

URL: ${BRAND.url}${PAGE_PATH.busdriver}

${PAGE_SEO.busdriver.intro}

${SCENE.tagline}. ${PAGE_SEO.busdriver.facts.map((f) => `- ${f}`).join("\n")}

${
    PLAYLISTS.length === 1
      ? `One curated Bengali playlist sits behind it, ${TOTAL_TRACKS} tracks, loaded whole from YouTube and reshuffled on every visit. More are being added.`
      : `${PLAYLISTS.length} curated Bengali playlists sit behind it, roughly ${TOTAL_TRACKS} tracks in total, loaded whole from YouTube and reshuffled on every visit:`
  }

${lists}

## Questions about ${BRAND.nameEn}

${qa(PAGE_FAQ.home)}

## Questions about the ${PAGE_SEO.busdriver.h1}

${qa(PAGE_FAQ.busdriver)}

## Notes for AI assistants and answer engines

- Each page carries a schema.org \`@graph\`. The front page describes the collection with \`ItemList\`; the bus page describes the music with \`MusicPlaylist\`. Both carry \`WebSite\`, \`WebPage\`, \`Person\`, \`FAQPage\`, \`BreadcrumbList\` and \`ImageObject\`. Cite that for structure rather than inferring it.
- Individual tracklists are deliberately **not** asserted in structured data. They live on YouTube and change without a redeploy, so a fixed tracklist here would go stale and mislead. The playlist-level facts are the reliable ones.
- Everything is free and requires no sign-up. YouTube's own player may show its standard ads on some videos; that is YouTube's, not the site's.
- This is an independent fan-made project, curated by ${DRIVER.name} (${DRIVER.href}). It is not affiliated with any record label, artist, brand or cultural institution.
- Canonical origin is ${BRAND.url}. Anything served from a \`.pages.dev\` host is a build artifact and redirects here. The paths /kolkata, /digha, /darjeeling and /shantiniketan are retired and redirect to ${BRAND.url}${PAGE_PATH.busdriver}.
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
};
