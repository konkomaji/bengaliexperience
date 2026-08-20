import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { BRAND, DRIVER } from "../../data/brand";
import { TARAKESWAR_NAV } from "../../data/tarakeswar/nav";
import { useTarakeswarPageViews } from "../../hooks/useTarakeswarPageViews";
import { ArrowRightIcon } from "../icons";

/**
 * Shared shell for the whole /tarakeswar section: a light Material Expressive
 * theme, deliberately separate from the rest of the site (see the
 * `.tarakeswar-theme` tokens in index.css). This is not a scene to sit inside,
 * it is a guide someone reads standing at a bus stop or lying on a hotel bed
 * mid-trip, so the design goal is legibility and thumb reach over mood.
 *
 * Mobile is the real target, not a breakpoint checked afterwards: base
 * (unprefixed) styles are the phone layout, `sm:`/`md:` add room back in for
 * wider screens. The section tab bar sits at the *bottom* on small screens,
 * inside the thumb zone, and moves to a top pill row once there is room for
 * one, matching how a wide screen is actually held (not held at all).
 */
export function TarakeswarLayout({
  active,
  children,
}: {
  active: (typeof TARAKESWAR_NAV)[number]["id"];
  children: ReactNode;
}) {
  const location = useLocation();
  const views = useTarakeswarPageViews(location.pathname);

  return (
    <div className="tarakeswar-theme min-h-dvh w-full">
      {/* top bar: back to the main project, kept small and out of the way */}
      <header className="border-b border-tara-outline-variant/70 bg-tara-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-1.5 text-[13px] font-semibold text-tara-on-surface-muted transition-colors hover:text-tara-primary"
          >
            <span aria-hidden className="rotate-180"><ArrowRightIcon size={14} /></span>
            <span className="truncate">{BRAND.nameEn}</span>
          </Link>
          <Link
            to="/tarakeswar"
            className="flex shrink-0 items-center gap-2 text-[15px] font-extrabold tracking-tight text-tara-primary sm:text-base"
          >
            <img
              src="/tarakeswar/badge.webp"
              alt="Illustrated badge of Tarakeswar: Dudhpukur pond beside the temple, with the town's colourful riverside buildings behind it"
              width={28}
              height={28}
              className="size-7 rounded-full object-cover ring-1 ring-tara-outline-variant"
            />
            Tarakeswar Guide
          </Link>
        </div>

        {/* section tabs, top row, visible from small-tablet width up */}
        <nav
          aria-label="Tarakeswar guide sections"
          className="mx-auto hidden max-w-3xl gap-1.5 overflow-x-auto px-4 pb-3 sm:flex sm:px-6"
        >
          {TARAKESWAR_NAV.map((item) => (
            <TabLink key={item.id} item={item} active={active} />
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-28 pt-5 sm:px-6 sm:pb-16 sm:pt-8">{children}</main>

      <footer className="border-t border-tara-outline-variant/70 px-4 pb-24 pt-8 sm:px-6 sm:pb-10">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 text-[12px] leading-relaxed text-tara-on-surface-muted">
          <p>
            This guide is an independent project, not run by or affiliated with the Tarakeswar
            temple trust, the Hooghly district administration or any government tourism body.
            Timings, distances and mela dates change; confirm anything time-critical, like a
            mela date or a train time, closer to your visit.
          </p>
          <p>
            An experiment by{" "}
            <Link to="/" className="font-semibold text-tara-primary underline decoration-tara-primary/30 underline-offset-2">
              bengaliexperience.wtf
            </Link>{" "}
            - built by{" "}
            <a
              href={DRIVER.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-tara-primary underline decoration-tara-primary/30 underline-offset-2"
            >
              Konko
            </a>
            , with love 🧡 from Tarakeswar.
          </p>
          <p>
            Photos courtesy the{" "}
            <a
              href="https://tarakeswarshrabanimela.wb.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-tara-primary underline decoration-tara-primary/30 underline-offset-2"
            >
              Tarakeswar Shrabani Mela
            </a>{" "}
            portal, Government of West Bengal.
          </p>
          {views !== null && (
            <p className="flex items-center gap-1.5 text-tara-on-surface-muted/80">
              <span className="relative flex size-1.5">
                <span className="absolute inset-0 rounded-full bg-tara-primary/70" />
              </span>
              <span className="font-semibold tabular-nums text-tara-on-surface">{views.toLocaleString("en-IN")}</span>
              {views === 1 ? "visit to this page" : "visits to this page"}
            </p>
          )}
        </div>
      </footer>

      {/* section tabs, bottom bar, mobile only: this is the primary nav on a
          phone, so it lives inside the thumb zone rather than up top where a
          phone layout would force a stretch or a second hand. */}
      <nav
        aria-label="Tarakeswar guide sections"
        className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-tara-outline-variant bg-tara-surface/97 backdrop-blur sm:hidden"
      >
        <div className="mx-auto flex max-w-3xl items-stretch justify-between px-1.5 pt-1.5">
          {TARAKESWAR_NAV.map((item) => (
            <TabLink key={item.id} item={item} active={active} mobile currentPath={location.pathname} />
          ))}
        </div>
      </nav>
    </div>
  );
}

function TabLink({
  item,
  active,
  mobile,
  currentPath,
}: {
  item: (typeof TARAKESWAR_NAV)[number];
  active: string;
  mobile?: boolean;
  currentPath?: string;
}) {
  const isActive = item.id === active;
  const Icon = item.icon;

  if (mobile) {
    return (
      <Link
        to={item.path}
        aria-current={isActive ? "page" : undefined}
        // 48px-plus tap target, full-width column: the whole cell is
        // pressable, not just the icon or the label inside it.
        className={
          "flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 pb-1.5 text-center transition-colors " +
          (isActive ? "text-tara-primary" : "text-tara-on-surface-muted")
        }
      >
        <span className="relative flex h-7 items-center justify-center">
          {isActive && (
            <motion.span
              layoutId="tara-tab-pill"
              className="absolute inset-x-1 inset-y-0 rounded-full bg-tara-primary-container"
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
            />
          )}
          <span className="relative"><Icon size={19} /></span>
        </span>
        <span className="text-[10px] font-semibold leading-none">{item.short}</span>
      </Link>
    );
  }

  return (
    <Link
      to={item.path}
      aria-current={isActive ? "page" : undefined}
      className={
        "flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors " +
        (isActive
          ? "bg-tara-primary-container text-tara-on-primary-container"
          : "text-tara-on-surface-muted hover:bg-tara-surface-container")
      }
    >
      <Icon size={15} />
      {item.label}
      {currentPath === item.path ? null : null}
    </Link>
  );
}
