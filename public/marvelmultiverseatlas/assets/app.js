/* ============================================================
   THE LIVING MAP — application
   Plain script (no modules) so it runs straight off file://
   ============================================================ */
(function () {
'use strict';

var D = window.MARVEL;
var ENTRIES = D.entries;
var EDGES = D.edges;
var UNIVERSES = D.universes;
var COMICS = D.comics || [];
var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

var byId = {}, uniById = {};
ENTRIES.forEach(function (e) { byId[e.id] = e; });
UNIVERSES.forEach(function (u) { uniById[u.id] = u; });

// entries per universe
UNIVERSES.forEach(function (u) { u.entries = []; });
ENTRIES.forEach(function (e) { if (uniById[e.universe]) uniById[e.universe].entries.push(e); });

// adjacency
var adj = {};
EDGES.forEach(function (ed) {
  (adj[ed[0]] = adj[ed[0]] || []).push({ other: ed[1], type: ed[2], note: ed[3], dir: 'out' });
  (adj[ed[1]] = adj[ed[1]] || []).push({ other: ed[0], type: ed[2], note: ed[3], dir: 'in' });
});

/* ---------- helpers ---------- */
function el(sel, root) { return (root || document).querySelector(sel); }
function els(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
function img(path, size) { return path ? D.meta.posterBase + (size || 'w342') + '/' + path : null; }
function fmtDate(iso) {
  if (!iso) return '—';
  var p = iso.split('-'), M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (p.length < 3) return p[0];
  return M[+p[1] - 1] + ' ' + (+p[2]) + ', ' + p[0];
}
function dateLabel(e) {
  return e.platform === 'Unreleased' ? 'Completed ' + e.year + ' · never released' : fmtDate(e.release);
}
function money(n) {
  if (!n) return null;
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2).replace(/\.?0+$/, '') + 'B';
  if (n >= 1e6) return '$' + Math.round(n / 1e6) + 'M';
  return '$' + n.toLocaleString();
}
var TYPE_LABEL = { film: 'Film', series: 'Series', special: 'Special Presentation', 'one-shot': 'Marvel One-Shot', short: 'Short', 'tv-movie': 'TV Movie' };
var TYPE_SHORT = { film: 'Film', series: 'Series', special: 'Special', 'one-shot': 'One-Shot', short: 'Short', 'tv-movie': 'TV Movie' };

/* ---------- platforms ----------
   Brand-coloured wordmark badges rather than trademarked logo artwork:
   accurate, legible, and nothing is being passed off as official. */
function wm(host, file) { return 'https://' + (host === 'c' ? 'commons.wikimedia.org' : 'en.wikipedia.org') + '/wiki/Special:FilePath/' + file; }
// [match, brand colour, deep-search URL, logo file]  — logo URLs are all verified live
var PLATFORMS = [
  ['Disney+',          '#0e6fe8', 'https://www.disneyplus.com/search?q=', wm('e', 'Disney%2B_logo.svg')],
  ['Netflix',          '#e50914', 'https://www.netflix.com/search?q=',    wm('c', 'Netflix_logo.svg')],
  ['Hulu',             '#1ce783', 'https://www.hulu.com/search?q=',       wm('e', 'Hulu_logo.svg')],
  ['Prime Video',      '#00a8e1', 'https://www.amazon.com/s?k=',          wm('c', 'Amazon_Prime_Video_blue_logo_1.svg')],
  ['Theatrical',       '#f0b429', null, null],
  ['Disney XD',        '#1f6fd0', null, wm('c', 'Disney_XD_-_2015.svg')],
  ['Disney Junior',    '#5bb8e8', null, wm('e', 'Disney_Junior_2024.svg')],
  ['Disney Channel',   '#2a5cd7', null, null],
  ['Freeform',         '#f05a8c', null, null],
  ['Spike TV',         '#ff6a00', null, wm('e', 'Spike_TV_logo.svg')],
  ['Cartoon Network',  '#21b7ea', null, wm('c', 'Cartoon_Network_logo.svg')],
  ['Nicktoons',        '#f57d0d', null, null],
  ['MTV',              '#f7e017', null, null],
  ['Kids\' WB',        '#0b53a0', null, null],
  ['Fox Kids',         '#e0353f', null, null],
  ['Syndication',      '#8a8f98', null, null],
  ['Home media',       '#9aa0a6', null, null],
  ['Unreleased',       '#6c6f7a', null, null],
  ['ABC',              '#3f8ed0', null, wm('c', 'American_Broadcasting_Company_Logo.svg')],
  ['CBS',              '#0b3d91', null, wm('c', 'CBS_logo.svg')],
  ['NBC',              '#6c4bb6', null, wm('c', 'NBC_logo.svg')],
  ['UPN',              '#003f7d', null, wm('c', 'UPN_logo.svg')],
  ['FX',               '#e0353f', null, wm('c', 'FX_International_logo.svg')],
  ['Fox',              '#2b3a8c', null, wm('e', 'Fox_Broadcasting_Company_logo_%282019%29.svg')],
  ['Animax',           '#7b3fa0', null, null],
  ['Tokyo MX',         '#d94f8f', null, null],
  ['TX Network',       '#d94f8f', null, null],
  ['Dlife',            '#d94f8f', null, null]
];
function platformInfo(e) {
  var p = e.platform || '';
  for (var i = 0; i < PLATFORMS.length; i++) {
    if (p.indexOf(PLATFORMS[i][0]) >= 0) {
      return { label: p, brand: PLATFORMS[i][0], color: PLATFORMS[i][1], search: PLATFORMS[i][2], logo: PLATFORMS[i][3] };
    }
  }
  return { label: p || 'Unknown', brand: p, color: '#8a8f98', search: null, logo: null };
}
function platformBadge(e) {
  var p = platformInfo(e);
  if (p.logo) {
    var extra = (p.label !== p.brand ? '<em>' + esc(p.label.replace(p.brand, '').replace(/^[\s/]+|[\s/]+$/g, '')) + '</em>' : '');
    // If the wordmark fails to load, fall back to a coloured text badge
    // rather than leaving an empty pill.
    return '<span class="plat has-logo" style="--pc:' + p.color + '">' +
      '<img src="' + p.logo + '" alt="' + esc(p.brand) + '" loading="lazy" decoding="async"' +
      ' onerror="this.parentNode.className=\'plat plat-txt\';this.parentNode.innerHTML=\'<i></i>' + esc(p.label).replace(/'/g, "\\'") + '\'">' +
      extra + '</span>';
  }
  return '<span class="plat" style="--pc:' + p.color + '"><i></i>' + esc(p.label) + '</span>';
}
/* Real "where to watch": the actual US streaming services the title is
   on right now (TMDB / JustWatch provider data), shown as brand badges.
   No generic search buttons — only where it genuinely streams. */
function watchRow(e) {
  if (e.platform === 'Unreleased') {
    return '<div class="watch none">Not yet released — nowhere to stream it yet.</div>';
  }
  var provs = e.providers || [];
  if (!provs.length) {
    return '<div class="watch none">Not on a US streaming subscription right now.</div>';
  }
  var link = e.providerLink || (e.tmdbId
    ? 'https://www.themoviedb.org/' + (e.type === 'series' ? 'tv' : 'movie') + '/' + e.tmdbId + '/watch'
    : 'https://www.justwatch.com/us/search?q=' + encodeURIComponent(e.title));
  return '<div class="watch">' +
    '<div class="watch-h"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg>Streaming now</div>' +
    '<div class="prov-row">' + provs.map(function (p) {
      return '<a class="prov" target="_blank" rel="noopener" href="' + esc(link) + '" title="Watch on ' + esc(p.name) + '">' +
        (p.logo ? '<img src="https://image.tmdb.org/t/p/w92/' + esc(p.logo) + '" alt="" loading="lazy" decoding="async">' : '') +
        '<span>' + esc(p.name) + '</span></a>';
    }).join('') + '</div></div>';
}

/* ---------- lazy images ---------- */
var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (rows) {
  rows.forEach(function (r) {
    if (!r.isIntersecting) return;
    swap(r.target);
    io.unobserve(r.target);
  });
}, { rootMargin: '600px 0px' }) : null;

function hydrate(root) {
  els('img[data-src]', root).forEach(function (i) {
    i.addEventListener('load', function () { i.classList.add('loaded'); });
    // TMDB's CDN drops the odd request under load — retry once at a different
    // size before giving up and showing the typographic fallback.
    i.addEventListener('error', function () {
      var tries = +(i.getAttribute('data-try') || 0);
      if (tries < 2) {
        i.setAttribute('data-try', tries + 1);
        i.removeAttribute('srcset');
        i.src = D.meta.posterBase + (tries === 0 ? 'w185' : 'w342') + '/' + i.getAttribute('data-poster');
        return;
      }
      var fb = i.parentNode.querySelector('.fallback');
      if (fb) fb.style.display = 'grid';
      i.remove();
    });
    if (io) io.observe(i); else { swap(i); }
  });
}
function swap(i) {
  var ss = i.getAttribute('data-srcset');
  if (ss) { i.srcset = ss; i.removeAttribute('data-srcset'); }
  var src = i.getAttribute('data-src');
  if (src) { i.src = src; i.removeAttribute('data-src'); }
}

/* ---------- reveal on scroll ---------- */
var revealIO = ('IntersectionObserver' in window) ? new IntersectionObserver(function (rows) {
  rows.forEach(function (r) { if (r.isIntersecting) { r.target.classList.add('in'); revealIO.unobserve(r.target); } });
}, { rootMargin: '0px 0px -8%' }) : null;
function reveal(nodes) {
  if (!revealIO || REDUCED) { nodes.forEach(function (n) { n.classList.add('in'); }); return; }
  nodes.forEach(function (n, i) { n.classList.add('reveal'); n.style.transitionDelay = Math.min(i, 8) * 35 + 'ms'; revealIO.observe(n); });
}

/* ---------- card ---------- */
function cardHTML(e) {
  // w185 is a near-exact match for the rendered card width; w342 only kicks in
  // on 2x screens. Cuts the grid's image payload by roughly two thirds.
  var small = img(e.poster, 'w185'), big = img(e.poster, 'w342');
  return '<button class="card" data-id="' + esc(e.id) + '" style="--accent-glow:' + hexRGB(e.univColor) + '">' +
    '<span class="uni-dot">' + esc(e.earth) + '</span>' +
    '<span class="poster">' +
      '<span class="fallback" style="display:' + (small ? 'none' : 'grid') + '"><b>' + esc(e.title) + '</b><span>' + e.year + '</span></span>' +
      (small ? '<img alt="' + esc(e.title) + ' poster" data-poster="' + esc(e.poster) + '"' +
        ' data-src="' + small + '" data-srcset="' + small + ' 1x, ' + big + ' 2x"' +
        ' loading="lazy" decoding="async">' : '') +
      '<span class="shine"></span>' +
    '</span>' +
    '<span class="meta"><b>' + esc(e.title) + '</b><span>' + e.year + ' &middot; ' + esc(TYPE_SHORT[e.type] || e.type) + '</span></span>' +
  '</button>';
}
function hexRGB(hex) {
  if (!hex) return '255,74,85';
  var h = hex.replace('#', '');
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)].join(',');
}
function paint(container, list) {
  container.innerHTML = list.map(cardHTML).join('');
  hydrate(container);
  return els('.card', container);
}

