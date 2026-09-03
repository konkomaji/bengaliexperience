import { Link, Navigate, useParams } from "react-router-dom";
import { UttamKumarLayout } from "../../components/uttamkumar/UttamKumarLayout";
import { UkFacts, UkHero } from "../../components/uttamkumar/shared";
import { FILMS } from "../../data/uttamkumar/films";
import { filmDescription, filmTitle } from "../../data/uttamkumar/dynamicSeo";
import { PAGE_PATH, UTTAMKUMAR_FILM_PREFIX } from "../../data/seo";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import { buildUttamKumarFilmJsonLd } from "../../data/uttamkumar/jsonld";
import { JsonLd } from "../../components/JsonLd";
import { ArrowRightIcon } from "../../components/icons";

export function UttamKumarFilmPage() {
  const { slug } = useParams<{ slug: string }>();
  const film = FILMS.find((f) => f.slug === slug);

  // Fires the document-head hook unconditionally, satisfying rules-of-hooks,
  // before the redirect below can short-circuit render — the fallback
  // strings are never actually seen (the redirect happens first paint).
  useDocumentHead(
    film
      ? { title: filmTitle(film), description: filmDescription(film), keywords: [], h1: film.title, intro: filmDescription(film), facts: [] }
      : { title: "Not found", description: "", keywords: [], h1: "", intro: "", facts: [] },
    film ? `${UTTAMKUMAR_FILM_PREFIX}/${film.slug}` : PAGE_PATH.uttamkumarFilms,
  );

  if (!film) return <Navigate to={PAGE_PATH.uttamkumarFilms} replace />;
  const d = film.detail;

  return (
    <UttamKumarLayout active="films">
      <JsonLd data={buildUttamKumarFilmJsonLd(film)} />
      <UkHero eyebrow={`${film.year} · Film ${film.order} of 211`} h1={film.title} intro={d?.synopsis ?? filmDescription(film)} />
      <UkFacts
        facts={[
          `Year: ${film.year}`,
          ...(d?.director ? [`Director: ${d.director}`] : []),
          ...(d?.coStars?.length ? [`Co-stars: ${d.coStars.join(", ")}`] : []),
          ...(film.role ? [`Role: ${film.role}`] : []),
          ...(film.note ? [`Note: ${film.note}`] : []),
          ...(d?.significance ? [`Significance: ${d.significance}`] : []),
        ]}
      />
      <Link to={PAGE_PATH.uttamkumarFilms} className="mt-8 inline-flex items-center gap-1.5 text-[13px] font-semibold text-uk-gold hover:underline">
        <span className="rotate-180"><ArrowRightIcon size={12} /></span> All films
      </Link>
    </UttamKumarLayout>
  );
}
