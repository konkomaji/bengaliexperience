/**
 * GET/POST /api/pageview — a real, durable "N people have visited this
 * page" count for one Tarakeswar page, shown in its footer.
 *
 * Unlike /api/aboard (a live presence count that expires), this is a
 * cumulative counter: every real page load increments a KV value that never
 * expires. It reuses the ABOARD namespace under its own key prefix (`pv:`)
 * rather than a second namespace, so nothing new has to be provisioned to
 * ship this.
 *
 * "Accurate" here means real and unfabricated, not distributed-lock exact:
 * a KV read-then-write can in principle race under simultaneous requests to
 * the same page from different edge locations, the way almost every simple
 * counter built on a key-value store works. At this site's traffic this is
 * a rounding error, not a source of a materially wrong number, and it is
 * the honest tradeoff against standing up Durable Objects for a footer
 * counter. It never invents a number: on any failure it returns `null` and
 * the footer simply doesn't show a count, the same rule /api/aboard follows.
 *
 * Paths are allowlisted against the real Tarakeswar pages and blog posts,
 * so this cannot become an arbitrary KV-key write endpoint for a stranger's
 * URL of choice.
 */
import { PAGE_PATH } from "../../src/data/seo";
import { BLOG_POSTS } from "../../src/data/tarakeswar/blog";

interface Env {
  ABOARD: KVNamespace;
}

const PREFIX = "pv:";

const ALLOWED_PATHS = new Set<string>([
  PAGE_PATH.tarakeswar,
  PAGE_PATH.tarakeswarTemple,
  PAGE_PATH.tarakeswarFood,
  PAGE_PATH.tarakeswarReach,
  PAGE_PATH.tarakeswarBlog,
  ...BLOG_POSTS.map((p) => `${PAGE_PATH.tarakeswarBlog}/${p.slug}`),
]);

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const path = new URL(request.url).searchParams.get("path") ?? "";
  if (!ALLOWED_PATHS.has(path)) return json({ error: "unknown path" }, 400);

  try {
    const raw = await env.ABOARD.get(PREFIX + path);
    const n = raw === null ? 0 : Number(raw);
    return json({ count: Number.isFinite(n) ? n : null });
  } catch {
    return json({ count: null });
  }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let path = "";
  try {
    const body = (await request.json()) as { path?: unknown };
    if (typeof body.path === "string") path = body.path;
  } catch {
    /* malformed body — falls through to the guard below */
  }
  if (!ALLOWED_PATHS.has(path)) return json({ error: "unknown path" }, 400);

  try {
    const key = PREFIX + path;
    const raw = await env.ABOARD.get(key);
    const current = raw === null ? 0 : Number(raw);
    const next = (Number.isFinite(current) ? current : 0) + 1;
    await env.ABOARD.put(key, String(next));
    return json({ count: next });
  } catch {
    // a failed write must not fail the page; the visit just isn't counted
    return json({ count: null });
  }
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
}