/* pointer shine */
document.addEventListener('pointermove', function (ev) {
  if (ev.pointerType === 'touch') return;      // no shine on touch — avoids layout thrash while scrolling
  var c = ev.target.closest ? ev.target.closest('.card') : null;
  if (!c) return;
  var r = c.getBoundingClientRect();
  c.style.setProperty('--mx', (ev.clientX - r.left) + 'px');
  c.style.setProperty('--my', (ev.clientY - r.top) + 'px');
});

/* click → sheet */
document.addEventListener('click', function (ev) {
  var t = ev.target.closest ? ev.target.closest('[data-id]') : null;
  if (t && byId[t.getAttribute('data-id')]) { openSheet(t.getAttribute('data-id')); return; }
  var u = ev.target.closest ? ev.target.closest('[data-uni]') : null;
  if (u) { openUniverse(u.getAttribute('data-uni')); return; }
  var g = ev.target.closest ? ev.target.closest('[data-goto]') : null;
  if (g) { go(g.getAttribute('data-goto')); }
});

/* ============================================================
   DETAIL SHEET
   ============================================================ */
var sheet = el('#sheet'), scrim = el('#scrim'), sheetBody = el('#sheet-body');

function closeSheet() {
  sheet.classList.remove('open'); scrim.classList.remove('open');
  document.body.style.overflow = '';
}
el('#sheet-close').addEventListener('click', closeSheet);
scrim.addEventListener('click', closeSheet);
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });

function kv(label, val) { return val ? '<div><dt>' + esc(label) + '</dt><dd>' + esc(val) + '</dd></div>' : ''; }

function openSheet(id) {
  var e = byId[id]; if (!e) return;
  var u = uniById[e.universe] || {};
  document.documentElement.setAttribute('data-theme', e.theme || 'mcu');

  var big = img(e.poster, 'w500');
  var links = (adj[id] || []).slice().sort(function (a, b) { return a.type.localeCompare(b.type); });

  var h = '';
  h += '<div class="sheet-hero">' +
        (big ? '<div class="bg" style="background-image:url(' + big + ')"></div>' : '') +
        '<div class="art">' +
          '<div class="pos">' + (big ? '<img src="' + big + '" alt="' + esc(e.title) + ' poster">' : '') + '</div>' +
          '<div style="min-width:0">' +
            '<div class="subline" style="color:' + esc(e.univColor) + '">' + esc(e.earth) + '</div>' +
            '<h3>' + esc(e.title) + '</h3>' +
            '<div class="subline">' + (TYPE_LABEL[e.type] || e.type) + ' &middot; ' + dateLabel(e) + '</div>' +
            '<div style="margin-top:.5rem">' + platformBadge(e) + '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

  h += watchRow(e);

  if (e.overview) h += '<p class="t-body" style="margin:.9rem 0 0;color:var(--on-surface)">' + esc(e.overview) + '</p>';

  h += '<dl class="kv">';
  h += kv('Reality', u.name || '—');
  h += kv('Released', dateLabel(e) + (e.end && e.end !== e.release ? ' → ' + fmtDate(e.end) : ''));
  h += kv('Studio', e.studio);
  h += kv('Platform', e.platform);
  h += kv('Saga', e.saga);
  h += kv('Phase', e.phase && e.phase !== '—' ? e.phase : null);
  h += kv('Director / creator', e.director);
  if (e.runtime) h += kv('Runtime', e.runtime + ' min');
  if (e.seasons) h += kv('Seasons', e.seasons + ' · ' + e.episodes + ' episodes');
  if (e.gross) h += kv('Worldwide gross', money(e.gross));
  if (e.budget) h += kv('Budget', money(e.budget));
  if (e.inuniv) h += kv('Story is set in', e.inuniv);
  if (e.dpos != null) h += kv('Chronological slot', '#' + e.dpos);
  h += '</dl>';

  if (e.inuniv && e.dateCertainty !== 'n/a') {
    var official = e.dateCertainty === 'official';
    h += '<div class="note ' + (official ? 'ok' : 'warn') + '">' +
      '<b>' + (official ? 'Marvel-confirmed date' : 'Best estimate — Marvel has never said') + '</b>' +
      '<span>' + (official
        ? 'The year this story takes place is stated on screen or in Marvel’s own published chronology.'
        : 'No year is given on screen and Marvel has published none, so ' + esc(e.inuniv) +
          ' is the consensus reached by press and fan research from the evidence in the story itself. Treat it as an estimate, not canon.') +
      '</span></div>';
  }

  h += '<div style="padding:.85rem 1rem;border-radius:var(--shape-m);background:var(--surface-c);border:1px solid var(--outline-var)">' +
        '<div class="t-label" style="color:' + esc(e.univColor) + '">' + esc(e.earth) + '</div>' +
        '<p class="t-body" style="margin:.35rem 0 0">' + esc(u.blurb || '') + '</p>' +
        (u.alias ? '<p class="t-label" style="margin:.5rem 0 0">' + esc(u.alias) + '</p>' : '') +
      '</div>';

  if (links.length) {
    h += '<div class="sec-t">' + links.length + ' connection' + (links.length > 1 ? 's' : '') + '</div>';
    links.forEach(function (l) {
      var o = byId[l.other];
      var pth = o && o.poster ? img(o.poster, 'w92') : null;
      h += '<button class="conn" data-id="' + esc(l.other) + '">' +
            '<span class="cthumb">' + (pth
              ? '<img src="' + pth + '" alt="" loading="lazy" decoding="async">'
              : '<span class="cthumb-fb">' + esc((o ? o.title : l.other).slice(0, 2)) + '</span>') + '</span>' +
            '<span class="cb">' +
              '<span class="ct">' + esc(l.type.replace(/-/g, ' ')) + '</span>' +
              '<b>' + esc(o ? o.title : l.other) + (o ? ' <span class="cy">' + o.year + '</span>' : '') + '</b>' +
              '<span class="cnote">' + esc(l.note) + '</span>' +
            '</span>' +
          '</button>';
    });
  }

  if (e.tmdbId) {
    h += '<div class="sec-t">Reference</div><a class="btn tonal" target="_blank" rel="noopener" href="https://www.themoviedb.org/' +
      (e.type === 'series' ? 'tv' : 'movie') + '/' + e.tmdbId + '">Open on TMDB</a>';
  }

  sheetBody.innerHTML = h;
  sheetBody.scrollTop = 0;
  sheet.classList.add('open'); scrim.classList.add('open');
}

