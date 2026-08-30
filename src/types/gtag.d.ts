/** Ambient type for Google's Consent Mode `gtag` shim, defined inline in
 *  index.html before any ad or analytics tag loads (see the comment there
 *  and src/components/ConsentBanner.tsx, its only caller). */
interface Window {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
}
