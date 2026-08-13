import { PLAYLISTS, type PlaylistDef } from "../data/playlists";

/**
 * How the bus decides what to play.
 *
 * Plain `Math.random()` shuffle has two problems on a site like this: it
 * ignores that the site is explicitly a *bus in Kolkata*, and it lets
 * the same visitor land on the same opener repeatedly. This does three things
 * instead — all cheap, all client-side, no tracking:
 *
 *  1. **Time-of-day weighting.** Every playlist declares which hours (IST) it
 *     suits. At 2am the mellow lists are far likelier than the party ones; at
 *     6pm it inverts. The bus feels like it knows what time it is, because it
 *     does — the header clock is the same clock.
 *
 *  2. **Recency avoidance.** The last few openers are remembered in
 *     localStorage and heavily penalised, so a returning visitor gets
 *     somewhere new rather than the same list again.
 *
 *  3. **Weighted random, not ranked pick.** The highest-scoring list is the
 *     most likely, never guaranteed. Two people opening the site in the same
 *     minute still get different journeys, which is the whole point.
 *
 * Everything degrades safely: if storage is unavailable or the weights are
 * nonsense, it falls back to a uniform random pick.
 */

const HISTORY_KEY = "be:recentPlaylists";
const HISTORY_LEN = 3;

/**
 * Hours (IST, 0-23) each playlist suits best.
 *
 * Empty while there is one list, because there is nothing to weigh it
 * against. The entries for the nine-playlist version were removed with those
 * playlists rather than left behind pointing at ids the app no longer has:
 * dead config reads as intent and quietly rots. Add an id back here when a
 * second list arrives, and the weighting starts mattering again on its own.
 */
const AFFINITY: Record<string, number[]> = {};

function currentISTHour(): number {
  try {
    const h = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      hour12: false,
    }).format(new Date());
    const n = Number(h);
    return Number.isFinite(n) ? n % 24 : new Date().getHours();
  } catch {
    return new Date().getHours();
  }
}

function readHistory(): string[] {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function pushHistory(id: string) {
  try {
    const next = [id, ...readHistory().filter((x) => x !== id)].slice(0, HISTORY_LEN);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    /* private mode / storage disabled — recency just stops applying */
  }
}

/**
 * Pick the opening playlist. Records the choice so the next visit avoids it.
 */
export function pickOpeningPlaylist(exclude?: ReadonlySet<string>): PlaylistDef {
  const hour = currentISTHour();
  const recent = readHistory();

  // near-empty lists shouldn't open a session — one track then silence looks
  // broken. They stay reachable from the queue chips.
  const pool = PLAYLISTS.filter((p) => p.approxTracks >= 10 && !exclude?.has(p.id));
  const candidates = pool.length ? pool : PLAYLISTS.filter((p) => !exclude?.has(p.id));
  if (!candidates.length) return PLAYLISTS[0];

  const weights = candidates.map((p) => {
    let w = 1;
    if (AFFINITY[p.id]?.includes(hour)) w += 3; // fits the hour
    const recencyIndex = recent.indexOf(p.id);
    if (recencyIndex === 0) w *= 0.15; // played last time
    else if (recencyIndex > 0) w *= 0.45; // played recently
    return Math.max(w, 0.05);
  });

  const chosen = weightedPick(candidates, weights);
  pushHistory(chosen.id);
  return chosen;
}

/**
 * Next playlist once the current one runs out — never repeats the current, and
 * never returns a list the engine has already found unplayable. Returns null
 * when nothing is left to roll to, which is the caller's cue to stop trying.
 */
export function pickFollowUpPlaylist(
  currentId: string,
  exclude?: ReadonlySet<string>,
): PlaylistDef | null {
  const hour = currentISTHour();
  const usable = (p: PlaylistDef) => p.id !== currentId && !exclude?.has(p.id);
  const pool = PLAYLISTS.filter((p) => usable(p) && p.approxTracks >= 10);
  const candidates = pool.length ? pool : PLAYLISTS.filter(usable);
  if (!candidates.length) return null;

  const weights = candidates.map((p) => (AFFINITY[p.id]?.includes(hour) ? 4 : 1));
  const chosen = weightedPick(candidates, weights);
  pushHistory(chosen.id);
  return chosen;
}

function weightedPick<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  if (!Number.isFinite(total) || total <= 0) {
    return items[Math.floor(Math.random() * items.length)];
  }
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}
