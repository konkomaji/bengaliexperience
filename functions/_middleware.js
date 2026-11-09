// Every URL the retired Bengali Experience site used to serve (the bus, Mahalaya,
// Tarakeswar, Kabir Suman, Uttam Kumar, the Marvel Atlas: ~920 indexed URLs)
// no longer exists. Cloudflare Pages answers those with site/404.html; this
// turns that 404 into a 410 Gone, which tells search engines the removal is
// permanent so they drop the old URLs faster, while people still see the
// sorry page.
export async function onRequest(context) {
  const res = await context.next();
  if (res.status !== 404) return res;

  const headers = new Headers(res.headers);
  headers.set("X-Robots-Tag", "noindex");
  headers.set("Cache-Control", "public, max-age=300");
  return new Response(res.body, { status: 410, statusText: "Gone", headers });
}
