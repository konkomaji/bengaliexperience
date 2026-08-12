/**
 * GET/POST /api/aboard — the "N aboard right now" counter.
 *
 * Each browser keeps an anonymous random id and checks in every 45s. A
 * check-in writes a KV key with a 90s TTL, so "aboard" is just the count of
 * keys that haven't expired. No cookies, no PII, nothing durable — entries
 * delete themselves.
 *
 * Deliberately approximate: KV list is eventually consistent, which is fine
 * for a vanity counter. If this ever needs to be exact, a Durable Object is
 * the right swap.
 *
 * Requires a KV namespace bound as ABOARD.
 */

interface Env {
  ABOARD: KVNamespace;
}

const TTL_SECONDS = 90;
const PREFIX = "aboard:";

export const onRequestGet: PagesFunction<Env> = async ({ env }) =>
  json({ count: await countAboard(env.ABOARD) });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let id = "";
  try {
    const body = (await request.json()) as { id?: unknown };
    if (typeof body.id === "string") id = body.id.slice(0, 64);
  } catch {
    /* malformed body — treated as missing id below */
  }
  if (!id) return json({ error: "missing id" }, 400);

  await env.ABOARD.put(PREFIX + id, "1", { expirationTtl: TTL_SECONDS });
  return json({ count: await countAboard(env.ABOARD) });
};

async function countAboard(kv: KVNamespace): Promise<number> {
  let total = 0;
  let cursor: string | undefined;
  do {
    const page = await kv.list({ prefix: PREFIX, cursor, limit: 1000 });
    total += page.keys.length;
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  return total;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}
