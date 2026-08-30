import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { BRAND } from "../../data/brand";
import { PAGE_PATH } from "../../data/seo";
import { KABIRSUMAN_NAV } from "../../data/kabirsuman/nav";
import { ArrowRightIcon } from "../icons";

/**
 * Shared shell for /kabirsuman/*: the aged-paper archive theme (see
 * `.kabirsuman-theme` in index.css), a masthead standing in for a normal
 * header, and a tab strip that reads like a card catalogue's dividers
 * rather than an app's navigation.
 *
 * Mobile-first, same rule as the rest of the site: unprefixed classes are
 * the phone layout, `sm:`/`md:` add room back in.
 */
export function KabirSumanLayout({
  active,
  children,
}: {
  active: (typeof KABIRSUMAN_NAV)[number]["id"];
  children: ReactNode;
}) {
  const location = useLocation();

  return (
    <div className="kabirsuman-theme min-h-dvh w-full">
      <header className="border-b-2 border-ks-ink/90 bg-ks-paper-bright/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-1.5 text-[12px] font-semibold text-ks-ink-muted transition-colors hover:text-ks-red"
          >
            <span aria-hidden className="rotate-180"><ArrowRightIcon size={13} /></span>
            <span className="truncate">{BRAND.nameEn}</span>
          </Link>
          <span className="ks-mono shrink-0 text-[10px] uppercase tracking-[0.18em] text-ks-ink-muted">
            An independent tribute
          </span>
        </div>

        {/* the masthead: styled like a printed manifesto's title block */}
        <div className="mx-auto max-w-3xl px-4 pb-3 pt-1 sm:px-6">
          <Link to={KABIRSUMAN_NAV[0].path} className="block">
            <p className="ks-mono text-[10px] uppercase tracking-[0.3em] text-ks-red">সংগ্রহশালা · The Archive</p>
            <h1 style={{ fontFamily: "var(--font-ks-display)" }} className="mt-0.5 text-[26px] font-semibold leading-none tracking-tight text-ks-ink sm:text-[32px]">
              Kabir Suman
            </h1>
          </Link>
        </div>

        <nav
          aria-label="Kabir Suman archive sections"
          className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-4 pb-0 sm:px-6"
        >
          {KABIRSUMAN_NAV.map((item) => {
            const isActive = item.id === active;
            return (
              <Link
                key={item.id}
                to={item.path}
                aria-current={isActive ? "page" : undefined}
                className={`ks-mono flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors ${
                  isActive
                    ? "border-ks-red text-ks-red"
                    : "border-transparent text-ks-ink-muted hover:text-ks-ink"
                }`}
              >
                <item.icon size={14} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-3xl px-4 pb-24 pt-6 sm:px-6 sm:pb-16 sm:pt-9"
      >
        {children}
      </motion.main>

      <footer className="border-t border-ks-outline px-4 pb-10 pt-8 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 text-[11.5px] leading-relaxed text-ks-ink-muted">
          <p>
            An independent tribute and reference archive, not affiliated with Kabir Suman, his
            label, or the sumanami.co.uk archive this catalogue is built from. Lyrics and album
            covers are reproduced from that archive for reference and commentary; every song
            plays from its own official upload elsewhere, never hosted here.
          </p>
          <p>
            <Link to={KABIRSUMAN_NAV[4].path} className="font-semibold text-ks-red hover:underline">
              Full sources and corrections →
            </Link>
          </p>
          <p>
            <Link to={PAGE_PATH.privacy} className="underline decoration-ks-ink-muted/40 underline-offset-2 hover:text-ks-ink">
              Privacy
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