function openUniverse(uid) {
  var u = uniById[uid]; if (!u) return;
  document.documentElement.setAttribute('data-theme', u.theme || 'mcu');
  var list = u.entries.slice().sort(function (a, b) { return a.release < b.release ? -1 : 1; });
  var h = '<div style="padding:1.4rem 0 .4rem">' +
    '<div class="t-label" style="color:' + esc(u.color) + ';font-size:.72rem">' + esc(u.earth) + '</div>' +
    '<h3 style="font-family:var(--font-display);font-size:1.6rem;letter-spacing:-.03em;margin:.25rem 0 .5rem">' + esc(u.name) + '</h3>' +
    (u.alias ? '<div class="t-label" style="margin-bottom:.5rem">' + esc(u.alias) + '</div>' : '') +
    '<p class="t-body" style="color:var(--on-surface)">' + esc(u.blurb) + '</p></div>';
  if (list.length) {
    h += '<div class="sec-t">' + list.length + ' title' + (list.length > 1 ? 's' : '') + ' set in this reality</div>';
    list.forEach(function (e) {
      h += '<button class="entry" data-id="' + esc(e.id) + '">' +
        '<span class="thumb">' + (e.poster ? '<img loading="lazy" decoding="async" src="' + img(e.poster, 'w154') + '" alt="">' : '') + '</span>' +
        '<span class="body"><b>' + esc(e.title) + '</b><span class="sub">' + dateLabel(e) + ' &middot; ' + esc(TYPE_LABEL[e.type] || e.type) + '</span></span>' +
        '</button>';
    });
  } else {
    h += '<div style="padding:.85rem 1rem;border-radius:var(--shape-m);background:var(--surface-c);border:1px solid var(--outline-var)">' +
      '<p class="t-body" style="margin:0">No title is set here. This reality exists on screen only as somewhere another story reaches into.</p></div>';
  }
  var visits = (u.visitedBy || []).map(function (i) { return byId[i]; }).filter(Boolean);
  if (visits.length) {
    h += '<div class="sec-t">Reached from ' + visits.length + ' title' + (visits.length > 1 ? 's' : '') + '</div>';
    visits.forEach(function (e) {
      h += '<button class="entry" data-id="' + esc(e.id) + '">' +
        '<span class="thumb">' + (e.poster ? '<img loading="lazy" decoding="async" src="' + img(e.poster, 'w154') + '" alt="">' : '') + '</span>' +
        '<span class="body"><b>' + esc(e.title) + '</b><span class="sub">' + esc(e.earth) + ' &middot; ' + e.year + '</span></span>' +
        '</button>';
    });
  }
  sheetBody.innerHTML = h;
  sheetBody.scrollTop = 0;
  sheet.classList.add('open'); scrim.classList.add('open');
}

/* ============================================================
   NAVIGATION
   ============================================================ */
var built = {};
function go(view) {
  els('.view').forEach(function (v) { v.classList.toggle('active', v.id === 'view-' + view); });
  els('[role="tab"]').forEach(function (b) { b.setAttribute('aria-selected', String(b.getAttribute('data-view') === view)); });
  if (!built[view] && BUILD[view]) { BUILD[view](); built[view] = true; }
  window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' });
  // file:// blocks history rewriting in some browsers — never let it break navigation
  try { if (location.hash !== '#' + view) history.replaceState(null, '', '#' + view); } catch (err) {}
}
els('[role="tab"]').forEach(function (b) { b.addEventListener('click', function () { go(b.getAttribute('data-view')); }); });

el('#btn-random').addEventListener('click', function () {
  openSheet(ENTRIES[Math.floor(Math.random() * ENTRIES.length)].id);
});
el('#btn-search').addEventListener('click', function () {
  go('archive'); setTimeout(function () { el('#q').focus(); }, 320);
});

window.addEventListener('scroll', function () {
  el('#topbar').classList.toggle('scrolled', window.scrollY > 8);
}, { passive: true });

/* ============================================================
   VIEW BUILDERS
   ============================================================ */
var BUILD = {};

/* ---------- NEXUS ---------- */
BUILD.nexus = function () {
  var series = ENTRIES.filter(function (e) { return e.type === 'series'; });
  var totalEps = series.reduce(function (a, e) { return a + (e.episodes || 0); }, 0);
  var span = ENTRIES.reduce(function (a, e) { return Math.min(a, e.year); }, 9999);

  el('#hero-count').textContent = ENTRIES.length + ' titles · ' + UNIVERSES.length + ' realities · ' + EDGES.length + ' connections';
  els('[data-goto="archive"]').forEach(function (b) { b.lastChild.textContent = ' Browse all ' + ENTRIES.length + ' titles'; });

  el('#stats').innerHTML = [
    ['<b>' + ENTRIES.length + '</b><span>Titles catalogued</span>'],
    ['<b>' + UNIVERSES.length + '</b><span>Realities mapped</span>'],
    ['<b>' + EDGES.length + '</b><span>Connections traced</span>'],
    ['<b>' + (2026 - span) + '</b><span>Years, ' + span + '–2026</span>']
  ].map(function (s) { return '<div class="stat">' + s[0] + '</div>'; }).join('');

  var top = ENTRIES.slice().sort(function (a, b) { return (b.connections || 0) - (a.connections || 0); }).slice(0, 14);
  reveal(paint(el('#rail-crossovers'), top));

  // hero constellation — the five most-connected titles, drifting
  var art = el('#hero-art');
  art.innerHTML = top.slice(0, 5).map(function (e) {
    return '<div class="pc"><img src="' + img(e.poster, 'w342') + '" alt=""></div>';
  }).join('');
  if (!REDUCED) {
    var hero = el('.hero');
    hero.addEventListener('pointermove', function (ev) {
      var r = hero.getBoundingClientRect();
      var nx = (ev.clientX - r.left) / r.width - 0.5, ny = (ev.clientY - r.top) / r.height - 0.5;
      els('.pc', art).forEach(function (c, i) {
        var depth = (i + 1) * 4;
        c.style.transform = 'translate3d(' + (-nx * depth) + 'px,' + (-ny * depth) + 'px,0) rotate(' +
          [-9, 3, 11, 6, -6][i] + 'deg) rotateY(' + (nx * 9) + 'deg) rotateX(' + (-ny * 6) + 'deg)';
      });
    });
  }

  el('#rail-universes').innerHTML = UNIVERSES.slice()
    .filter(function (u) { return u.entries.length || (u.visitedBy && u.visitedBy.length); })
    .sort(function (a, b) { return b.entries.length - a.entries.length; })
    .map(function (u) {
      var lead = u.entries.slice().sort(function (a, b) { return (b.connections || 0) - (a.connections || 0) || (b.gross || 0) - (a.gross || 0); })[0]
              || byId[(u.visitedBy || [])[0]];
      var src = lead && lead.poster ? img(lead.poster, 'w342') : null;
      var badge = u.entries.length ? u.entries.length + ' title' + (u.entries.length > 1 ? 's' : '') : 'visited only';
      return '<button class="card" data-uni="' + esc(u.id) + '" style="--accent-glow:' + hexRGB(u.color) + '">' +
        '<span class="uni-dot">' + badge + '</span>' +
        '<span class="poster">' +
          '<span class="fallback" style="display:' + (src ? 'none' : 'grid') + '"><b>' + esc(u.name) + '</b><span>' + esc(u.earth) + '</span></span>' +
          (src ? '<img alt="" data-src="' + src + '" loading="lazy" decoding="async" style="filter:saturate(.55) brightness(.62)">' : '') +
          '<span class="shine"></span></span>' +
        '<span class="meta"><b>' + esc(u.name) + '</b><span style="color:' + esc(u.color) + '">' + esc(u.earth) + '</span></span>' +
      '</button>';
    }).join('');
  hydrate(el('#rail-universes'));

  var recent = ENTRIES.slice().sort(function (a, b) { return a.release < b.release ? 1 : -1; }).slice(0, 14);
  reveal(paint(el('#rail-recent'), recent));

  var origins = ENTRIES.filter(function (e) { return e.year < 1999; }).sort(function (a, b) { return a.release < b.release ? -1 : 1; }).slice(0, 14);
  reveal(paint(el('#rail-origins'), origins));
};

/* ---------- TIMELINE ---------- */
var TL_GROUPS = [
  ['all', 'Everything', function () { return true; }],
  ['mcu', 'Marvel Studios', function (e) { return /Marvel Studios/.test(e.studio); }],
  ['tv', 'Marvel Television', function (e) { return e.saga === 'Marvel Television' || e.saga === 'Defenders Saga'; }],
  ['sony', 'Sony / Spider-Man', function (e) { return /Sony|Columbia/.test(e.studio); }],
  ['fox', 'Fox', function (e) { return /Fox/.test(e.studio) || /20th Century/.test(e.studio); }],
  ['anim', 'Animation', function (e) { return /Animation|Anim\./.test(e.studio) || e.saga === 'Marvel Animation'; }],
  ['pre', 'Pre-MCU', function (e) { return e.year < 2008; }]
];
var tlFilter = 'all';

