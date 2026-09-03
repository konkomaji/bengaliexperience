import { escape, facts } from "../../lib/prerender";
import { PAGE_PATH, type PageId } from "../seo";
import { NATIONAL_AWARDS, BFJA_AWARDS, FILMFARE_AWARDS, POSTHUMOUS_HONORS } from "./awards";
import { BOOKS } from "./books";
import { CENTENARY_EVENTS, CENTENARY_INTRO } from "./centenary";
import { filmDescription } from "./dynamicSeo";
import { ERA_LABEL, FILMS, LANDMARK_FILMS, type Film } from "./films";
import { LIFE_EVENTS } from "./life";
import { COLLABORATORS } from "./people";
import { QUOTES } from "./quotes";
import { SUCHITRA_INTRO, SUCHITRA_RUMOR } from "./suchitra";
import { TOTAL_FILMS } from "./counts.generated";

/**
 * Crawlable body for the nine fixed Uttam Kumar pages, called from
 * src/lib/prerender.ts's renderStaticBody, the same split Kabir Suman and
 * Tarakeswar use. Film pages are not PageIds (211 of them), so
 * functions/_middleware.ts calls renderUttamKumarFilmBody directly by slug.
 */
export function renderUttamKumarBody(pageId: PageId): string[] {
  switch (pageId) {
    case "uttamkumar":
      return hubBody();
    case "uttamkumarLife":
      return lifeBody();
    case "uttamkumarFilms":
      return filmsBody();
    case "uttamkumarSuchitra":
      return suchitraBody();
    case "uttamkumarAwards":
      return awardsBody();
    case "uttamkumarBooks":
      return booksBody();
    case "uttamkumarCentenary":
      return centenaryBody();
    case "uttamkumarWords":
      return wordsBody();
    case "uttamkumarSources":
      return sourcesBody();
    default:
      return [];
  }
}

function hubBody(): string[] {
  const landmarks = LANDMARK_FILMS.filter((f) => f.detail?.acclaimed)
    .map((f) => `<li><a href="/uttamkumar/film/${f.slug}">${escape(f.title)}</a> (${f.year}). ${escape(f.detail!.synopsis)}</li>`)
    .join("");
  return [
    `<h2>The filmography</h2>`,
    `<p>${escape(`${TOTAL_FILMS} credited films, catalogued from Wikipedia's own filmography table.`)}</p>`,
    `<p><a href="${PAGE_PATH.uttamkumarFilms}">All films</a> &middot; <a href="${PAGE_PATH.uttamkumarLife}">The full life</a> &middot; <a href="${PAGE_PATH.uttamkumarSuchitra}">Uttam &amp; Suchitra</a></p>`,
    `<h2>Most acclaimed</h2>`,
    `<ul>${landmarks}</ul>`,
  ];
}

function lifeBody(): string[] {
  const items = LIFE_EVENTS.map(
    (e) =>
      `<li><strong>${e.year}${e.date ? `, ${escape(e.date)}` : ""}</strong>: ${escape(e.headline)}${e.detail ? ` ${escape(e.detail)}` : ""}${e.dispute ? ` <em>${escape(e.dispute)}</em>` : ""}</li>`,
  ).join("");
  return [`<ol>${items}</ol>`];
}

function filmsBody(): string[] {
  const byYear = [...FILMS].sort((a, b) => a.year - b.year || a.order - b.order);
  const items = byYear
    .map((f) => {
      const link = f.detail ? `<a href="/uttamkumar/film/${f.slug}">${escape(f.title)}</a>` : escape(f.title);
      const role = f.role ? `, as ${escape(f.role)}` : "";
      return `<li>${f.year} — ${link}${role}${f.note ? ` (${escape(f.note)})` : ""}</li>`;
    })
    .join("");
  const eras = Object.values(ERA_LABEL)
    .map((v) => `<li>${escape(v)}</li>`)
    .join("");
  return [`<h2>Eras</h2><ul>${eras}</ul>`, `<h2>All ${TOTAL_FILMS} films, chronologically</h2>`, `<ol>${items}</ol>`];
}

