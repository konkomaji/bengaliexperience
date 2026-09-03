import { FilmCard } from "../../components/uttamkumar/FilmCard";
import { UttamKumarLayout } from "../../components/uttamkumar/UttamKumarLayout";
import { UkFaq, UkFacts, UkHero, UkNote, UkProse, UkSection } from "../../components/uttamkumar/shared";
import { FILMS } from "../../data/uttamkumar/films";
import { SUCHITRA_INTRO, SUCHITRA_RUMOR } from "../../data/uttamkumar/suchitra";
import { PAGE_FAQ, PAGE_PATH, PAGE_SEO } from "../../data/seo";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import { buildJsonLd } from "../../lib/jsonld";
import { JsonLd } from "../../components/JsonLd";

export function UttamKumarSuchitraPage() {
  const seo = PAGE_SEO.uttamkumarSuchitra;
  useDocumentHead(seo, PAGE_PATH.uttamkumarSuchitra);

  const withHer = FILMS.filter((f) => f.detail?.withSuchitra);

  return (
    <UttamKumarLayout active="suchitra">
      <JsonLd data={buildJsonLd("uttamkumarSuchitra")} />
      <UkHero eyebrow="উত্তম-সুচিত্রা · The Pairing" h1={seo.h1} intro={seo.intro} />
      <UkFacts facts={seo.facts} />

      <UkSection id="story" heading="The Pairing">
        <UkProse paragraphs={[SUCHITRA_INTRO]} />
      </UkSection>

      <UkSection id="films" heading={`Films Together, Documented Here (${withHer.length})`}>
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
          {withHer.map((f, i) => (
            <FilmCard key={f.slug} film={f} index={i} />
          ))}
        </div>
        <p className="mt-3 text-[12.5px] text-uk-on-void-muted">
          Retrospectives commonly cite around 30 films together across their careers; the ones above
          are the subset this site has independently detailed and cited — see /uttamkumar/sources.
        </p>
      </UkSection>

      <UkSection id="rumor" heading="The Off-Screen Rumor">
        <UkProse paragraphs={[SUCHITRA_RUMOR]} />
        <UkNote label="Stated plainly —">
          Both were married to other people throughout. No source establishes anything beyond the
          rumor itself.
        </UkNote>
      </UkSection>

      <div className="mt-14">
        <UkFaq items={PAGE_FAQ.uttamkumarSuchitra} />
      </div>
    </UttamKumarLayout>
  );
}
