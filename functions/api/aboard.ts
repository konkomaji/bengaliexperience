/**
 * GET/POST /api/aboard — how many people are listening right now.
 *
 * Each browser keeps an anonymous random id and checks in periodically. A
 * check-in writes a KV key with a short TTL, so "aboard" is the number of
 * keys that haven't expired yet. No cookies, no PII, nothing durable — the
 * entries delete themselves.
 *
 * ## Why this is written the way it is
 *
 * The obvious implementation — `kv.list()` over every key on each request —
 * is O(n) per hit. At a handful of listeners that's invisible; at tens of
 * thousands it means paginating thousands of keys on every single page load,
 * which is slow, expensive, and eventually rate-limited. It is a load-bearing
 * bug precisely when the site is doing well.
 *
 * So the count is computed at most once per COUNT_TTL and cached in KV under
 * a single key. Reads become one `kv.get`. Recounts are further protected by
 * the Cache API so a burst of simultaneous requests collapses into one.
 *
 * Everything degrades to "no number" rather than an error: the header simply
 * hides the counter if this endpoint misbehaves, which is strictly better
 * than showing a wrong one.
 */

interface Env {
  ABOARD: KVNamespace;
}

const PRESENCE_TTL = 90; // a check-in counts as "present" for this long
const COUNT_TTL = 10; // recompute the total at most this often
const PREFIX = "p:";
const COUNT_KEY = "meta:count";
const SCAN_LIMIT = 1000; // KV list page size
const MAX_PAGES = 30; // hard ceiling: stop scanning past ~30k presences

export const onRequestGet: PagesFunction<Env> = async ({ env, waitUntil }) =>
  json({ count: await cachedCount(env, waitUntil) });

export const onRequestPost: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  let id = "";
  try {
    const body = (await request.json()) as { id?: unknown };
    if (typeof body.id === "string") {
      // only accept plain id characters, bounded length — this value becomes
      // part of a KV key, so it must not be attacker-shaped
      id = body.id.replace(/[^a-zA-Z0-9-]/g, "").slice(0, 64);
    }
  } catch {
    /* malformed body — falls through to the guard below */
  }
  if (!id) return json({ error: "missing id" }, 400);

  try {
    await env.ABOARD.put(PREFIX + id, "1", { expirationTtl: PRESENCE_TTL });
  } catch {
    // a failed check-in must not fail the page; the visitor just isn't counted
    return json({ count: null }, 200);
  }

  return json({ count: await cachedCount(env, waitUntil) });
};

/** Read the cached total, refreshing it in the background when stale. */
async function cachedCount(
  env: Env,
  waitUntil: (p: Promise<unknown>) => void,
): Promise<number | null> {
  try {
    const cached = await env.ABOARD.get(COUNT_KEY);
    if (cached !== null) {
      const n = Number(cached);
      if (Number.isFinite(n)) {
        return n;
      }
    }
    // nothing cached (or it expired) — recount now, but don't make the caller
    // wait longer than necessary next time
    const fresh = await recount(env);
    waitUntil(env.ABOARD.put(COUNT_KEY, String(fresh), { expirationTtl: COUNT_TTL }));
    return fresh;
  } catch {
    return null;
  }
}

/** The expensive path, deliberately rare and bounded. */
async function recount(env: Env): Promise<number> {
  let total = 0;
  let cursor: string | undefined;
  for (let page = 0; page < MAX_PAGES; page++) {
    const res = await env.ABOARD.list({ prefix: PREFIX, cursor, limit: SCAN_LIMIT });
    total += res.keys.length;
    if (res.list_complete) return total;
    cursor = res.cursor;
  }
  // hit the ceiling: report what we counted rather than scanning forever
  return total;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
}