BUILD.timeline = function () {
  el('#tl-filters').innerHTML = TL_GROUPS.map(function (g) {
    var n = ENTRIES.filter(g[2]).length;
    return '<button class="chip" data-tl="' + g[0] + '" aria-pressed="' + (g[0] === tlFilter) + '">' + esc(g[1]) + ' <span class="n">' + n + '</span></button>';
  }).join('');
  el('#tl-filters').addEventListener('click', function (ev) {
    var c = ev.target.closest('[data-tl]'); if (!c) return;
    tlFilter = c.getAttribute('data-tl');
    els('[data-tl]', el('#tl-filters')).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-tl') === tlFilter)); });
    renderTimeline();
  });
  renderTimeline();
};

function renderTimeline() {
  var fn = TL_GROUPS.filter(function (g) { return g[0] === tlFilter; })[0][2];
  var list = ENTRIES.filter(fn).slice().sort(function (a, b) { return a.release < b.release ? 1 : -1; });
  var years = {}, order = [];
  list.forEach(function (e) { if (!years[e.year]) { years[e.year] = []; order.push(e.year); } years[e.year].push(e); });

  el('#tl-body').innerHTML = order.map(function (y) {
    return '<div class="tl-year"><b>' + y + '</b><span class="line"></span><span class="cnt">' + years[y].length + '</span></div>' +
      '<div class="rail" data-year="' + y + '">' + years[y].map(cardHTML).join('') + '</div>';
  }).join('');
  hydrate(el('#tl-body'));
  reveal(els('.tl-year', el('#tl-body')));
}

/* ---------- CHRONICLE ---------- */
var ERAS = [
  [-9999, 0.9, 'Deep Time', 'Before the Age of Heroes'],
  [1, 3.9, 'War & Cold War', '1943 – 1995'],
  [4, 14.9, 'The Age of Iron', '2010 – 2013'],
  [15, 31.9, 'The Fall of S.H.I.E.L.D.', '2014 – 2017'],
  [32, 38.9, 'Infinity & the Blip', '2017 – 2023'],
  [39, 53.9, 'The Multiverse Cracks', '2024 – 2025'],
  [54, 9999, 'A New Age of Heroes', '2026 – 2028']
];
var chrUni = 'mcu';

BUILD.chronicle = function () {
  var opts = UNIVERSES.filter(function (u) { return u.entries.length >= 2; })
    .sort(function (a, b) { return b.entries.length - a.entries.length; });
  el('#chr-filters').innerHTML = opts.map(function (u) {
    return '<button class="chip" data-chr="' + esc(u.id) + '" aria-pressed="' + (u.id === chrUni) + '">' +
      '<i style="background:' + esc(u.color) + '"></i>' + esc(u.name) + ' <span class="n">' + u.entries.length + '</span></button>';
  }).join('');
  el('#chr-filters').addEventListener('click', function (ev) {
    var c = ev.target.closest('[data-chr]'); if (!c) return;
    chrUni = c.getAttribute('data-chr');
    els('[data-chr]', el('#chr-filters')).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-chr') === chrUni)); });
    document.documentElement.setAttribute('data-theme', uniById[chrUni].theme);
    renderChronicle();
  });
  renderChronicle();
};

function renderChronicle() {
  var u = uniById[chrUni];
  var useD = chrUni === 'mcu';
  var list = u.entries.slice().sort(function (a, b) {
    var av = useD ? (a.dpos != null ? a.dpos : a.chrono) : a.chrono;
    var bv = useD ? (b.dpos != null ? b.dpos : b.chrono) : b.chrono;
    return av - bv;
  });

  var est = list.filter(function (e) { return e.dateCertainty === 'inferred'; }).length;
  var html = '<div class="fill" id="chr-fill"></div>';
  html += '<div class="legend-note">' +
    '<span><i class="dot ok"></i>Marvel-confirmed year — stated on screen or in Marvel’s published chronology.</span>' +
    '<span><i class="dot warn"></i><b>≈ estimated setting</b> — Marvel has never given a year for these ' + est +
    '. The date shown is the consensus reached by press and fan research from evidence inside the story. Not canon.</span>' +
    '</div>';
  if (useD) {
    ERAS.forEach(function (era) {
      var items = list.filter(function (e) { return e.dpos != null && e.dpos >= era[0] && e.dpos <= era[1]; });
      if (!items.length) return;
      html += '<div class="era"><div class="era-head"><span>' + esc(era[3]) + '</span><b>' + esc(era[2]) + '</b></div>' +
        items.map(entryRow).join('') + '</div>';
    });
    var unplaced = list.filter(function (e) { return e.dpos == null; });
    if (unplaced.length) {
      html += '<div class="era"><div class="era-head"><span>Not placed on Marvel’s published chronology</span><b>Unslotted</b></div>' +
        unplaced.sort(function (a, b) { return a.chrono - b.chrono; }).map(entryRow).join('') + '</div>';
    }
  } else {
    html += '<div class="era"><div class="era-head"><span>' + esc(u.earth) + '</span><b>' + esc(u.name) + '</b></div>' +
      list.map(entryRow).join('') + '</div>';
  }
  el('#chr-body').innerHTML = html;
  hydrate(el('#chr-body'));
  reveal(els('.entry', el('#chr-body')));
}

function entryRow(e) {
  return '<button class="entry" data-id="' + esc(e.id) + '">' +
    '<span class="thumb">' + (e.poster ? '<img data-src="' + img(e.poster, 'w154') + '" alt="" loading="lazy" decoding="async">' : '') + '</span>' +
    '<span class="body"><b>' + esc(e.title) + '</b>' +
      '<span class="sub">' + esc(e.inuniv || '—') + ' &middot; released ' + dateLabel(e) + '</span>' +
      (e.dateCertainty === 'inferred'
        ? '<span class="tag" title="Marvel has never stated a year for this one. The date shown is the consensus estimate from press and fan research, not canon.">≈ estimated setting</span>'
        : '') +
    '</span></button>';
}

/* scroll-linked spine fill — rAF-throttled so we read layout at most
   once per frame instead of on every scroll event */
(function () {
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var body = el('#chr-body'); if (!body || !el('#view-chronicle').classList.contains('active')) return;
      var fill = el('#chr-fill'); if (!fill) return;
      var r = body.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - r.top) / r.height));
      fill.style.height = (p * r.height) + 'px';
    });
  }, { passive: true });
})();

/* ============================================================
   COMICS — the source material, on the page-timeline
   ============================================================ */
var ERA_ORDER = ['Golden Age', 'Silver Age', 'Bronze Age', 'Copper Age', 'Modern Age'];
var comicsEra = 'all';

BUILD.comics = function () {
  var eras = ERA_ORDER.filter(function (e) { return COMICS.some(function (c) { return c.era === e; }); });
  el('#comics-filters').innerHTML =
    '<button class="chip" data-cera="all" aria-pressed="true">All eras <span class="n">' + COMICS.length + '</span></button>' +
    eras.map(function (e) {
      var n = COMICS.filter(function (c) { return c.era === e; }).length;
      return '<button class="chip" data-cera="' + esc(e) + '" aria-pressed="false">' + esc(e) + ' <span class="n">' + n + '</span></button>';
    }).join('');
  el('#comics-filters').addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-cera]'); if (!b) return;
    comicsEra = b.getAttribute('data-cera');
    els('[data-cera]', el('#comics-filters')).forEach(function (x) { x.setAttribute('aria-pressed', String(x.getAttribute('data-cera') === comicsEra)); });
    renderComics();
  });
  renderComics();
};

var ERA_COLOR = {
  'Golden Age': '#e0a92e', 'Silver Age': '#9fb0c0', 'Bronze Age': '#c1772f',
  'Copper Age': '#b3714e', 'Modern Age': '#e23636'
};

function comicRead(c) {
  var q = encodeURIComponent(c.title + ' ' + String(c.issue || '').replace(/[^0-9A-Za-z –-]/g, ''));
  return '<div class="cx-read">' +
    '<span class="cx-read-lbl">Where to read</span>' +
    '<a class="cx-read-btn primary" target="_blank" rel="noopener" href="https://www.marvel.com/search?query=' + encodeURIComponent(c.title) + '">' +
      '<svg viewBox="0 0 24 24"><path d="M4 5h11a3 3 0 0 1 3 3v11a3 3 0 0 0-3-3H4z"/><path d="M20 5h-1a3 3 0 0 0-3 3v11"/></svg>Marvel Unlimited</a>' +
    '<a class="cx-read-btn" target="_blank" rel="noopener" href="https://www.amazon.com/s?k=' + q + '+marvel+comic">In print</a>' +
  '</div>';
}

function comicCover(c) {
  var col = ERA_COLOR[c.era] || '#e23636';
  var t = String(c.title);
  // Generated era-styled tile — used on its own, or as the fallback that
  // shows if a real ComicVine cover fails to load.
  var tile = '<div class="cx-cover" style="--cc:' + col + '">' +
    '<span class="cx-cover-brand">MARVEL</span>' +
    '<span class="cx-cover-body"><b>' + esc(t) + '</b></span>' +
    '<span class="cx-cover-foot"><span>' + esc(c.issue) + '</span><span>' + c.year + '</span></span>' +
  '</div>';
  if (c.cover) {
    // tile is the always-present base; the real cover overlays on top and
    // simply doesn't obscure it while pending, or self-removes on error.
    return '<div class="cx-cover-wrap">' + tile +
      '<img class="cx-cover-img" src="' + esc(c.cover) + '" alt="' + esc(t) + ' ' + esc(c.issue) + ' cover" loading="lazy" decoding="async"' +
      ' onload="this.classList.add(\'in\')" onerror="this.remove()"></div>';
  }
  return tile;
}

