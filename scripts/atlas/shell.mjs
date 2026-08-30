/**
 * The page shell every generated Atlas page is rendered into.
 *
 * The Atlas is a self-contained static app with its own design language
 * (Material 3 Expressive, dark, per-universe accent theming) that has
 * nothing to do with the React site around it. These generated pages are
 * part of *that* app, not of Bengali Experience, so they load the Atlas's
 * own stylesheet and use its own classes, header, nav and footer. A visitor
 * who lands on one from a search result should not be able to tell it was
 * generated rather than hand-written.
 *
 * Everything here is plain string building. There is no framework under the
 * Atlas and adding one to render its static pages would be a build step for
 * a site whose whole point is that it has none.
 */

export const SITE = "https://bengaliexperience.wtf";
export const BASE = "/marvelmultiverseatlas";
export const OG_IMAGE = `${SITE}${BASE}/atlas-og.jpg`;
export const OG_IMAGE_ALT =
  "The Marvel Multiverse Atlas title card: 183 titles, 103 comics, 51 realities and 135 connections, set on a dark starfield.";

/**
 * Google AdSense, shared with the main React site's index.html — one
 * publisher account for the whole domain, so the client id is the same in
 * both places. The Atlas is a fully separate static app with no shared head
 * or bundle, so it needs its own copy of this rather than inheriting it.
 *
 * Consent Mode's default (denied) runs first, before the AdSense loader
 * reads it, same reasoning as the main site's index.html. Every generated
 * page gets both, plus the cookie banner appended near the closing
 * `</body>` below, so this whole app is covered the moment the shell
 * changes and `npm run atlas` regenerates it.
 */
const ADSENSE_CLIENT = "ca-pub-1575101534552294";
const ADSENSE_HEAD = `<script>
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag("consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied", wait_for_update: 500 });
</script>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}" crossorigin="anonymous"></script>`;

/** The cookie banner: vanilla JS, since nothing here runs a framework. Same
 *  behaviour as the React site's ConsentBanner — asks once, calls
 *  gtag('consent','update',...) with the answer, remembers it. Shown on
 *  every Atlas page; unlike the bus and Mahalaya pages on the main site,
 *  nothing in the Atlas is excluded from ads. */
const CONSENT_BANNER = `<div id="bx-consent" style="display:none;position:fixed;inset:auto 0 0 0;z-index:999;background:rgba(13,13,18,.97);border-top:1px solid rgba(255,255,255,.1);padding:14px 16px;font:13px/1.5 system-ui,sans-serif;color:#c7c7d1;backdrop-filter:blur(6px)">
  <div style="max-width:1080px;margin:0 auto;display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between">
    <p style="margin:0;flex:1;min-width:240px">This site uses cookies for ads (Google AdSense) and anonymised usage recording (Microsoft Clarity). See the <a href="${SITE}/privacy" style="color:#ff4a55">privacy policy</a>.</p>
    <div style="display:flex;gap:8px;flex-shrink:0">
      <button id="bx-consent-decline" style="border:1px solid rgba(255,255,255,.15);background:transparent;color:#c7c7d1;border-radius:999px;padding:8px 16px;font:inherit;cursor:pointer">Decline</button>
      <button id="bx-consent-accept" style="border:none;background:#ff4a55;color:#fff;border-radius:999px;padding:8px 16px;font:inherit;font-weight:600;cursor:pointer">Accept</button>
    </div>
  </div>
</div>
<script>(function(){
  var KEY="bx-consent";
  function apply(v){
    if (window.gtag) gtag("consent","update",{ad_storage:v,ad_user_data:v,ad_personalization:v,analytics_storage:v});
    try { localStorage.setItem(KEY, v); } catch(e) {}
  }
  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch(e) {}
  if (stored === "granted" || stored === "denied") { apply(stored); return; }
  var el = document.getElementById("bx-consent");
  if (!el) return;
  el.style.display = "block";
  document.getElementById("bx-consent-accept").onclick = function(){ apply("granted"); el.style.display="none"; };
  document.getElementById("bx-consent-decline").onclick = function(){ apply("denied"); el.style.display="none"; };
})();</script>`;

export const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * A title tag that fits.
 *
 * Google truncates a title around 60-65 characters, and a name cut mid-word is
 * worse than no suffix at all — especially here, where the name is the whole
 * point of the page. So the suffixes are tried longest-first and the first one
 * that fits wins; if even the bare name is over, it is returned whole and
 * allowed to truncate on its own terms rather than be chopped at a fixed
 * offset. The budget is measured after escaping, because `&` becomes `&amp;`
 * and four characters is the difference between fitting and not.
 */
export function fitTitle(name, suffixes = [], max = 62) {
  for (const s of suffixes) {
    const t = `${name} ${s}`;
    if (esc(t).length <= max) return t;
  }
  return name;
}

/**
 * A meta description that fits, cut at a word boundary rather than mid-word.
 * Anything already short enough is returned untouched.
 */
export function clamp(text, max = 155) {
  const t = String(text).replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "") + "…";
}

/** Relative prefix back to the Atlas root, from a page at `path`. */
export function upTo(path) {
  // "/marvelmultiverseatlas/titles/iron-man/" -> two levels below the root
  const rel = path.slice(BASE.length).replace(/^\/|\/$/g, "");
  const depth = rel === "" ? 0 : rel.split("/").length;
  return depth === 0 ? "" : "../".repeat(depth);
}

const FONTS =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&family=Roboto+Flex:opsz,wght@8..144,300..700&family=JetBrains+Mono:wght@400;600&display=swap";

