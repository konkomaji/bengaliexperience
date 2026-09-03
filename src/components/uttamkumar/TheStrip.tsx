import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FILMS, type Film } from "../../data/uttamkumar/films";
import { LIFE_EVENTS, type LifeEvent } from "../../data/uttamkumar/life";
import { CENTENARY_EVENTS } from "../../data/uttamkumar/centenary";

/**
 * The strip.
 *
 * Not a filmography rendered as a list — the filmography rendered as the
 * physical thing it was shot on. One row per year, one frame per film, and
 * the *density of the strip is the biography*: three thin frames in 1951
 * (the "Flop Master General" years), eleven jammed into 1954, six-for-six
 * in 1975, and then it stops. 24 July 1980 is blank leader, not a heading
 * that says he died. The films completed after his death print past the
 * tail; then forty-four years of dark leader tick by with nothing on them,
 * which is the only honest way to draw that gap; then 2024 splices in a
 * frame that isn't his to give — Srijit Mukherji's Oti Uttam, cut together
 * out of clips from 56 films he shot before 1980 — and a new reel is
 * threaded for the centenary.
 *
 * Everything else on the page hangs off this: life events are grease-pencil
 * annotations in the margin at their year, and a frame you stop on
 * *projects* — lights up and opens, rather than navigating away.
 */

const DEATH_YEAR = 1980;
/** Years with no releases at all get skipped rather than drawn empty —
 *  except the long post-1987 silence, which is drawn on purpose. */
const DARK_GAP_START = 1988;
const DARK_GAP_END = 2023;

interface YearRow {
  year: number;
  films: Film[];
  events: LifeEvent[];
}

export function TheStrip() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const rows = useMemo<YearRow[]>(() => {
    const byYear = new Map<number, YearRow>();
    for (const f of FILMS) {
      if (!byYear.has(f.year)) byYear.set(f.year, { year: f.year, films: [], events: [] });
      byYear.get(f.year)!.films.push(f);
    }
    for (const e of LIFE_EVENTS) {
      if (!byYear.has(e.year)) byYear.set(e.year, { year: e.year, films: [], events: [] });
      byYear.get(e.year)!.events.push(e);
    }
    return [...byYear.values()].sort((a, b) => a.year - b.year);
  }, []);

  const lifetime = rows.filter((r) => r.year <= DEATH_YEAR);
  const afterTail = rows.filter((r) => r.year > DEATH_YEAR && r.year < DARK_GAP_START);
  const returns = rows.filter((r) => r.year > DARK_GAP_END);

  return (
    <div className="relative">
      <SprocketRails />

      <div className="relative mx-auto max-w-4xl px-8 sm:px-14">
        {lifetime.map((row) => (
          <Row key={row.year} row={row} openSlug={openSlug} onOpen={setOpenSlug} />
        ))}

        <Tail />

        <p className="uk-mono mb-4 mt-10 max-w-[46ch] text-[9.5px] uppercase leading-relaxed tracking-[0.3em] text-uk-on-void-muted">
          Printed after the tail — shot before July 1980, finished and released without him
        </p>
        {afterTail.map((row) => (
          <Row key={row.year} row={row} openSlug={openSlug} onOpen={setOpenSlug} posthumous />
        ))}

        <DarkLeader from={DARK_GAP_START} to={DARK_GAP_END} />

        {returns.map((row) => (
          <Row key={row.year} row={row} openSlug={openSlug} onOpen={setOpenSlug} posthumous />
        ))}

        <NewReel />
      </div>
    </div>
  );
}

/** The two continuous sprocket rails the whole page runs between. */
function SprocketRails() {
  return (
    <>
      <span aria-hidden className="uk-sprockets-v pointer-events-none absolute inset-y-0 left-1.5 w-4 opacity-50 sm:left-4" />
      <span aria-hidden className="uk-sprockets-v pointer-events-none absolute inset-y-0 right-1.5 w-4 opacity-50 sm:right-4" />
    </>
  );
}