function renderComics() {
  var titleToId = {};
  ENTRIES.forEach(function (e) { titleToId[e.title.toLowerCase()] = e.id; });
  var list = COMICS.slice().sort(function (a, b) { return a.released < b.released ? -1 : a.released > b.released ? 1 : 0; });
  if (comicsEra !== 'all') list = list.filter(function (c) { return c.era === comicsEra; });

  var html = '', lastEra = null;
  list.forEach(function (c) {
    if (c.era !== lastEra) {
      if (lastEra !== null) html += '</div>';
      html += '<div class="cx-era"><span class="cx-era-label">' + esc(c.era) + '</span><span class="cx-era-line"></span></div><div class="cx-list">';
      lastEra = c.era;
    }
    var aid = c.adapts ? titleToId[String(c.adapts).toLowerCase()] : null;
    var adaptsChip = c.adapts
      ? (aid
        ? '<button class="cx-adapts" data-id="' + esc(aid) + '"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg>On screen · ' + esc(c.adapts) + '</button>'
        : '<span class="cx-adapts static">basis for ' + esc(c.adapts) + '</span>')
      : '';
    html += '<article class="cx">' +
      comicCover(c) +
      '<div class="cx-main">' +
        '<div class="cx-issue-line"><b>' + esc(c.issue) + '</b> &middot; ' + esc(c.era) + '</div>' +
        '<h3>' + esc(c.title) + '</h3>' +
        '<div class="cx-cred">' + esc(c.writer) + (c.artist ? ' &middot; art by ' + esc(c.artist) : '') + '</div>' +
        '<p class="cx-sig">' + esc(c.significance) + '</p>' +
        (c.characters ? '<div class="cx-chars">' + esc(c.characters) + '</div>' : '') +
        adaptsChip +
        comicRead(c) +
      '</div>' +
    '</article>';
  });
  if (lastEra !== null) html += '</div>';
  el('#comics-body').innerHTML = html;
}

/* ============================================================
   MULTIVERSE MAP
   ============================================================ */
var W = 1200, H = 820;
var mapState = { x: 0, y: 0, k: 1, sel: null, nodes: [], links: [] };

function buildGraph() {
  var nodes = UNIVERSES.filter(function (u) { return u.entries.length > 0 || (u.visitedBy && u.visitedBy.length); }).map(function (u, i) {
    var n = u.entries.length;
    return {
      id: u.id, u: u, n: n, visitOnly: n === 0,
      r: n ? Math.min(31, 8.5 + Math.sqrt(n) * 5.2) : 6.5,
      x: W / 2 + Math.cos(i * 2.39996) * (90 + i * 11),
      y: H / 2 + Math.sin(i * 2.39996) * (90 + i * 11),
      vx: 0, vy: 0
    };
  });
  var idx = {}; nodes.forEach(function (n) { idx[n.id] = n; });

  var pair = {};
  function add(ua, ub, ed) {
    if (!ua || !ub || ua === ub) return;
    var k = ua < ub ? ua + '|' + ub : ub + '|' + ua;
    if (!pair[k]) pair[k] = { a: ua, b: ub, w: 0, notes: [] };
    pair[k].w++;
    pair[k].notes.push(ed);
  }
  EDGES.forEach(function (ed) {
    var a = byId[ed[0]], b = byId[ed[1]];
    if (!a || !b) return;
    add(a.universe, b.universe, ed);
  });
  // realities that appear on screen but headline nothing of their own
  UNIVERSES.forEach(function (u) {
    (u.visitedBy || []).forEach(function (tid) {
      var t = byId[tid]; if (!t) return;
      add(u.id, t.universe, [tid, u.id, 'crossover', t.title + ' visits ' + u.earth + ' — ' + u.name + '.']);
    });
  });
  var links = Object.keys(pair).map(function (k) {
    var p = pair[k];
    return { source: idx[p.a], target: idx[p.b], w: p.w, notes: p.notes };
  }).filter(function (l) { return l.source && l.target; });

  // --- split: the connected web vs. the standalone realities ---
  var linked = {};
  links.forEach(function (l) { linked[l.source.id] = 1; linked[l.target.id] = 1; });
  var web = nodes.filter(function (n) { return linked[n.id]; });
  var alone = nodes.filter(function (n) { return !linked[n.id]; })
    .sort(function (a, b) { return b.n - a.n; });

  // --- force layout over the connected web only ---
  var K = 152;
  for (var it = 0; it < 820; it++) {
    var cool = 1 - it / 820;
    for (var i = 0; i < web.length; i++) {
      var a = web[i];
      for (var j = i + 1; j < web.length; j++) {
        var b = web[j];
        var dx = a.x - b.x, dy = a.y - b.y;
        var d2 = dx * dx + dy * dy; if (d2 < 1) { d2 = 1; dx = (i - j) || 1; dy = 1; }
        var d = Math.sqrt(d2);
        // size-aware repulsion: big nodes need room for their labels
        var f = (K * K) / d2 * 0.9 * (1 + (a.r + b.r) / 46);
        var ux = dx / d, uy = dy / d;
        a.vx += ux * f; a.vy += uy * f;
        b.vx -= ux * f; b.vy -= uy * f;
      }
    }
    links.forEach(function (l) {
      var dx = l.target.x - l.source.x, dy = l.target.y - l.source.y;
      var d = Math.sqrt(dx * dx + dy * dy) || 1;
      var f = (d * d) / K / 26 * Math.min(3, l.w);
      var ux = dx / d, uy = dy / d;
      l.source.vx += ux * f; l.source.vy += uy * f;
      l.target.vx -= ux * f; l.target.vy -= uy * f;
    });
    web.forEach(function (n) {
      n.vx += (W / 2 - n.x) * 0.012 * (1 + n.n * 0.02);
      n.vy += (H / 2 - n.y) * 0.012 * (1 + n.n * 0.02);
      var sp = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
      var max = 26 * cool + 1;
      if (sp > max) { n.vx = n.vx / sp * max; n.vy = n.vy / sp * max; }
      n.x += n.vx; n.y += n.vy;
      n.vx *= 0.55; n.vy *= 0.55;
    });
  }

  // fit the web into a centred inner box
  var minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
  web.forEach(function (n) { minX = Math.min(minX, n.x); maxX = Math.max(maxX, n.x); minY = Math.min(minY, n.y); maxY = Math.max(maxY, n.y); });
  var boxW = W * 0.70, boxH = H * 0.66;
  var s = Math.min(boxW / Math.max(1, maxX - minX), boxH / Math.max(1, maxY - minY));
  var cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  web.forEach(function (n) {
    n.x = W / 2 + (n.x - cx) * s;
    n.y = H / 2 + (n.y - cy) * s;
  });

  // standalone realities ride an outer belt
  var rx = W * 0.452, ry = H * 0.445;
  alone.forEach(function (n, i) {
    var t = (i / alone.length) * Math.PI * 2 - Math.PI / 2;
    n.x = W / 2 + Math.cos(t) * rx;
    n.y = H / 2 + Math.sin(t) * ry;
    n.orbit = true;
  });

  mapState.nodes = nodes; mapState.links = links; mapState.belt = { rx: rx, ry: ry };
}

function svgEl(tag, attrs) {
  var n = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (var k in attrs) n.setAttribute(k, attrs[k]);
  return n;
}

