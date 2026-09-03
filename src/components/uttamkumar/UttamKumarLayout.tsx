import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { BRAND } from "../../data/brand";
import { PAGE_PATH } from "../../data/seo";
import { UTTAMKUMAR_NAV } from "../../data/uttamkumar/nav";
import { ArrowRightIcon } from "../icons";

/**
 * Shared shell for /uttamkumar/*: the darkened-cinema-hall theme (see
 * `.uttamkumar-theme` in index.css), a marquee standing in for a header, and
 * a tab strip that reads like a row of doors into different wings rather
 * than an app's navigation — the same role KabirSumanLayout plays for that
 * section, deliberately not reskinned from it.
 */
export function UttamKumarLayout({
  active,
  children,
}: {
  active: (typeof UTTAMKUMAR_NAV)[number]["id"];
  children: ReactNode;
}) {
  const location = useLocation();

  return (
    <div className="uttamkumar-theme min-h-dvh w-full">
      <header className="uk-sprockets border-b-2 border-uk-outline bg-uk-void-dim/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 pt-3.5 pb-1 sm:px-6">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-1.5 text-[12px] font-semibold text-uk-on-void-muted transition-colors hover:text-uk-gold"
          >
            <span aria-hidden className="rotate-180"><ArrowRightIcon size={13} /></span>
            <span className="truncate">{BRAND.nameEn}</span>
          </Link>
          <span className="uk-mono shrink-0 text-[10px] uppercase tracking-[0.18em] text-uk-on-void-muted">
            An independent tribute
          </span>
        </div>

        <div className="mx-auto max-w-3xl px-4 pb-4 pt-2 sm:px-6">
          <Link to={UTTAMKUMAR_NAV[0].path} className="block">
            <p className="uk-mono text-[10px] uppercase tracking-[0.3em] text-uk-gold">শতবর্ষ · A Century on Screen</p>
            <h1 className="uk-marquee mt-1 text-[28px] leading-none tracking-tight text-uk-on-void sm:text-[36px]">
              Uttam Kumar
            </h1>
          </Link>
        </div>

        <nav
          aria-label="Uttam Kumar tribute sections"
          className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-4 pb-0 sm:px-6"
        >
          {UTTAMKUMAR_NAV.map((item) => {
            const isActive = item.id === active;
            return (
              <Link
                key={item.id}
                to={item.path}
                aria-current={isActive ? "page" : undefined}
                className={`uk-mono flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors ${
                  isActive
                    ? "border-uk-gold text-uk-gold"
                    : "border-transparent text-uk-on-void-muted hover:text-uk-on-void"
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
