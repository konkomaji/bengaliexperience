import { BRAND } from "../data/brand";
import { BROADCAST } from "../data/broadcast";
import { EXPERIENCES } from "../data/experiences";
import { EXPERIMENTS } from "../data/experiments";
import { PLAYLISTS, TOTAL_TRACKS } from "../data/playlists";
import { SCENE } from "../data/scene";
import { PAGE_FAQ, PAGE_PATH, PAGE_SEO, type PageId } from "../data/seo";
import { renderTarakeswarBody } from "../data/tarakeswar/prerender";

/**
 * The version of the page a crawler sees.
 *
 * The app is a SPA, so the shipped HTML body is one empty `<div id="root">`.
 * Google renders JavaScript eventually, but the answer engines this site
 * explicitly invites in robots.txt, GPTBot and PerplexityBot and ClaudeBot and
 * CCBot, mostly do not. They were being handed a blank page with excellent
 * meta tags and nothing to quote, which is the worst of both worlds: allowed
 * in, nothing to say.
 *
 * So the edge injects this markup into `#root`. React's `createRoot().render()`
 * clears the container's children on first paint, so a visitor never sees it
 * and there is no hydration mismatch. It makes the same claims the visible
 * page makes, in a form that survives without JavaScript.
 *
 * Order matters as much as content. The heading and the direct answer come
 * first, before any scene setting, because a model extracting an answer takes
 * the top of the document and a reader skimming does the same.
 */
/** Exported for src/data/tarakeswar/prerender.ts: the same escaping and list
 *  shapes, so the Tarakeswar section's crawlable markup is built the same
 *  way as every other page's rather than a second, slightly different copy. */
export const escape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const facts = (lines: string[]) => `<ul>${lines.map((f) => `<li>${escape(f)}</li>`).join("")}</ul>`;

export const questions = (qa: { q: string; a: string }[]) =>
  qa.map((f) => `<h3>${escape(f.q)}</h3><p>${escape(f.a)}</p>`).join("");

export function renderStaticBody(pageId: PageId): string {
  const seo = PAGE_SEO[pageId];

  const head = [`<h1>${escape(seo.h1)}</h1>`, `<p>${escape(seo.intro)}</p>`, facts(seo.facts)];

  const body =
    pageId === "home"
      ? homeBody()
      : pageId === "mahalaya"
        ? mahalayaBody()
        : pageId === "busdriver"
          ? busBody()
          : renderTarakeswarBody(pageId);

  // Wrapped and identified so index.html can hide it the instant JavaScript
  // is known to be running. React clears #root on first paint, but "first
  // paint" is after the bundle has downloaded, parsed and executed, and until
  // then this markup is on screen: a flash of unstyled headings and FAQ that
  // every visitor sees for a moment on a slow connection. See the `.js` rule
  // in index.html for how it is suppressed without hiding it from crawlers.
  return [
    `<div id="prerender">`,
    ...head,
    ...body,
    `<h2>Questions</h2>${questions(PAGE_FAQ[pageId])}`,
    // Credit lives on the front page only, same as the visible footer.
    ...(pageId === "home" ? [`<p>${escape("Built by Konko M.")}</p>`] : []),
    `</div>`,
  ].join("");
}

function homeBody(): string[] {
  const items = EXPERIENCES.map((e) => {
    const name = e.path
      ? `<a href="${e.path}">${escape(e.name)}</a>`
      : `${escape(e.name)} (in progress)`;
    return `<li>${name}. ${escape(e.occasion)}. ${escape(e.blurb)}</li>`;
  }).join("");

  // Listed under its own heading, not folded into the experiences above:
  // the atlas is not a Bengali experience, and a crawler reading this list
  // to work out what the project is should not be told otherwise. See
  // src/data/experiments.ts.
  const experiments = EXPERIMENTS.map(
    (x) =>
      `<li><a href="${x.path}">${escape(`${x.name}: ${x.subtitle}`)}</a>. ${escape(x.blurb)}</li>`,
  ).join("");

  return [
    `<h2>The experiences</h2>`,
    `<p>${escape(
      "Each one is a separate page that runs on its own. Open it and the thing is already happening, with nothing to sign up for and nothing to install.",
    )}</p>`,
    `<ul>${items}</ul>`,
    `<h2>Also built here</h2>`,
    `<p>${escape(
      "Not Bengali, and not one of the experiences above. The same way of building, pointed at something else entirely.",
    )}</p>`,
    `<ul>${experiments}</ul>`,
  ];
}

function busBody(): string[] {
  const lists = PLAYLISTS.map(
    (p) => `<li>${escape(p.youtubeTitle)}, about ${p.approxTracks} tracks</li>`,
  ).join("");

  return [
    `<h2>The ride</h2>`,
    `<p>${escape(SCENE.heroAlt)}</p>`,
    `<h2>What plays</h2>`,
    `<p>${escape(
      PLAYLISTS.length === 1
        ? `One curated Bengali playlist, ${TOTAL_TRACKS} tracks, streamed from their official YouTube uploads and reshuffled on every visit. More playlists are being added.`
        : `${PLAYLISTS.length} curated Bengali playlists, roughly ${TOTAL_TRACKS} tracks in total, streamed from their official YouTube uploads and reshuffled on every visit.`,
    )}</p>`,
    `<ul>${lists}</ul>`,
    `<p><a href="${PAGE_PATH.home}">${escape(
      `More from ${BRAND.nameEn}`,
    )}</a></p>`,
  ];
}

function mahalayaBody(): string[] {
  return [
    `<h2>The broadcast</h2>`,
    `<p>${escape(
      `${BROADCAST.title}, the Mahalaya dawn broadcast: ${BROADCAST.reader} reading the Chandi between Bengali devotional songs and orchestral pieces, first carried by ${BROADCAST.broadcaster} in the 1930s and heard every Mahalaya since. It runs about an hour and a half and plays from the start rather than shuffled.`,
    )}</p>`,
    `<h2>The morning</h2>`,
    `<p>${escape(
      "It is heard at four in the morning, in the dark, and the scene follows the real sky: night full of stars at the start, blue hour through the middle, and the sun cresting the far bank of the river as the reading closes.",
    )}</p>`,
    `<p><a href="${PAGE_PATH.home}">${escape(`More from ${BRAND.nameEn}`)}</a></p>`,
  ];
}
