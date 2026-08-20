import { Link, Navigate, useParams } from "react-router-dom";
import { BRAND } from "../../data/brand";
import { PAGE_PATH, PAGE_SEO } from "../../data/seo";
import { BLOG_POSTS, getBlogPost } from "../../data/tarakeswar/blog";
import { buildTarakeswarBlogPostJsonLd } from "../../data/tarakeswar/jsonld";
import { JsonLd } from "../../components/JsonLd";
import { TarakeswarLayout } from "../../components/tarakeswar/TarakeswarLayout";
import { TaraFaq, TaraProse, TaraSection } from "../../components/tarakeswar/shared";
import { ArrowRightIcon, CalendarIcon, ClockIcon } from "../../components/icons";
import { useEffect } from "react";

/**
 * One blog post. Unlike every other page, its SEO isn't in src/data/seo.ts
 * (there are twelve of these and more later, one per slug; see the note on
 * PageId there), so the head is synced directly from the post's own fields
 * here instead of through useDocumentHead, which expects a PageSeo.
 */
export function TarakeswarBlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPost(slug) : undefined;

  useEffect(() => {
    if (!post) return;
    document.title = post.title;
    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector<HTMLMetaElement>(selector);
      if (el) el.content = content;
    };
    setMeta('meta[name="description"]', post.description);
    setMeta('meta[name="keywords"]', post.keywords.join(", "));
    setMeta('meta[property="og:title"]', post.title);
    setMeta('meta[property="og:description"]', post.description);
    setMeta('meta[property="og:url"]', `${BRAND.url}${PAGE_PATH.tarakeswarBlog}/${post.slug}`);
    setMeta('meta[name="twitter:title"]', post.title);
    setMeta('meta[name="twitter:description"]', post.description);
    setMeta('meta[name="theme-color"]', "#e8720c");
    const image = PAGE_SEO.tarakeswar.ogImage!;
    setMeta('meta[property="og:image"]', BRAND.url + image.url);
    setMeta('meta[property="og:image:alt"]', image.alt);
    setMeta('meta[name="twitter:image"]', BRAND.url + image.url);
    setMeta('meta[name="twitter:image:alt"]', image.alt);
    const link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (link) link.href = `${BRAND.url}${PAGE_PATH.tarakeswarBlog}/${post.slug}`;
    // Every Tarakeswar page shares the section's one tab icon.
    const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (icon) {
      icon.type = "image/png";
      icon.href = "/tarakeswar/favicon.png";
    }
  }, [post]);

  if (!post) return <Navigate to={PAGE_PATH.tarakeswarBlog} replace />;

  const related = BLOG_POSTS.filter((p) => p.category === post.category && p.slug !== post.slug).slice(0, 3);
  const dateLabel = new Date(post.publishedDate).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

  return (
    <TarakeswarLayout active="blog">
      <JsonLd data={buildTarakeswarBlogPostJsonLd(post)} />

      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[12px] font-semibold text-tara-on-surface-muted">
        <Link to={PAGE_PATH.tarakeswar} className="hover:text-tara-primary">Tarakeswar</Link>
        <span aria-hidden>/</span>
        <Link to={PAGE_PATH.tarakeswarBlog} className="hover:text-tara-primary">Blog</Link>
      </nav>

      <header className="mt-3">
        <span className="inline-block rounded-full bg-tara-primary-container px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-tara-on-primary-container">
          {post.category}
        </span>
        <h1 className="mt-3 text-[26px] font-extrabold leading-[1.12] tracking-tight text-tara-on-surface sm:text-[34px]">
          {post.h1}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] font-semibold text-tara-on-surface-muted">
          <span className="flex items-center gap-1.5"><CalendarIcon size={13} /> {dateLabel}</span>
          <span className="flex items-center gap-1.5"><ClockIcon size={13} /> {post.readMinutes} min read</span>
        </div>
        <p className="mt-5 text-[15px] leading-relaxed text-tara-on-surface/90 sm:text-base">{post.intro}</p>
      </header>

      {post.sections.map((s) => (
        <TaraSection key={s.heading} heading={s.heading}>
          <TaraProse paragraphs={s.paragraphs} />
        </TaraSection>
      ))}

      <TaraSection heading="Questions">
        <TaraFaq items={post.faq} />
      </TaraSection>

      {related.length > 0 && (
        <TaraSection heading="More on this">
          <ul className="flex flex-col gap-2.5">
            {related.map((p) => (
              <li key={p.slug}>
                <Link
                  to={`${PAGE_PATH.tarakeswarBlog}/${p.slug}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-tara-outline-variant bg-tara-surface-container px-4 py-3.5 transition-colors hover:border-tara-primary/50"
                >
                  <span className="text-[13.5px] font-bold leading-snug text-tara-on-surface">{p.title}</span>
                  <ArrowRightIcon size={14} />
                </Link>
              </li>
            ))}
          </ul>
        </TaraSection>
      )}

      <div className="mt-10 flex flex-wrap gap-3 border-t border-tara-outline-variant pt-6">
        <Link to={PAGE_PATH.tarakeswarBlog} className="text-[13px] font-bold text-tara-primary hover:underline">
          ← All Tarakeswar guides
        </Link>
        <Link to={PAGE_PATH.tarakeswar} className="text-[13px] font-bold text-tara-on-surface-muted hover:underline">
          Tarakeswar overview
        </Link>
      </div>
    </TarakeswarLayout>
  );
}
