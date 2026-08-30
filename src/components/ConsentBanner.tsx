import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PAGE_PATH } from "../data/seo";

/**
 * Consent for Google AdSense's cookies (and, by the same choice, Clarity's).
 *
 * index.html sets Google's Consent Mode default to "denied" for every ad and
 * analytics signal before any tag loads — the standard manual implementation
 * for a site with no certified CMP (see the comment there). This banner is
 * the other half: the one piece of UI that actually asks, and calls
 * `gtag('consent', 'update', ...)` once someone answers. Until they do, ads
 * may still show (Google serves non-personalised ads under denied consent),
 * just without personalisation or the Clarity recording turning on.
 *
 * Hidden on the bus and Mahalaya pages. Those two carry no ads (see
 * AdSense's own Auto ads URL exclusions, configured in its dashboard) and are
 * built to be sat inside without interruption; a cookie bar fighting for the
 * bottom of the screen with the player is exactly the clutter those pages
 * are designed not to have.
 */
const NO_BANNER_PATHS: string[] = [PAGE_PATH.busdriver, PAGE_PATH.mahalaya];

const STORAGE_KEY = "bx-consent";
type Consent = "granted" | "denied";

function applyConsent(value: Consent) {
  window.gtag?.("consent", "update", {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  });
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Private browsing or a blocked store: the choice just doesn't persist,
    // and the banner asks again next visit. Not worth failing over.
  }
}

export function ConsentBanner() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (NO_BANNER_PATHS.includes(pathname)) {
      setVisible(false);
      return;
    }
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    if (stored === "granted" || stored === "denied") {
      applyConsent(stored);
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, [pathname]);

  if (!visible) return null;

  const decide = (value: Consent) => {
    applyConsent(value);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#150803]/97 px-4 py-4 backdrop-blur sm:px-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12px] leading-relaxed text-[#c8b6a8]">
          This site uses cookies for ads (Google AdSense) and anonymised usage recording (Microsoft Clarity). See the{" "}
          <Link to={PAGE_PATH.privacy} className="underline decoration-white/30 underline-offset-2 hover:text-[#f7ece4]">
            privacy policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide("denied")}
            className="rounded-full border border-white/15 px-4 py-2 text-[12px] font-semibold text-[#c8b6a8] hover:bg-white/5"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => decide("granted")}
            className="rounded-full bg-[#ff9a45] px-4 py-2 text-[12px] font-semibold text-[#2b0900] hover:bg-[#ffab63]"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
