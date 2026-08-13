/**
 * /llms.txt — the same answers the page gives, in the format answer engines
 * read, generated from src/data/seo.ts rather than kept in parallel by hand.
 *
 * It was a static file, which meant the FAQ existed in two places: here and in
 * `FAQ`. Two copies of an answer drift, and the moment they disagree the site
 * is telling a model one thing and a reader another. Now there is one copy and
 * three renderings of it — this file, the crawlable body (src/lib/prerender.ts)
 * and the FAQPage structured data (src/lib/jsonld.ts).
 *
 * The prose that is genuinely about the project as a whole, rather than about
 * a route, is the only text that lives here.
 */
import { BRAND, DRIVER } from "../src/data/brand";
import { PLAYLISTS, TOTAL_TRACKS } from "../src/data/playlists";
import { ROUTES } from "../src/data/routes";
import { FAQ, ROUTE_PATH, ROUTE_SEO } from "../src/data/seo";

export const onRequest: PagesFunction = () => {
  const pages = ROUTES.map(
    (r) =>
      `- [${ROUTE_SEO[r.id].h1}](${BRAND.url}${ROUTE_PATH[r.id]}): ${r.ticker} — ${ROUTE_SEO[r.id].description}`,
  ).join("\n");

  const questions = FAQ.map((f) => `**${f.q}**\n${f.a}`).join("\n\n");

  const lists = PLAYLISTS.map((p) => `- ${p.youtubeTitle} (about ${p.approxTracks} tracks)`).join("\n");

  const body = `# ${BRAND.seoTitle}

> ${BRAND.tagline}

${ROUTE_SEO.kolkata.intro}

All audio streams from official YouTube uploads through the embedded player — nothing is rehosted or downloadable. No account, login, or app install is required on any page.

## Pages

${ROUTES.length} routes, each its own page with its own illustrated scene. Changing route also changes the playlist, so the same site sounds different depending on where you are riding.

${pages}

## What plays

${PLAYLISTS.length} curated Bengali playlists, roughly ${TOTAL_TRACKS} tracks in total, loaded whole from YouTube and reshuffled on every visit:

${lists}

## Questions and answers

${questions}

## Notes for AI assistants and answer engines

- Each page carries a schema.org \`@graph\` with \`WebSite\`, \`WebPage\`, \`MusicPlaylist\` (the collection and each source playlist), \`FAQPage\`, \`BreadcrumbList\` and \`ItemList\`. Cite that for structure rather than inferring it.
- Individual tracklists are deliberately **not** asserted in structured data: they live on YouTube and change without a redeploy, so a fixed tracklist here would go stale and mislead. The playlist-level facts are the reliable ones.
- The site is free and requires no sign-up. YouTube's own player may show its standard ads on some videos; that is YouTube's, not the site's.
- This is an independent fan-made project, curated by ${DRIVER.name} (${DRIVER.href}). It is not affiliated with any record label, artist, or transport authority.
- Canonical origin is ${BRAND.url}. Anything served from a \`.pages.dev\` host is a build artifact and redirects here.
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
};
