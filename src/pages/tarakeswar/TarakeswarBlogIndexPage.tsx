import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PAGE_FAQ, PAGE_PATH, PAGE_SEO } from "../../data/seo";
import { BLOG_POSTS, type BlogPost } from "../../data/tarakeswar/blog";
import { buildJsonLd } from "../../lib/jsonld";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import { JsonLd } from "../../components/JsonLd";
import { TarakeswarLayout } from "../../components/tarakeswar/TarakeswarLayout";
import { TaraFaq, TaraGradientBand, TaraHero, TaraSection } from "../../components/tarakeswar/shared";
import { ArrowRightIcon, ClockIcon } from "../../components/icons";

const CATEGORIES: BlogPost["category"][] = ["Planning", "Temple & Mela", "Food & Stay", "Day Trips"];

export function TarakeswarBlogIndexPage() {
  const seo = PAGE_SEO.tarakeswarBlog;
  useDocumentHead(seo, PAGE_PATH.tarakeswarBlog);

  return (
    <TarakeswarLayout active="blog">
      <JsonLd data={buildJsonLd("tarakeswarBlog")} />
      <div className="relative">
        <TaraGradientBand />
        <TaraHero eyebrow={`${BLOG_POSTS.length} guides`} h1={seo.h1} intro={seo.intro} />
      </div>

      {CATEGORIES.map((cat) => {
        const posts = BLOG_POSTS.filter((p) => p.category === cat);
        if (!posts.length) return null;
        return (
          <TaraSection key={cat} heading={cat}>
            <div className="flex flex-col gap-3">
              {posts.map((p, i) => (
                <BlogCard key={p.slug} post={p} index={i} />
              ))}
            </div>
          </TaraSection>
        );
      })}

      <TaraSection heading="Questions">
        <TaraFaq items={PAGE_FAQ.tarakeswarBlog} />
      </TaraSection>
    </TarakeswarLayout>
  );
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index, 6) * 0.04 }}
      whileHover={{ y: -3, transition: { type: "spring", stiffness: 380, damping: 22 } }}
      whileTap={{ scale: 0.985 }}
    >
      <Link
        to={`${PAGE_PATH.tarakeswarBlog}/${post.slug}`}
        className="block rounded-3xl border border-tara-outline-variant bg-tara-surface-container p-4 transition-colors hover:border-tara-primary/50 hover:bg-tara-primary-container/30 sm:p-5"
      >
        <h3 className="text-[15px] font-extrabold leading-snug text-tara-on-surface">{post.title}</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-tara-on-surface-muted">{post.excerpt}</p>
        <div className="mt-3 flex items-center justify-between text-[11.5px] font-semibold text-tara-on-surface-muted">
          <span className="flex items-center gap-1"><ClockIcon size={12} /> {post.readMinutes} min read</span>
          <span className="flex items-center gap-1 text-tara-primary">
            Read <ArrowRightIcon size={11} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
