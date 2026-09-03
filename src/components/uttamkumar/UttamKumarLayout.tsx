import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { BRAND } from "../../data/brand";
import { PAGE_PATH } from "../../data/seo";
import { UTTAMKUMAR_NAV } from "../../data/uttamkumar/nav";
import { CinemaBackdrop } from "./CinemaBackdrop";
import { FilmReelNav } from "./FilmReelNav";

/**
 * Shared shell for /uttamkumar/*: the darkened-cinema-hall theme (see
 * `.uttamkumar-theme` in index.css), a marquee standing in for a header, the
 * FilmReelNav ticket-dial in place of a conventional tab strip, and a
 * continuous scroll-linked parallax backdrop (CinemaBackdrop) running behind
 * every wing — the point being that this doesn't read as an app with pages,
 * it reads as one dark room you move through.
 */
export function UttamKumarLayout({
  active,
  children,
  bleed = false,
}: {
  active: (typeof UTTAMKUMAR_NAV)[number]["id"];
  children: ReactNode;
  /** Full-bleed pages lay out their own width and padding — the wings that
   *  open on a full-viewport scene rather than a centred reading column.
   *  Every page here composes its own body; this shell only owns the
   *  marquee, the reel dial and the backdrop. */
  bleed?: boolean;
}) {
  const location = useLocation();

  return (
    <div className="uttamkumar-theme relative isolate min-h-dvh w-full overflow-x-clip">
      <CinemaBackdrop />

      <header className="border-b-2 border-uk-outline bg-uk-void-dim/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 pt-3.5 pb-1 sm:px-6">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-1.5 text-[12px] font-semibold text-uk-on-void-muted transition-colors hover:text-uk-gold"
          >
            <span aria-hidden className="rotate-180">→</span>
            <span className="truncate">{BRAND.nameEn}</span>
          </Link>
          <span className="uk-mono shrink-0 text-[10px] uppercase tracking-[0.18em] text-uk-on-void-muted">
            A tribute to Mahanayak
          </span>
        </div>

        <div className="mx-auto max-w-3xl px-4 pb-1 pt-2 text-center sm:px-6">
          <Link to={UTTAMKUMAR_NAV[0].path} className="block">
            <p className="uk-mono text-[10px] uppercase tracking-[0.3em] text-uk-gold">A Century on Screen</p>
            <h1 className="uk-marquee mt-1 text-[28px] leading-none tracking-tight text-uk-on-void sm:text-[36px]">
              Uttam Kumar
            </h1>
          </Link>
        </div>

        <FilmReelNav active={active} />
      </header>

      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className={
          bleed
            ? "relative pb-24 sm:pb-16"
            : "relative mx-auto max-w-3xl px-4 pb-24 pt-6 sm:px-6 sm:pb-16 sm:pt-9"
        }
      >
        {children}
      </motion.main>

      <footer className="uk-filmstrip" aria-hidden />
      <footer className="border-b border-uk-outline-variant px-4 pb-10 pt-8 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 text-[11.5px] leading-relaxed text-uk-on-void-muted">
          <p>
            An independent centenary tribute, not affiliated with Uttam Kumar's family, estate, or the
            West Bengal government's own centenary committee. The filmography is parsed directly from
            Wikipedia's own filmography table; the biography and centenary reporting are cross-checked
            against independent press listed on the sources page.
          </p>
          <p>
            <Link to={PAGE_PATH.uttamkumarSources} className="font-semibold text-uk-gold hover:underline">
              Full sources and credits →
            </Link>
          </p>
          <p>
            <Link to={PAGE_PATH.privacy} className="underline decoration-uk-on-void-muted/40 underline-offset-2 hover:text-uk-on-void">
              Privacy
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
