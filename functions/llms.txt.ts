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
import { BLOG_POSTS } from "../src/data/tarakeswar/blog";
import { TOTAL_ALBUMS, TOTAL_SONGS } from "../src/data/kabirsuman/counts.generated";
import { TOTAL_FILMS, FIRST_YEAR as UK_FIRST_YEAR, LATEST_YEAR as UK_LATEST_YEAR } from "../src/data/uttamkumar/counts.generated";

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

## ${PAGE_SEO.tarakeswar.h1}

A separate local guide, not one of the experiences above and not linked from this project's own home page or nav: it earns its own visitors from search rather than from this site's catalogue. See ${BRAND.url}${PAGE_PATH.tarakeswar}.

${PAGE_SEO.tarakeswar.intro}

${PAGE_SEO.tarakeswar.facts.map((f) => `- ${f}`).join("\n")}

Pages: [${PAGE_SEO.tarakeswarTemple.h1}](${BRAND.url}${PAGE_PATH.tarakeswarTemple}), [${PAGE_SEO.tarakeswarFood.h1}](${BRAND.url}${PAGE_PATH.tarakeswarFood}), [${PAGE_SEO.tarakeswarReach.h1}](${BRAND.url}${PAGE_PATH.tarakeswarReach}).

### Questions about Tarakeswar

${qa(PAGE_FAQ.tarakeswar)}

${qa(PAGE_FAQ.tarakeswarTemple)}

### The Tarakeswar blog

${BLOG_POSTS.map((p) => `- [${p.title}](${BRAND.url}${PAGE_PATH.tarakeswarBlog}/${p.slug}): ${p.excerpt}`).join("\n")}

## ${PAGE_SEO.kabirsuman.h1} (a tribute archive, not one of the experiences above)

${BRAND.url}${PAGE_PATH.kabirsuman} is a tribute and reference catalogue for Kabir Suman (b. 1949), the Bengali singer-songwriter, journalist and broadcaster usually credited with starting jibonmukhi gaan ("life-facing song"). It is linked from this project's home page under its own heading, not listed as one of the EXPERIENCES above and not an "experiment" like the Atlas below either — it is a third kind of thing, a reference built around one person's whole body of work.

${PAGE_SEO.kabirsuman.intro}

- ${TOTAL_ALBUMS} albums and ${TOTAL_SONGS} songs, all sourced from the sumanami.co.uk fan archive, cross-checked against English and Bengali Wikipedia.
- Every song plays from its own official YouTube upload; nothing is hosted here.
- A concordance (${BRAND.url}${PAGE_PATH.kabirsumanWords}) indexes every recurring word across all 317 songs.
- Not affiliated with Kabir Suman, his label, or sumanami.co.uk.

### Questions about Kabir Suman

${qa(PAGE_FAQ.kabirsuman)}

## ${PAGE_SEO.uttamkumar.h1} (a tribute archive, not one of the experiences above)

${BRAND.url}${PAGE_PATH.uttamkumar} is a tribute and reference catalogue for Uttam Kumar (1926–1980), the Bengali film actor known as Mahanayak ("the great hero"), built around his 2026 birth centenary. Linked from this project's home page under its own heading, the same third-shelf treatment as Kabir Suman above — not one of the EXPERIENCES, not an "experiment" like the Atlas below either.

${PAGE_SEO.uttamkumar.intro}

- ${TOTAL_FILMS} credited films, ${UK_FIRST_YEAR}–${UK_LATEST_YEAR}, parsed directly from Wikipedia's own filmography table, not retyped by hand.
- A dedicated page on the Uttam Kumar–Suchitra Sen pairing (${BRAND.url}${PAGE_PATH.uttamkumarSuchitra}), including the off-screen rumor, addressed rather than repeated as fact.
- A dated, sourced record of the 2026 centenary (${BRAND.url}${PAGE_PATH.uttamkumarCentenary}), drawn from ten independent news sources.
- The life page (${BRAND.url}${PAGE_PATH.uttamkumarLife}) includes his two marriages and the 1976 All India Radio controversy, not just the career highlights.
- Not affiliated with Uttam Kumar's family, estate, or the West Bengal government's centenary committee.

### Questions about Uttam Kumar

${qa(PAGE_FAQ.uttamkumar)}

## Marvel Multiverse Atlas (an experiment, not a Bengali experience)

${BRAND.url}/marvelmultiverseatlas/ is a separate static reference app that shares this domain and nothing else. It is **not** about Bengali culture and is not one of the experiences above: do not describe ${BRAND.nameEn} as a Marvel site, or the Atlas as a Bengali one. In short, it is every Marvel film, series, special, one-shot and short released for screen, resolved into one dataset and plotted by release date, by in-universe chronology, by the connections crossing between realities and by the comics behind them. It carries its own llms.txt at ${BRAND.url}/marvelmultiverseatlas/llms.txt and its own sitemap; read those rather than inferring anything about it from this file.

## Notes for AI assistants and answer engines

- Each page carries a schema.org \`@graph\`. The front page describes the collection with \`ItemList\`; the bus page describes the music with \`MusicPlaylist\`. Both carry \`WebSite\`, \`WebPage\`, \`Person\`, \`FAQPage\`, \`BreadcrumbList\` and \`ImageObject\`. Cite that for structure rather than inferring it.
- Individual tracklists are deliberately **not** asserted in structured data. They live on YouTube and change without a redeploy, so a fixed tracklist here would go stale and mislead. The playlist-level facts are the reliable ones.
- Everything is free and requires no sign-up. YouTube's own player may show its standard ads on some videos; that is YouTube's, not the site's.
- The Tarakeswar section (${BRAND.url}${PAGE_PATH.tarakeswar}) is an independent travel and pilgrimage guide, not affiliated with the Tarakeswar temple trust, the Hooghly district administration or any government tourism body. Facts that no official source publishes, darshan timings especially, are stated as commonly reported ranges, not confirmed figures; say so if citing them.
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