BUILD.multiverse = function () {
  buildGraph();
  var svg = el('#map-svg');
  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  svg.innerHTML = '';

  var defs = svgEl('defs');
  mapState.nodes.forEach(function (n) {
    var g = svgEl('radialGradient', { id: 'g-' + n.id });
    g.appendChild(svgEl('stop', { offset: '0%', 'stop-color': n.u.color, 'stop-opacity': '0.95' }));
    g.appendChild(svgEl('stop', { offset: '70%', 'stop-color': n.u.color, 'stop-opacity': '0.30' }));
    g.appendChild(svgEl('stop', { offset: '100%', 'stop-color': n.u.color, 'stop-opacity': '0' }));
    defs.appendChild(g);
  });
  // cinematic nebula gradients + a soft glow filter
  var NEB = [
    { x: W * 0.26, y: H * 0.32, r: 470, c: '255,74,85' },
    { x: W * 0.76, y: H * 0.26, r: 410, c: '124,215,255' },
    { x: W * 0.62, y: H * 0.76, r: 500, c: '167,139,250' },
    { x: W * 0.36, y: H * 0.66, r: 360, c: '94,230,168' }
  ];
  NEB.forEach(function (nb, i) {
    var g = svgEl('radialGradient', { id: 'neb-' + i });
    g.appendChild(svgEl('stop', { offset: '0%', 'stop-color': 'rgb(' + nb.c + ')', 'stop-opacity': '0.22' }));
    g.appendChild(svgEl('stop', { offset: '100%', 'stop-color': 'rgb(' + nb.c + ')', 'stop-opacity': '0' }));
    defs.appendChild(g);
  });
  var glow = svgEl('filter', { id: 'node-glow', x: '-60%', y: '-60%', width: '220%', height: '220%' });
  glow.appendChild(svgEl('feGaussianBlur', { stdDeviation: '3.4' }));
  defs.appendChild(glow);
  svg.appendChild(defs);

  // ---- cinematic backdrop: nebula clouds + a deterministic starfield ----
  function mrnd(n) { var x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  var bg = svgEl('g', { class: 'map-bg', 'aria-hidden': 'true' });
  NEB.forEach(function (nb, i) {
    bg.appendChild(svgEl('ellipse', {
      class: 'neb', cx: nb.x, cy: nb.y, rx: nb.r, ry: nb.r * 0.82,
      fill: 'url(#neb-' + i + ')', style: 'animation-delay:' + (i * -6) + 's'
    }));
  });
  var stars = svgEl('g', { class: 'stars' });
  for (var si = 0; si < 150; si++) {
    var sx = mrnd(si) * W, sy = mrnd(si * 1.7 + 5) * H;
    var sr = 0.4 + mrnd(si * 2.3) * 1.4, so = 0.12 + mrnd(si * 3.1) * 0.55;
    var st = svgEl('circle', { cx: sx.toFixed(1), cy: sy.toFixed(1), r: sr.toFixed(2), fill: '#ffffff', opacity: so.toFixed(2) });
    if (si % 5 === 0) { st.setAttribute('class', 'twinkle'); st.setAttribute('style', 'animation-delay:' + (mrnd(si * 5.5) * 4).toFixed(2) + 's'); }
    stars.appendChild(st);
  }
  bg.appendChild(stars);
  svg.appendChild(bg);

  var root = svgEl('g', { id: 'map-root' });
  var gBelt = svgEl('g'), gLinks = svgEl('g'), gNodes = svgEl('g');
  root.appendChild(gBelt); root.appendChild(gLinks); root.appendChild(gNodes);
  svg.appendChild(root);

  // the belt of unconnected realities
  gBelt.appendChild(svgEl('ellipse', {
    cx: W / 2, cy: H / 2, rx: mapState.belt.rx, ry: mapState.belt.ry,
    fill: 'none', stroke: 'currentColor', 'stroke-width': '1',
    'stroke-dasharray': '2 9', opacity: '0.18'
  }));
  var beltLabel = svgEl('text', { class: 'node-label', x: W / 2, y: H / 2 - mapState.belt.ry - 14, opacity: '0.5' });
  beltLabel.textContent = 'Standalone realities — no crossing on record';
  gBelt.appendChild(beltLabel);

  mapState.links.forEach(function (l) {
    var mx = (l.source.x + l.target.x) / 2, my = (l.source.y + l.target.y) / 2;
    var dx = l.target.x - l.source.x, dy = l.target.y - l.source.y;
    var cx = mx - dy * 0.13, cy = my + dx * 0.13;
    var p = svgEl('path', {
      class: 'edge',
      d: 'M' + l.source.x + ',' + l.source.y + ' Q' + cx + ',' + cy + ' ' + l.target.x + ',' + l.target.y,
      stroke: l.source.u.color,
      'stroke-width': Math.min(4.5, 0.9 + l.w * 0.55)
    });
    p.dataset.a = l.source.id; p.dataset.b = l.target.id;
    gLinks.appendChild(p);
    // energy pulse travelling along the crossing — the "timeline" streams
    var flow = svgEl('path', {
      class: 'edge-flow',
      d: 'M' + l.source.x + ',' + l.source.y + ' Q' + cx + ',' + cy + ' ' + l.target.x + ',' + l.target.y,
      stroke: l.target.u.color,
      style: 'animation-duration:' + (3.2 + (l.w % 3)) + 's;animation-delay:' + ((l.source.x % 7) * -0.4).toFixed(2) + 's'
    });
    flow.dataset.a = l.source.id; flow.dataset.b = l.target.id;
    gLinks.appendChild(flow);
  });

  mapState.nodes.forEach(function (n) {
    var g = svgEl('g', { class: 'node-hit', tabindex: '0', role: 'button' });
    g.setAttribute('aria-label', n.u.name + ', ' + n.u.earth + ', ' + n.n + ' titles');
    g.dataset.node = n.id;

    var halo = svgEl('circle', { class: 'node-halo', cx: n.x, cy: n.y, r: n.r * 1.9, fill: 'url(#g-' + n.id + ')', opacity: n.visitOnly ? '0.3' : '0.4' });
    halo.setAttribute('style', 'animation-delay:' + ((n.x + n.y) % 40 / 10 * -1).toFixed(2) + 's');
    g.appendChild(halo);

    // satellites: one dot per title
    var sat = svgEl('g', { class: 'sat' });
    n.u.entries.forEach(function (e, i) {
      var a = i * 2.39996, rr = n.r + 7 + (i % 3) * 4.5;
      sat.appendChild(svgEl('circle', {
        cx: n.x + Math.cos(a) * rr, cy: n.y + Math.sin(a) * rr,
        r: 1.7, fill: n.u.color, opacity: '0.75'
      }));
    });
    g.appendChild(sat);

    g.appendChild(svgEl('circle', {
      class: 'node-ring', cx: n.x, cy: n.y, r: n.r + 6, stroke: n.u.color,
      'stroke-dasharray': n.visitOnly ? '3 4' : 'none'
    }));
    g.appendChild(svgEl('circle', {
      class: 'node-core', cx: n.x, cy: n.y, r: n.r, fill: n.u.color,
      'fill-opacity': n.visitOnly ? '0.35' : '0.9', stroke: '#0d0d12', 'stroke-width': '1.5'
    }));

    // crowded centre: names only for the substantial realities, the rest reveal on hover
    var quiet = !n.orbit && n.n < 4;
    var t1 = svgEl('text', { class: 'node-title' + (quiet ? ' quiet' : ''), x: n.x, y: n.y + n.r + (quiet ? 33 : 21) });
    if (n.visitOnly) t1.setAttribute('font-size', '10');
    t1.textContent = n.u.name.length > 26 ? n.u.name.slice(0, 25) + '…' : n.u.name;
    var t2 = svgEl('text', { class: 'node-label', x: n.x, y: n.y + n.r + (quiet ? 21 : 34) });
    t2.textContent = n.u.earth;
    g.appendChild(t1); g.appendChild(t2);

    gNodes.appendChild(g);
  });

  // legend
  el('#map-legend').innerHTML = mapState.nodes.slice().sort(function (a, b) { return b.n - a.n; }).slice(0, 12)
    .map(function (n) { return '<button class="chip" data-uni="' + esc(n.id) + '"><i style="background:' + esc(n.u.color) + '"></i>' + esc(n.u.name) + ' <span class="n">' + n.n + '</span></button>'; }).join('');

  // filters
  el('#map-filters').innerHTML =
    '<button class="chip" data-mapf="all" aria-pressed="true">All connections <span class="n">' + mapState.links.length + '</span></button>' +
    ['crossover', 'continuation', 'recast-return', 'variant', 'cameo', 'tie-in', 'post-credits-setup'].map(function (t) {
      var n = EDGES.filter(function (e) { return e[2] === t; }).length;
      return '<button class="chip" data-mapf="' + t + '" aria-pressed="false">' + esc(t.replace(/-/g, ' ')) + ' <span class="n">' + n + '</span></button>';
    }).join('');
  el('#map-filters').addEventListener('click', function (ev) {
    var c = ev.target.closest('[data-mapf]'); if (!c) return;
    var f = c.getAttribute('data-mapf');
    els('[data-mapf]', el('#map-filters')).forEach(function (b) { b.setAttribute('aria-pressed', String(b === c)); });
    els('.edge, .edge-flow', svg).forEach(function (p) {
      if (f === 'all') { p.classList.remove('dim', 'hot'); return; }
      var l = mapState.links.filter(function (L) { return L.source.id === p.dataset.a && L.target.id === p.dataset.b; })[0];
      var has = l && l.notes.some(function (nn) { return nn[2] === f; });
      p.classList.toggle('dim', !has);
      p.classList.toggle('hot', !!has);
    });
  });

  // node interactions
  gNodes.addEventListener('click', function (ev) {
    var g = ev.target.closest('[data-node]'); if (!g) return;
    selectNode(g.dataset.node);
  });
  gNodes.addEventListener('mouseover', function (ev) {
    var g = ev.target.closest('[data-node]'); if (!g) return;
    highlight(g.dataset.node);
  });
  gNodes.addEventListener('mouseout', function () { if (!mapState.sel) highlight(null); });
  gNodes.addEventListener('keydown', function (ev) {
    var g = ev.target.closest('[data-node]'); if (!g) return;
    if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); selectNode(g.dataset.node); }
  });

  function highlight(id) {
    els('.edge, .edge-flow', svg).forEach(function (p) {
      if (!id) { p.classList.remove('hot', 'dim'); return; }
      var on = p.dataset.a === id || p.dataset.b === id;
      p.classList.toggle('hot', on); p.classList.toggle('dim', !on);
    });
    els('.sat', svg).forEach(function (s) { s.style.opacity = id ? (s.parentNode.dataset.node === id ? 1 : 0.18) : 1; });
    els('[data-node]', svg).forEach(function (g) { g.classList.toggle('on', !!id && g.dataset.node === id); });
  }
  function selectNode(id) {
    mapState.sel = mapState.sel === id ? null : id;
    highlight(mapState.sel);
    var u = uniById[id];
    el('#map-hint').textContent = mapState.sel ? u.earth + ' · ' + u.entries.length + ' titles isolated' : 'Drag to pan · scroll to zoom · tap a reality';
    if (mapState.sel) { document.documentElement.setAttribute('data-theme', u.theme); openUniverse(id); }
  }

  /* pan / zoom */
  function apply() {
    root.setAttribute('transform', 'translate(' + mapState.x + ',' + mapState.y + ') scale(' + mapState.k + ')');
  }
  var drag = null;
  svg.addEventListener('pointerdown', function (e) {
    if (e.target.closest('[data-node]')) return;
    drag = { x: e.clientX, y: e.clientY, ox: mapState.x, oy: mapState.y };
    svg.classList.add('dragging'); svg.setPointerCapture(e.pointerId);
  });
  svg.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var r = svg.getBoundingClientRect(), sc = W / r.width;
    mapState.x = drag.ox + (e.clientX - drag.x) * sc;
    mapState.y = drag.oy + (e.clientY - drag.y) * sc;
    apply();
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (t) {
    svg.addEventListener(t, function () { drag = null; svg.classList.remove('dragging'); });
  });
  svg.addEventListener('wheel', function (e) {
    e.preventDefault();
    zoomAt(e.deltaY < 0 ? 1.14 : 1 / 1.14, e.clientX, e.clientY);
  }, { passive: false });

  function zoomAt(f, cx, cy) {
    var r = svg.getBoundingClientRect(), sc = W / r.width;
    var px = (cx == null ? r.left + r.width / 2 : cx);
    var py = (cy == null ? r.top + r.height / 2 : cy);
    var mx = (px - r.left) * sc, my = (py - r.top) * sc;
    var nk = Math.max(0.45, Math.min(5, mapState.k * f));
    mapState.x = mx - (mx - mapState.x) * (nk / mapState.k);
    mapState.y = my - (my - mapState.y) * (nk / mapState.k);
    mapState.k = nk; apply();
  }
  // On a phone the whole graph shrinks past legibility — open zoomed into the
  // Sacred Timeline instead and let the reader pan out from there.
  function home() {
    var r = svg.getBoundingClientRect();
    var narrow = r.width < 620;
    mapState.k = narrow ? 3.1 : 1;
    var focus = mapState.nodes.filter(function (n) { return n.id === 'mcu'; })[0] || mapState.nodes[0];
    if (narrow && focus) {
      mapState.x = W / 2 - focus.x * mapState.k;
      mapState.y = H / 2 - focus.y * mapState.k;
    } else { mapState.x = 0; mapState.y = 0; }
    apply();
    el('#map-hint').textContent = narrow
      ? 'Drag to explore · pinch to zoom out'
      : 'Drag to pan · scroll to zoom · tap a reality';
  }
  el('#map-zin').addEventListener('click', function () { zoomAt(1.28); });
  el('#map-zout').addEventListener('click', function () { zoomAt(1 / 1.28); });
  el('#map-reset').addEventListener('click', function () {
    mapState.sel = null; highlight(null); home();
  });

  // pinch
  var pts = {};
  svg.addEventListener('pointerdown', function (e) { pts[e.pointerId] = e; });
  svg.addEventListener('pointermove', function (e) {
    if (!(e.pointerId in pts)) return;
    pts[e.pointerId] = e;
    var k = Object.keys(pts);
    if (k.length === 2) {
      drag = null;
      var a = pts[k[0]], b = pts[k[1]];
      var d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      if (svg._pd) zoomAt(d / svg._pd, (a.clientX + b.clientX) / 2, (a.clientY + b.clientY) / 2);
      svg._pd = d;
    }
  });
  ['pointerup', 'pointercancel'].forEach(function (t) {
    svg.addEventListener(t, function (e) { delete pts[e.pointerId]; svg._pd = null; });
  });
  home();
};

