import { UttamKumarLayout } from "../../components/uttamkumar/UttamKumarLayout";
import { UkFaq, UkHero, UkSection } from "../../components/uttamkumar/shared";
import { IMAGE_CREDITS, REJECTED_IMAGES } from "../../data/uttamkumar/credits";
import { PAGE_FAQ, PAGE_PATH, PAGE_SEO } from "../../data/seo";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import { buildJsonLd } from "../../lib/jsonld";
import { JsonLd } from "../../components/JsonLd";

export function UttamKumarCreditsPage() {
  const seo = PAGE_SEO.uttamkumarCredits;
  useDocumentHead(seo, PAGE_PATH.uttamkumarCredits);

  return (
    <UttamKumarLayout active="credits">
      <JsonLd data={buildJsonLd("uttamkumarCredits")} />
      <UkHero eyebrow="Image Credits" h1={seo.h1} intro={seo.intro} />

      <UkSection id="used" heading={`Used (${IMAGE_CREDITS.length})`}>
        <div className="grid gap-4 sm:grid-cols-2">
          {IMAGE_CREDITS.map((c) => (
            <figure key={c.slug} className="border border-uk-outline-variant bg-uk-void-dim p-3">
              <img
                src={`/uttamkumar/photos/${c.slug}.webp`}
                alt={c.caption}
                loading="lazy"
                className="w-full rounded-sm object-cover"
              />
              <figcaption className="mt-2 text-[12.5px] leading-relaxed text-uk-on-void-muted">
                <p className="text-uk-on-void">{c.caption}</p>
                <p className="uk-mono mt-1 text-[10.5px]">
                  {c.author} ·{" "}
                  <a href={c.licenseUrl} target="_blank" rel="noreferrer" className="text-uk-gold hover:underline">
                    {c.license}
                  </a>{" "}
                  ·{" "}
                  <a href={c.sourceUrl} target="_blank" rel="noreferrer" className="text-uk-gold hover:underline">
                    source
                  </a>
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </UkSection>

      <UkSection id="rejected" heading={`Reviewed and Rejected (${REJECTED_IMAGES.length})`}>
        <ul className="flex flex-col gap-2.5 text-[13px] leading-relaxed">
          {REJECTED_IMAGES.map((r) => (
            <li key={r.title} className="border-l-2 border-uk-outline-variant pl-3">
              <span className="font-semibold text-uk-on-void">{r.title}</span>
              <span className="text-uk-on-void-muted"> — {r.reason}</span>
            </li>
          ))}
        </ul>
      </UkSection>

      <div className="mt-14">
        <UkFaq items={PAGE_FAQ.uttamkumarCredits} />
      </div>
    </UttamKumarLayout>
  );
}
