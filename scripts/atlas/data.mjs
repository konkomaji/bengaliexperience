/**
 * Loads the Atlas dataset and derives everything the page generator needs.
 *
 * The dataset itself (public/marvelmultiverseatlas/data/marvel-universe.json)
 * is built by the Atlas's own PowerShell/Python pipeline from its hand-authored
 * sources. Nothing here edits it. This module only reads it and works out the
 * relationships the flat table leaves implicit: which titles a comic was
 * adapted into, which titles connect to which, what lives in each reality,
 * and which of those groupings have enough behind them to deserve a page.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const DATA = fileURLToPath(
  new URL("../../public/marvelmultiverseatlas/data/marvel-universe.json", import.meta.url),
);

export const D = JSON.parse(readFileSync(DATA, "utf8"));

export const POSTER = (p, size = "w342") => (p ? `${D.meta.posterBase}${size}${"/"}${p}` : null);

/** kebab-case slug, used for every generated path. */
export const slug = (s) =>
  String(s)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’.]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const byId = new Map(D.entries.map((e) => [e.id, e]));
export const universeById = new Map(D.universes.map((u) => [u.id, u]));

/**
 * Connections, resolved both ways.
 *
 * `edges` is a flat [fromId, toId, kind, note] list, so a title only knows
 * about the connections it happens to be listed first in. A title page has to
 * show every crossing it takes part in, in either direction, so the list is
 * indexed from both ends and the note is kept with each side.
 */
export const connectionsOf = new Map();
for (const [from, to, kind, note] of D.edges) {
  if (!byId.has(from) || !byId.has(to)) continue;
  if (!connectionsOf.has(from)) connectionsOf.set(from, []);
  if (!connectionsOf.has(to)) connectionsOf.set(to, []);
  connectionsOf.get(from).push({ other: to, kind, note, direction: "to" });
  connectionsOf.get(to).push({ other: from, kind, note, direction: "from" });
}

/**
 * Comic -> screen title.
 *
 * `adapts` is a display title, not an id, because the comics table was authored
 * by hand against the screen table's titles, and the two tables spell some of
 * them differently: the screen table carries the legal on-screen names
 * ("Marvel's Jessica Jones", "Dark Phoenix") where the comics table uses what
 * people call them ("Jessica Jones", "X-Men: Dark Phoenix").
 *
 * So a small ladder of candidate forms is tried, most exact first, and a
 * looser form is only accepted when it resolves to exactly one title — a
 * franchise prefix stripped from "X-Men: Dark Phoenix" must not be allowed to
 * match two entries and pick one at random. Anything still unresolved keeps
 * its raw string and renders as plain text: an unlinked true statement beats
 * a linked wrong one, and several of these genuinely have no entry to link
 * because the film has not been released and the Atlas only carries released
 * titles.
 */