/* ============================================================
   ARCHIVE
   ============================================================ */
var arState = { q: '', type: 'all', saga: 'all', sort: 'release-desc' };

BUILD.archive = function () {
  var types = ['all'].concat(Object.keys(ENTRIES.reduce(function (a, e) { a[e.type] = 1; return a; }, {})));
  el('#ar-type').innerHTML = types.map(function (t) {
    var n = t === 'all' ? ENTRIES.length : ENTRIES.filter(function (e) { return e.type === t; }).length;
    return '<button class="chip" data-art="' + t + '" aria-pressed="' + (t === 'all') + '">' + esc(t === 'all' ? 'All formats' : (TYPE_LABEL[t] || t)) + ' <span class="n">' + n + '</span></button>';
  }).join('');

  var sagas = ['all'].concat(Object.keys(ENTRIES.reduce(function (a, e) { a[e.saga] = 1; return a; }, {})).sort());
  el('#ar-saga').innerHTML = sagas.map(function (s) {
    var n = s === 'all' ? ENTRIES.length : ENTRIES.filter(function (e) { return e.saga === s; }).length;
    return '<button class="chip" data-ars="' + esc(s) + '" aria-pressed="' + (s === 'all') + '">' + esc(s === 'all' ? 'All sagas' : s) + ' <span class="n">' + n + '</span></button>';
  }).join('');

  el('#ar-type').addEventListener('click', function (ev) {
    var c = ev.target.closest('[data-art]'); if (!c) return;
    arState.type = c.getAttribute('data-art');
    els('[data-art]', el('#ar-type')).forEach(function (b) { b.setAttribute('aria-pressed', String(b === c)); });
    renderArchive();
  });
  el('#ar-saga').addEventListener('click', function (ev) {
    var c = ev.target.closest('[data-ars]'); if (!c) return;
    arState.saga = c.getAttribute('data-ars');
    els('[data-ars]', el('#ar-saga')).forEach(function (b) { b.setAttribute('aria-pressed', String(b === c)); });
    renderArchive();
  });
  var t;
  el('#q').addEventListener('input', function (e) {
    clearTimeout(t); t = setTimeout(function () { arState.q = e.target.value.trim().toLowerCase(); renderArchive(); }, 130);
  });
  el('#ar-sort').addEventListener('change', function (e) { arState.sort = e.target.value; renderArchive(); });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (rows) {
      if (rows[0].isIntersecting) arMore();
    }, { rootMargin: '900px 0px' }).observe(el('#ar-more'));
  } else {
    window.addEventListener('scroll', function () {
      var r = el('#ar-more').getBoundingClientRect();
      if (r.top < window.innerHeight + 900) arMore();
    }, { passive: true });
  }

  renderArchive();
};

function renderArchive() {
  var q = arState.q;
  var list = ENTRIES.filter(function (e) {
    if (arState.type !== 'all' && e.type !== arState.type) return false;
    if (arState.saga !== 'all' && e.saga !== arState.saga) return false;
    if (!q) return true;
    return (e.title + ' ' + e.studio + ' ' + e.director + ' ' + e.earth + ' ' + e.univName + ' ' + e.saga + ' ' + (e.platform || '') + ' ' + e.year + ' ' + (e.overview || '')).toLowerCase().indexOf(q) >= 0;
  });

  var S = arState.sort;
  list.sort(function (a, b) {
    if (S === 'title') return a.title.localeCompare(b.title);
    if (S === 'gross') return (b.gross || 0) - (a.gross || 0);
    if (S === 'conn') return (b.connections || 0) - (a.connections || 0);
    if (S === 'release-asc') return a.release < b.release ? -1 : 1;
    return a.release < b.release ? 1 : -1;
  });

  el('#ar-count').textContent = list.length + ' of ' + ENTRIES.length + ' titles';
  el('#ar-empty').style.display = list.length ? 'none' : 'block';

  // Page the grid instead of mounting 183 cards (and 183 image requests) at once.
  arQueue = list; arShown = 0;
  el('#ar-grid').innerHTML = '';
  arMore();
}

var arQueue = [], arShown = 0, AR_PAGE = 40;
function arMore() {
  if (arShown >= arQueue.length) { el('#ar-more').style.display = 'none'; return; }
  var slice = arQueue.slice(arShown, arShown + AR_PAGE);
  var frag = document.createElement('div');
  frag.innerHTML = slice.map(cardHTML).join('');
  var added = Array.prototype.slice.call(frag.children);
  added.forEach(function (c) { el('#ar-grid').appendChild(c); });
  hydrate(el('#ar-grid'));
  reveal(added);
  arShown += slice.length;
  el('#ar-more').style.display = arShown < arQueue.length ? 'block' : 'none';
}