function Row({
  row,
  openSlug,
  onOpen,
  posthumous = false,
}: {
  row: YearRow;
  openSlug: string | null;
  onOpen: (slug: string | null) => void;
  posthumous?: boolean;
}) {
  const openFilm = row.films.find((f) => f.slug === openSlug);

  return (
    <section className="relative border-b border-uk-outline-variant/40 py-3" aria-label={`${row.year}`}>
      <div className="flex items-start gap-3 sm:gap-5">
        <p className="uk-mono w-9 shrink-0 pt-1 text-[11px] font-semibold text-uk-gold sm:w-12 sm:text-[12px]">
          {row.year}
        </p>

        <div className="min-w-0 flex-1">
          {/* The frames: one per film, butted against each other between two
              sprocket edges, so a year reads as one physical length of film
              whose size is the year's output — not a row of separate tiles. */}
          {row.films.length > 0 && (
            <div className="inline-flex max-w-full flex-col rounded-[2px] bg-uk-void-dim/90 ring-1 ring-uk-outline-variant/70">
              <span aria-hidden className="uk-sprockets h-2 w-full opacity-70" />
              <div className="flex flex-wrap">
                {row.films.map((f, i) => (
                  <Frame key={f.slug} film={f} index={i} dim={posthumous} onOpen={onOpen} isOpen={f.slug === openSlug} />
                ))}
              </div>
              <span aria-hidden className="uk-sprockets h-2 w-full opacity-70" />
            </div>
          )}
          {row.films.length === 0 && row.year >= 1948 && (
            <span className="uk-mono text-[10px] italic text-uk-on-void-muted/60">no releases</span>
          )}

          {/* grease-pencil margin notes: what happened off screen that year */}
          {row.events.map((e) => (
            <motion.p
              key={e.headline.slice(0, 24)}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              className="mt-2 border-l-2 border-uk-gold/50 pl-2.5 text-[12px] leading-snug text-uk-on-void-muted"
            >
              {e.date && <span className="uk-mono mr-1.5 text-[10px] text-uk-gold">{e.date}</span>}
              {e.headline}
            </motion.p>
          ))}
        </div>
      </div>

      <AnimatePresence>{openFilm && <Projection film={openFilm} onClose={() => onOpen(null)} />}</AnimatePresence>
    </section>
  );
}

/** One film. A frame of exposed stock until you stop on it. */
function Frame({
  film,
  index,
  dim,
  isOpen,
  onOpen,
}: {
  film: Film;
  index: number;
  dim: boolean;
  isOpen: boolean;
  onOpen: (slug: string | null) => void;
}) {
  const hasDetail = !!film.detail;
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(isOpen ? null : film.slug)}
      title={`${film.title} (${film.year})`}
      aria-label={`${film.title}, ${film.year}${hasDetail ? "" : " — no synopsis on file"}`}
      aria-expanded={isOpen}
      initial={{ opacity: 0, scaleY: 0.4 }}
      whileInView={{ opacity: 1, scaleY: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.3, delay: Math.min(index, 10) * 0.025 }}
      whileHover={{ scaleY: 1.06 }}
      className={`relative h-11 w-7 shrink-0 border-r border-uk-void/80 p-[2px] transition-colors last:border-r-0 sm:h-14 sm:w-9 ${
        isOpen ? "z-10 shadow-[0_0_20px_rgba(216,169,74,0.55)]" : ""
      }`}
    >
      {/* The frame's own exposed image area. Films with something real to
          say about them are printed bright; the undocumented ones are a
          latent, barely-exposed frame — visible, part of the strip, but
          not pretending to carry a picture. */}
      <span
        aria-hidden
        className={`block h-full w-full rounded-[1px] transition-colors ${
          isOpen
            ? "bg-uk-gold"
            : hasDetail
              ? "bg-uk-gold/55 group-hover:bg-uk-gold"
              : "bg-uk-on-void/[0.09]"
        } ${dim && !isOpen ? "opacity-45" : ""}`}
      />
    </motion.button>
  );
}

