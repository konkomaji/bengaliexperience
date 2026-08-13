import { BRAND, DRIVER } from "../data/brand";
import { EXPERIENCES } from "../data/experiences";
import { PLAYLISTS, TOTAL_TRACKS } from "../data/playlists";
import { SCENE } from "../data/scene";
import { PAGE_FAQ, PAGE_PATH, PAGE_SEO, type PageId } from "../data/seo";

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
const escape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const facts = (lines: string[]) => `<ul>${lines.map((f) => `<li>${escape(f)}</li>`).join("")}</ul>`;

const questions = (qa: { q: string; a: string }[]) =>
  qa.map((f) => `<h3>${escape(f.q)}</h3><p>${escape(f.a)}</p>`).join("");

export function renderStaticBody(pageId: PageId): string {
  const seo = PAGE_SEO[pageId];

  const head = [`<h1>${escape(seo.h1)}</h1>`, `<p>${escape(seo.intro)}</p>`, facts(seo.facts)];

  const body = pageId === "home" ? homeBody() : busBody();

  return [
    ...head,
    ...body,
    `<h2>Questions</h2>${questions(PAGE_FAQ[pageId])}`,
    `<p>${escape(
      `${BRAND.nameEn}. Free, no login. Made by ${DRIVER.name}, independent and fan made.`,
    )}</p>`,
  ].join("");
}

function homeBody(): string[] {
  const items = EXPERIENCES.map((e) => {
    const name = e.path
      ? `<a href="${e.path}">${escape(e.name)}</a>`
      : `${escape(e.name)} (in progress)`;
    return `<li>${name}. ${escape(e.occasion)}. ${escape(e.blurb)}</li>`;
  }).join("");

  return [
    `<h2>The experiences</h2>`,
    `<p>${escape(
      "Each one is a separate page that runs on its own. Open it and the thing is already happening, with nothing to sign up for and nothing to install.",
    )}</p>`,
    `<ul>${items}</ul>`,
  ];
}

function busBody(): string[] {
  const lists = PLAYLISTS.map(
    (p) => `<li>${escape(p.youtubeTitle)}, about ${p.approxTracks} tracks</li>`,
  ).join("");

  return [
    `<h2>The ride</h2>`,
    `<p>${escape(SCENE.tagline)}. ${escape(SCENE.heroAlt)}</p>`,
    `<h2>What plays</h2>`,
    `<p>${escape(
      `${PLAYLISTS.length} curated Bengali playlists, roughly ${TOTAL_TRACKS} tracks in total, streamed from their official YouTube uploads and reshuffled on every visit.`,
    )}</p>`,
    `<ul>${lists}</ul>`,
    `<p><a href="${PAGE_PATH.home}">${escape(
      `More from ${BRAND.nameEn}`,
    )}</a></p>`,
  ];
}
