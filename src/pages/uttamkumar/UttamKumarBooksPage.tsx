import { UttamKumarLayout } from "../../components/uttamkumar/UttamKumarLayout";
import { UkFaq, UkFacts, UkHero, UkSection, UkStub } from "../../components/uttamkumar/shared";
import { BOOKS } from "../../data/uttamkumar/books";
import { PAGE_FAQ, PAGE_PATH, PAGE_SEO } from "../../data/seo";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import { buildJsonLd } from "../../lib/jsonld";
import { JsonLd } from "../../components/JsonLd";

/** A drawn book-spine card — no cover scans, see books.ts's own note on why. */
function BookSpine({ book }: { book: (typeof BOOKS)[number] }) {
  return (
    <div className="border-l-4 border-uk-gold bg-uk-void-dim p-4">
      <p className="uk-mono text-[10px] uppercase tracking-wide text-uk-gold">
        <UkStub>{book.year}</UkStub> {book.kind === "autobiography" ? "Autobiography" : "Biography"}
        {book.unfinished ? " · unfinished" : ""}
      </p>
      <p className="uk-marquee mt-1.5 text-[19px] text-uk-on-void">
        {book.title}
        {book.titleBn && <span className="ml-2 text-[14px] not-italic text-uk-on-void-muted">{book.titleBn}</span>}
      </p>
      <p className="mt-0.5 text-[12.5px] text-uk-on-void-muted">by {book.author}</p>
      <p className="mt-2 text-[13px] leading-relaxed text-uk-on-void-muted">{book.note}</p>
      {book.link && (
        <a href={book.link} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[12.5px] font-semibold text-uk-gold hover:underline">
          More about this book →
        </a>
      )}
    </div>
  );
}

export function UttamKumarBooksPage() {
  const seo = PAGE_SEO.uttamkumarBooks;
  useDocumentHead(seo, PAGE_PATH.uttamkumarBooks);

  return (
    <UttamKumarLayout active="books">
      <JsonLd data={buildJsonLd("uttamkumarBooks")} />
      <UkHero eyebrow="পাঠকক্ষ · The Reading Room" h1={seo.h1} intro={seo.intro} />
      <UkFacts facts={seo.facts} />

      <UkSection id="shelf" heading="The Shelf">
        <div className="grid gap-4 sm:grid-cols-2">
          {BOOKS.map((b) => (
            <BookSpine key={b.title} book={b} />
          ))}
        </div>
      </UkSection>

      <div className="mt-14">
        <UkFaq items={PAGE_FAQ.uttamkumarBooks} />
      </div>
    </UttamKumarLayout>
  );
}