function suchitraBody(): string[] {
  const withHer = FILMS.filter((f) => f.detail?.withSuchitra);
  const items = withHer
    .map((f) => `<li><a href="/uttamkumar/film/${f.slug}">${escape(f.title)}</a> (${f.year})</li>`)
    .join("");
  return [
    `<p>${escape(SUCHITRA_INTRO)}</p>`,
    `<h2>Films together, documented on this site</h2>`,
    `<ul>${items}</ul>`,
    `<h2>The rumor</h2>`,
    `<p>${escape(SUCHITRA_RUMOR)}</p>`,
  ];
}

function awardsBody(): string[] {
  const list = (arr: { year: number; award: string; film?: string; note?: string }[]) =>
    arr.map((a) => `<li>${a.year} — ${escape(a.award)}${a.film ? `, ${escape(a.film)}` : ""}${a.note ? ` (${escape(a.note)})` : ""}</li>`).join("");
  const honors = POSTHUMOUS_HONORS.map((h) => `<li>${h.year} — ${escape(h.honor)}: ${escape(h.detail)}</li>`).join("");
  return [
    `<h2>National Film Awards</h2><ul>${list(NATIONAL_AWARDS)}</ul>`,
    `<h2>BFJA Awards</h2><ul>${list(BFJA_AWARDS)}</ul>`,
    `<h2>Filmfare Awards</h2><ul>${list(FILMFARE_AWARDS)}</ul>`,
    `<h2>Posthumous honours</h2><ul>${honors}</ul>`,
  ];
}

function booksBody(): string[] {
  const items = BOOKS.map(
    (b) => `<li>${escape(b.title)}, ${escape(b.author)}, ${b.year}. ${escape(b.note)}</li>`,
  ).join("");
  return [`<ul>${items}</ul>`];
}

function centenaryBody(): string[] {
  const items = CENTENARY_EVENTS.map(
    (e) => `<li><strong>${escape(e.date)}</strong>: ${escape(e.headline)} ${escape(e.detail)} <em>Source: ${escape(e.source)}</em></li>`,
  ).join("");
  return [`<p>${escape(CENTENARY_INTRO)}</p>`, `<ol>${items}</ol>`];
}

function wordsBody(): string[] {
  const items = QUOTES.map((q) => `<li>"${escape(q.en)}" — ${escape(q.speaker)}, ${escape(q.source)}</li>`).join("");
  const collab = COLLABORATORS.map((c) => `<li><strong>${escape(c.name)}</strong> (${escape(c.role)}): ${escape(c.blurb)}</li>`).join("");
  return [`<h2>In their words</h2><ul>${items}</ul>`, `<h2>Collaborators</h2><ul>${collab}</ul>`];
}

function sourcesBody(): string[] {
  return [
    `<p>${escape("The biography and the 211-film catalogue are drawn from and cross-checked against Wikipedia's own articles. The 2026 centenary coverage and book bibliography are drawn from independent press and publisher sources, each listed on this page rather than folded into one vague credit line.")}</p>`,
  ];
}

/** One film, called directly by slug from functions/_middleware.ts. */
export function renderUttamKumarFilmBody(film: Film): string {
  const d = film.detail;
  return [
    `<div id="prerender">`,
    `<h1>${escape(`${film.title} (${film.year})`)}</h1>`,
    `<p>${escape(filmDescription(film))}</p>`,
    facts([
      `Year: ${film.year}`,
      ...(d?.director ? [`Director: ${d.director}`] : []),
      ...(d?.coStars?.length ? [`Co-stars: ${d.coStars.join(", ")}`] : []),
      ...(film.role ? [`Role: ${film.role}`] : []),
      ...(film.note ? [`Note: ${film.note}`] : []),
      ...(d?.significance ? [`Significance: ${d.significance}`] : []),
    ]),
    `<p><a href="${PAGE_PATH.uttamkumarFilms}">All films</a> &middot; <a href="${PAGE_PATH.uttamkumar}">Uttam Kumar</a></p>`,
    `</div>`,
  ].join("");
}