const exact = new Map();
const loose = new Map(); // slug -> entry[] , so ambiguity can be detected
for (const e of D.entries) {
  exact.set(e.title, e);
  exact.set(slug(e.title), e);
  const bare = slug(e.title.replace(/^Marvel's\s+/i, ""));
  if (!loose.has(bare)) loose.set(bare, []);
  loose.get(bare).push(e);
}

function resolveAdapts(raw) {
  if (!raw) return null;
  const hit = exact.get(raw) ?? exact.get(slug(raw));
  if (hit) return hit;

  const candidates = [
    slug(raw.replace(/^Marvel's\s+/i, "")),
    // "X-Men: Dark Phoenix" -> "dark-phoenix". Only used when it is unique.
    raw.includes(":") ? slug(raw.slice(raw.indexOf(":") + 1)) : null,
  ].filter(Boolean);

  for (const c of candidates) {
    const matches = loose.get(c);
    if (matches && matches.length === 1) return matches[0];
  }
  return null;
}

// Title and issue number are not unique on their own: Ms. Marvel #1 is both
// Carol Danvers in 1977 and Kamala Khan in 2014, and two comics sharing a slug
// means one page silently overwrites the other. The year disambiguates, but is
// only appended where it has to be, so the common case keeps the clean URL.
const slugCount = new Map();
for (const c of D.comics) {
  const s = slug(`${c.title}-${c.issue}`);
  slugCount.set(s, (slugCount.get(s) ?? 0) + 1);
}

export const comics = D.comics.map((c) => {
  const raw = (c.adapts || "").trim();
  const base = slug(`${c.title}-${c.issue}`);
  return {
    ...c,
    slug: slugCount.get(base) > 1 ? `${base}-${c.year}` : base,
    adaptsRaw: raw,
    adaptsEntry: resolveAdapts(raw),
  };
});

/** Comics grouped under the title they were adapted into, for title pages. */
export const comicsOf = new Map();
for (const c of comics) {
  if (!c.adaptsEntry) continue;
  const list = comicsOf.get(c.adaptsEntry.id) ?? [];
  list.push(c);
  comicsOf.set(c.adaptsEntry.id, list);
}

export const entriesOfUniverse = new Map();
for (const e of D.entries) {
  const list = entriesOfUniverse.get(e.universe) ?? [];
  list.push(e);
  entriesOfUniverse.set(e.universe, list);
}

export const entriesOfSaga = new Map();
for (const e of D.entries) {
  const list = entriesOfSaga.get(e.saga) ?? [];
  list.push(e);
  entriesOfSaga.set(e.saga, list);
}

export const entriesOfPhase = new Map();
for (const e of D.entries) {
  if (!e.phase || e.phase === "—") continue;
  // "Phase Four / Five" straddles two phases and belongs on both lists; a
  // series that ran across a phase boundary really did run across it, and
  // dropping it from either page would leave that page's list wrong. Only
  // the first half carries the word "Phase", so the second is re-prefixed
  // rather than filed under a phase called "Five".
  for (const part of e.phase.split("/").map((s) => s.trim())) {
    const p = part.startsWith("Phase ") ? part : `Phase ${part}`;
    const list = entriesOfPhase.get(p) ?? [];
    list.push(e);
    entriesOfPhase.set(p, list);
  }
}

/* ---------- sort helpers ---------- */

export const byRelease = (a, b) => (a.release ?? "") .localeCompare(b.release ?? "");
export const byChrono = (a, b) => (a.chrono ?? 9999) - (b.chrono ?? 9999);

/* ---------- formatting ---------- */

export const YEAR = (e) => (e.release ? Number(e.release.slice(0, 4)) : e.year ?? null);

export const fmtDate = (iso) => {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  const months = "January February March April May June July August September October November December".split(" ");
  return `${d} ${months[m - 1]} ${y}`;
};

export const fmtMoney = (n) => {
  if (!n) return null;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(n >= 1e10 ? 1 : 2)} billion`;
  if (n >= 1e6) return `$${Math.round(n / 1e6)} million`;
  return `$${n.toLocaleString("en-US")}`;
};

export const fmtRuntime = (mins) => {
  if (!mins) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}h ${String(m).padStart(2, "0")}m` : `${m}m`;
};

/** "film", "series", "one-shot" -> the words used in prose. */
export const TYPE_WORD = {
  film: "film",
  series: "series",
  "one-shot": "Marvel One-Shot",
  short: "short",
  special: "Special Presentation",
  "tv-movie": "television movie",
};

/**
 * The in-universe date, said honestly.
 *
 * This is the Atlas's one genuinely unique claim — no other reference marks
 * which chronological placements Marvel has actually confirmed and which are
 * research consensus — so every page that states one has to say which kind it
 * is, in the sentence, not in a footnote.
 */
export function inUniverse(e) {
  if (!e.inuniv) return null;
  if (e.dateCertainty === "official") return { text: e.inuniv, certain: true };
  if (e.dateCertainty === "inferred") return { text: e.inuniv, certain: false };
  return { text: e.inuniv, certain: null }; // outside the Sacred Timeline
}

/** The streaming line, or an honest absence. */
export function providersOf(e) {
  return e.providers && e.providers.length ? e.providers.map((p) => p.name) : [];
}
