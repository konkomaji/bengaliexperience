import { useEffect } from "react";
import { BRAND } from "../data/brand";
import type { RouteSeo } from "../data/seo";

/**
 * Head sync for client-side navigation only. The FIRST load of any URL is
 * already correct without JS thanks to functions/_middleware.ts rewriting
 * the HTML at the edge — this just keeps things right as the user clicks
 * between routes.
 */
export function useDocumentHead(seo: RouteSeo, canonicalPath: string) {
  useEffect(() => {
    document.title = seo.title;
    setMeta('meta[name="description"]', seo.description);
    setMeta('meta[name="keywords"]', seo.keywords.join(", "));
    setMeta('meta[property="og:title"]', seo.title);
    setMeta('meta[property="og:description"]', seo.description);
    setMeta('meta[property="og:url"]', BRAND.url + canonicalPath);
    setMeta('meta[name="twitter:title"]', seo.title);
    setMeta('meta[name="twitter:description"]', seo.description);
    const link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (link) link.href = BRAND.url + canonicalPath;
  }, [seo, canonicalPath]);
}

function setMeta(selector: string, content: string) {
  const el = document.querySelector<HTMLMetaElement>(selector);
  if (el) el.content = content;
}