/** A frame, projected: it lights up and opens where it sits. */
function Projection({ film, onClose }: { film: Film; onClose: () => void }) {
  const d = film.detail;
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden"
    >
      <div className="relative ml-12 mt-3 border border-uk-gold/40 bg-[radial-gradient(ellipse_at_top_left,rgba(216,169,74,0.14),transparent_60%)] p-4 sm:ml-17">
        <button
          type="button"
          onClick={onClose}
          className="uk-mono absolute right-3 top-3 text-[10px] uppercase tracking-wide text-uk-on-void-muted hover:text-uk-gold"
        >
          close
        </button>
        <p className="uk-mono text-[10px] uppercase tracking-[0.25em] text-uk-gold">
          Frame {film.order} of 211 · {film.year}
        </p>
        <h3 className="uk-marquee mt-1 text-[22px] leading-tight text-uk-on-void sm:text-[26px]">{film.title}</h3>
        {film.role && <p className="mt-0.5 text-[12.5px] text-uk-on-void-muted">as {film.role}</p>}

        {d ? (
          <>
            <p className="mt-3 max-w-[60ch] text-[13.5px] leading-relaxed text-uk-on-void/90">{d.synopsis}</p>
            <dl className="uk-mono mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[10.5px] text-uk-on-void-muted">
              {d.director && (
                <div>
                  <dt className="inline text-uk-gold">dir. </dt>
                  <dd className="inline">{d.director}</dd>
                </div>
              )}
              {d.coStars?.length && (
                <div>
                  <dt className="inline text-uk-gold">with </dt>
                  <dd className="inline">{d.coStars.join(", ")}</dd>
                </div>
              )}
              {film.note && (
                <div>
                  <dt className="inline text-uk-gold">note </dt>
                  <dd className="inline">{film.note}</dd>
                </div>
              )}
            </dl>
            {d.significance && <p className="mt-2 text-[12.5px] italic text-uk-gold/90">{d.significance}</p>}
            {d.sourceKind === "wikipedia" && d.wikiTitle && (
              <p className="uk-mono mt-3 text-[9.5px] text-uk-on-void-muted">
                Synopsis from{" "}
                <a
                  href={`https://en.wikipedia.org/wiki/${encodeURIComponent(d.wikiTitle.replace(/ /g, "_"))}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-uk-gold hover:underline"
                >
                  Wikipedia
                </a>
                , CC BY-SA 4.0
              </p>
            )}
          </>
        ) : (
          <p className="mt-3 max-w-[58ch] text-[13px] leading-relaxed text-uk-on-void-muted">
            No synopsis on file. This one is a title, a year and a role — which is all that's actually
            documented for it anywhere, so it's all that's claimed here.
          </p>
        )}
      </div>
    </motion.div>
  );
}

/** 24 July 1980. The strip runs out — countdown leader, then nothing. */
function Tail() {
  return (
    <div className="relative py-10">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="uk-mono text-center text-[11px] uppercase tracking-[0.3em] text-uk-gold"
      >
        24 July 1980
      </motion.p>
      <p className="mt-1 text-center text-[12.5px] text-uk-on-void-muted">
        Taken ill on the set of <span className="italic">Ogo Bodhu Shundori</span>. Died that evening, aged 53.
      </p>

      {/* academy leader: the countdown that runs out before the picture ends */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {[5, 4, 3, 2].map((n, i) => (
          <motion.span
            key={n}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.35 - i * 0.07 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="uk-mono flex h-9 w-6 items-center justify-center rounded-[2px] border border-uk-outline-variant text-[11px] text-uk-on-void-muted sm:h-11 sm:w-8"
          >
            {n}
          </motion.span>
        ))}
        <span className="h-9 w-6 rounded-[2px] border border-dashed border-uk-outline-variant sm:h-11 sm:w-8" />
      </div>
    </div>
  );
}

/** The forty-four years with nothing on them. Drawn, not skipped. */
function DarkLeader({ from, to }: { from: number; to: number }) {
  const years = to - from + 1;
  return (
    <div className="relative py-12">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex flex-col items-center gap-3"
      >
        <p className="uk-mono text-[9.5px] uppercase tracking-[0.3em] text-uk-on-void-muted">
          {from}–{to} · {years} years of blank leader
        </p>
        <div className="flex h-24 w-full max-w-md items-stretch justify-center gap-[3px] opacity-30">
          {Array.from({ length: years }, (_, i) => (
            <span key={i} className="w-full rounded-[1px] bg-uk-on-void/10" />
          ))}
        </div>
        <p className="max-w-[46ch] text-center text-[12px] leading-relaxed text-uk-on-void-muted">
          Nothing new was released in these years, and the gap is drawn rather than skipped — it is
          most of the time since he died, and the length of it is the point.
        </p>
      </motion.div>
    </div>
  );
}

/** 2026: a new reel threaded on. */
function NewReel() {
  return (
    <div className="relative border-t-2 border-uk-gold/60 py-10">
      <p className="uk-mono text-[10px] uppercase tracking-[0.3em] text-uk-gold">2026 · a new reel threaded</p>
      <p className="mt-2 max-w-[58ch] text-[13.5px] leading-relaxed text-uk-on-void/90">
        His hundredth birthday fell on 3 September 2026. The state's own centenary programme runs
        across the whole year, so this end of the strip is still being exposed.
      </p>
      <ul className="mt-4 flex flex-col gap-2.5">
        {CENTENARY_EVENTS.slice(0, 4).map((e) => (
          <motion.li
            key={e.headline}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            className="border-l-2 border-uk-gold/50 pl-3 text-[12.5px] leading-snug text-uk-on-void-muted"
          >
            <span className="uk-mono mr-1.5 text-[10px] text-uk-gold">{e.date}</span>
            {e.headline}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
