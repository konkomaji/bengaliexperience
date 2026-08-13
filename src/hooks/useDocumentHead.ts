import { useEffect } from "react";
import { BRAND } from "../data/brand";
import type { PageSeo } from "../data/seo";

/**
 * Head sync for client-side navigation only. The FIRST load of any URL is
 * already correct without JavaScript, thanks to functions/_middleware.ts
 * rewriting the HTML at the edge. This just keeps things right as a visitor
 * moves between the front page and an experience.
 *
 * The social card is site-wide rather than per page, so it is set once in
 * index.html and never touched here.
 */
export function useDocumentHead(seo: PageSeo, canonicalPath: string) {
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