const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='24' fill='%23ff4a55'/%3E%3Ctext x='50' y='72' font-size='64' font-family='sans-serif' font-weight='bold' text-anchor='middle' fill='%23350009'%3EM%3C/text%3E%3C/svg%3E";

/**
 * A BreadcrumbList built from the trail, plus whatever page-specific nodes
 * the caller passes. Emitted as one `@graph` rather than several script tags
 * so the entities can reference each other by `@id` — a crawler reading the
 * Movie node can follow `isPartOf` to the WebPage it sits on.
 */
export function graph({ path, title, description, trail = [], nodes = [] }) {
  const url = SITE + path;
  const crumbs = [{ name: "Marvel Multiverse Atlas", path: BASE + "/" }, ...trail];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE}${BASE}/#website`,
        url: `${SITE}${BASE}/`,
        name: "Marvel Multiverse Atlas",
        alternateName: "The Living Map of Marvel",
        inLanguage: "en",
        publisher: { "@id": `${SITE}/#publisher` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE}/#publisher`,
        name: "Bengali Experience",
        url: SITE + "/",
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        isPartOf: { "@id": `${SITE}${BASE}/#website` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: crumbs.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          item: SITE + c.path,
        })),
      },
      ...nodes,
    ],
  };
}

/** FAQPage node. Only emitted when a page really carries the questions in
 *  its visible markup — structured data that claims content the page does
 *  not show is the one thing Google penalises outright. */
export function faqNode(url, qa) {
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: qa.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** The visible breadcrumb, matching the JSON-LD trail. */
function crumbHtml(path, trail, absolute = false) {
  const up = absolute ? `${BASE}/` : upTo(path);
  const items = [{ name: "Atlas", href: up || "./" }, ...trail.slice(0, -1).map((c) => ({
    name: c.name,
    href: up + c.path.slice(BASE.length + 1),
  }))];
  const last = trail.length ? trail[trail.length - 1].name : null;
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items
    .map((c) => `<li><a href="${esc(c.href)}">${esc(c.name)}</a></li>`)
    .join("")}${last ? `<li aria-current="page">${esc(last)}</li>` : ""}</ol></nav>`;
}

/**
 * @param {object} o
 * @param {string} o.path      absolute path, always with a trailing slash
 * @param {string} o.title     <title> and og:title
 * @param {string} o.description
 * @param {string} [o.theme]   Atlas accent theme id (see the [data-theme] block
 *                             in assets/style.css); defaults to the MCU red
 * @param {Array}  [o.trail]   breadcrumb beyond the Atlas root
 * @param {object} o.jsonLd
 * @param {string} o.body      the page's own markup, inside .wrap
 * @param {boolean} [o.noindex]
 * @param {boolean} [o.absolute] link from the Atlas root instead of relatively.
 *   Only the 404 page sets this: Cloudflare Pages serves it for *any* unmatched
 *   path under the Atlas, so it is rendered at an unknown depth and a relative
 *   `../assets/style.css` would resolve somewhere different every time.
 */
export function page({ path, title, description, theme = "mcu", trail = [], jsonLd, body, noindex = false, absolute = false }) {
  const up = absolute ? `${BASE}/` : upTo(path);
  const canonical = SITE + path;
  // Clamped here rather than at each of the twenty call sites, so no page type
  // can be added later that quietly ships a description Google cuts in half.
  description = clamp(description);

  return `<!DOCTYPE html>
<html lang="en" data-theme="${esc(theme)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${ADSENSE_HEAD}
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#0d0d12">
<link rel="canonical" href="${esc(canonical)}">
${noindex ? '<meta name="robots" content="noindex, follow">\n' : ""}<meta property="og:type" content="website">
<meta property="og:site_name" content="Marvel Multiverse Atlas">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(OG_IMAGE)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(OG_IMAGE_ALT)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(OG_IMAGE)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://image.tmdb.org">
<link href="${FONTS}" rel="stylesheet">
<link rel="stylesheet" href="${up}assets/style.css">
<link rel="stylesheet" href="${up}assets/pages.css">
<link rel="icon" href="${FAVICON}">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body class="atlas-page">

<div class="aurora"></div>
<div class="grain"></div>

<div id="app">
  <header class="topbar">
    <div class="wrap">
      <a class="brand" href="${up || "./"}" style="color:inherit">
        <div class="brand-mark">M</div>
        <div class="brand-txt">
          <b>Marvel Multiverse Atlas</b>
          <span>Cinema · Series · Comics · Timelines</span>
        </div>
      </a>
      <div class="topbar-actions">
        <a class="btn tonal" href="${up || "./"}">
          <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg> Open the atlas
        </a>
      </div>
    </div>
  </header>

  <main class="view active">
    <div class="wrap" style="max-width:1080px">
      ${crumbHtml(path, trail, absolute)}
${body}
      <footer class="site">
        <p style="font-size:.75rem">Poster artwork served from TMDB. Marvel, all title names and all character names are trademarks of Marvel Characters, Inc. and their respective rights holders. This is an unofficial, non-commercial reference project. <a href="${up}credits.html">Full sources &amp; credits →</a></p>
        <p style="margin-top:.6rem;font-size:.75rem">An experiment by <a href="${SITE}">BengaliExperience.wtf</a> · <a href="${SITE}/privacy">Privacy</a></p>
      </footer>
    </div>
  </main>
</div>

${CONSENT_BANNER}
</body>
</html>
`;
}