/* ============================================================
   THE LIVING TIMELINE
   A branching, growing, self-pruning tree behind the whole site —
   the Sacred Timeline as Loki leaves it: a trunk that keeps splitting,
   branches that get pruned and grow back, energy running along the limbs.
   One canvas, ~200 segments, capped at 30fps.
   ============================================================ */
(function () {
  if (REDUCED) return;
  var c = el('#fx-canvas'), ctx = c.getContext('2d');
  // On phones the timeline canvas stays, but rasterize at a lower
  // device-pixel-ratio — the ambience is unchanged to the eye while
  // the per-frame fill cost drops sharply on mobile GPUs.
  var small = (window.matchMedia && (matchMedia('(hover: none)').matches || matchMedia('(max-width: 720px)').matches));
  var w, h, dpr = Math.min(small ? 1.5 : 2, window.devicePixelRatio || 1);
  var segs = [], motes = [], dust = [], t0 = 0, last = 0;

  function build() {
    segs = [];
    var maxDepth = w < 700 ? 6 : 7;
    grow(w / 2, h + h * 0.04, -Math.PI / 2, h * 0.185, maxDepth, 0, -1);
    motes = [];
    var count = w < 700 ? 14 : 26;
    for (var i = 0; i < count; i++) motes.push(newMote(Math.random()));
    dust = [];
    var dn = Math.round(Math.min(70, (w * h) / 28000));
    for (var j = 0; j < dn; j++) dust.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.3 + 0.3, s: Math.random() * 0.16 + 0.03, o: Math.random() * 0.4 + 0.1 });
  }

  function grow(x, y, ang, len, depth, delay, parent) {
    var x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
    var dur = len * 11;
    var id = segs.length;
    segs.push({ x1: x, y1: y, x2: x2, y2: y2, depth: depth, delay: delay, dur: dur, parent: parent, kids: [], prune: 0 });
    if (parent >= 0) segs[parent].kids.push(id);
    if (depth <= 0) return id;
    var branches = depth > 4 ? 2 : (rnd(id) < 0.72 ? 2 : 1);
    var spread = 0.30 + rnd(id * 7) * 0.30;
    for (var i = 0; i < branches; i++) {
      var dir = branches === 1 ? (rnd(id * 3) - 0.5) * 0.7 : (i ? spread : -spread);
      grow(x2, y2, ang + dir + (rnd(id * 11 + i) - 0.5) * 0.22, len * (0.70 + rnd(id * 5 + i) * 0.12), depth - 1, delay + dur * 0.72, id);
    }
    return id;
  }
  // deterministic pseudo-random so the tree is stable across a resize
  function rnd(n) { var x = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); }

  function newMote(p) {
    return { seg: 0, p: p || 0, sp: 0.006 + Math.random() * 0.012, life: 1 };
  }

  function size() {
    w = c.clientWidth; h = c.clientHeight;
    c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }
  var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(size, 220); });
  size();

  // Periodically prune a limb — it flares, dies back, then regrows.
  setInterval(function () {
    var pool = segs.filter(function (s) { return s.depth >= 2 && s.depth <= 4 && !s.prune; });
    if (!pool.length) return;
    var target = pool[Math.floor(Math.random() * pool.length)];
    var stack = [segs.indexOf(target)], now = performance.now();
    while (stack.length) {
      var i = stack.pop(); segs[i].prune = now;
      segs[i].kids.forEach(function (k) { stack.push(k); });
    }
  }, 7000);

  function accent() {
    var v = getComputedStyle(document.documentElement).getPropertyValue('--accent-glow').trim();
    return v || '255,74,85';
  }

  (function loop(now) {
    requestAnimationFrame(loop);
    if (document.hidden) return;             // don't paint a backgrounded tab
    if (now - last < 33) return;             // 30fps is plenty for ambience
    last = now;
    if (!t0) t0 = now;
    var t = now - t0;
    var acc = accent();
    ctx.clearRect(0, 0, w, h);

    // slow motes of temporal dust
    ctx.globalCompositeOperation = 'lighter';
    for (var d = 0; d < dust.length; d++) {
      var p = dust[d];
      p.y -= p.s; p.x += Math.sin((p.y + d * 40) / 190) * 0.14;
      if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; }
      ctx.beginPath();
      ctx.fillStyle = 'rgba(' + acc + ',' + p.o * 0.5 + ')';
      ctx.arc(p.x, p.y, p.r, 0, 6.2832);
      ctx.fill();
    }

    // the tree
    for (var i = 0; i < segs.length; i++) {
      var s = segs[i];
      var pruned = s.prune ? (now - s.prune) / 2600 : 0;
      if (pruned >= 1) { s.prune = 0; s.delay = t + 200 + s.depth * 60; }  // regrow
      var g = Math.max(0, Math.min(1, (t - s.delay) / s.dur));
      if (g <= 0) continue;

      var ex = s.x1 + (s.x2 - s.x1) * g, ey = s.y1 + (s.y2 - s.y1) * g;
      var base = 0.05 + s.depth * 0.017;
      var alpha = base * (1 - pruned);
      if (alpha <= 0.002) continue;

      ctx.beginPath();
      ctx.lineWidth = Math.max(0.5, s.depth * 0.62);
      ctx.lineCap = 'round';
      // pruned limbs flash toward the accent before they go
      ctx.strokeStyle = pruned
        ? 'rgba(' + acc + ',' + alpha * 2.4 + ')'
        : 'rgba(228,190,110,' + alpha + ')';
      ctx.moveTo(s.x1, s.y1); ctx.lineTo(ex, ey);
      ctx.stroke();

      if (g < 1) {   // growing tip
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,228,160,' + 0.5 * (1 - pruned) + ')';
        ctx.arc(ex, ey, 1.5 + s.depth * 0.12, 0, 6.2832);
        ctx.fill();
      }
    }

    // energy running out along the limbs
    for (var m = 0; m < motes.length; m++) {
      var mo = motes[m], sg = segs[mo.seg];
      if (!sg) { motes[m] = newMote(0); continue; }
      mo.p += mo.sp;
      if (mo.p >= 1) {
        mo.p = 0;
        var kids = sg.kids;
        mo.seg = kids.length ? kids[Math.floor(Math.random() * kids.length)] : 0;
        if (!kids.length) mo.p = 0;
        continue;
      }
      if (sg.prune) { motes[m] = newMote(0); continue; }
      var mx = sg.x1 + (sg.x2 - sg.x1) * mo.p, my = sg.y1 + (sg.y2 - sg.y1) * mo.p;
      var r = 4.5 - sg.depth * 0.25;
      var grd = ctx.createRadialGradient(mx, my, 0, mx, my, Math.max(2.5, r * 2.4));
      grd.addColorStop(0, 'rgba(255,236,190,0.55)');
      grd.addColorStop(1, 'rgba(255,200,90,0)');
      ctx.beginPath(); ctx.fillStyle = grd;
      ctx.arc(mx, my, Math.max(2.5, r * 2.4), 0, 6.2832); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  })(0);
})();

/* ============================================================
   TVA SACRED TIMELINE CLOCK
   The MCU's in-universe present, advancing in real time. We read
   the leading edge of the Sacred Timeline straight from the data —
   the furthest-forward in-universe year any MCU story has reached
   (currently Spider-Man: Brand New Day, 2028) — anchor "now" there
   and let it tick on 1:1 with our own clock.
   ============================================================ */
(function () {
  var box = el('#mclock'); if (!box) return;
  var dEl = el('.mc-date', box), tEl = el('.mc-time', box), nEl = el('.mc-note', box);
  var lead = 0, leadTitle = '';
  ENTRIES.forEach(function (e) {
    if (e.universe !== 'mcu' || !e.inuniv) return;
    var m = String(e.inuniv).match(/(\d{4})(?![\s\S]*\d{4})/); // last 4-digit year in the field
    var y = m ? +m[1] : 0;
    if (y > lead) { lead = y; leadTitle = e.title; }
  });
  var real = new Date();
  if (!lead) lead = real.getFullYear();
  // Shift the year to the leading edge, keep the same day/time, tick 1:1.
  var OFFSET = Date.UTC(real.getFullYear(), real.getMonth(), real.getDate())
             - Date.UTC(lead, real.getMonth(), real.getDate());
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function tick() {
    var m = new Date(Date.now() - OFFSET);
    dEl.textContent = MONTHS[m.getMonth()] + ' ' + m.getDate() + ', ' + m.getFullYear();
    tEl.textContent = pad(m.getHours()) + ':' + pad(m.getMinutes()) + ':' + pad(m.getSeconds());
  }
  if (nEl) nEl.innerHTML = 'Marvel’s present. The Sacred Timeline’s leading edge is <b>' +
    esc(leadTitle || 'the latest release') + '</b> (' + lead + '); the TVA holds the line there and it runs on, second by second, against our own clock.';
  tick();
  setInterval(tick, 1000);
})();

/* ============================================================
   BOOT
   ============================================================ */
BUILD.nexus(); built.nexus = true;
var initial = (location.hash || '').replace('#', '');
if (initial && BUILD[initial]) go(initial);

})();
