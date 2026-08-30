import { Link } from "react-router-dom";
import { BRAND } from "../data/brand";
import { PAGE_PATH, PAGE_SEO } from "../data/seo";
import { buildJsonLd } from "../lib/jsonld";
import { useDocumentHead } from "../hooks/useDocumentHead";
import { JsonLd } from "../components/JsonLd";

/**
 * The one page every site running Google AdSense and Microsoft Clarity has
 * to have: what each collects, the cookies involved, and how to opt out. No
 * scene, no motion — a plain, static document, on purpose, so it reads as
 * exactly what it is rather than dressed up like an experience.
 */
export function PrivacyPolicyPage() {
  const seo = PAGE_SEO.privacy;
  useDocumentHead(seo, PAGE_PATH.privacy);

  return (
    <>
      <JsonLd data={buildJsonLd("privacy")} />

      <div className="mx-auto min-h-dvh w-full max-w-2xl px-5 pb-16 pt-safe sm:px-8">
        <header className="pt-10 sm:pt-16">
          <Link
            to={PAGE_PATH.home}
            className="text-[10px] font-semibold uppercase tracking-[0.32em] text-primary/90 sm:text-xs"
          >
            ← {BRAND.nameEn}
          </Link>
          <h1 className="font-display mt-3 text-3xl font-extrabold leading-[0.95] text-on-surface sm:text-4xl">
            {seo.h1}
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-on-surface-muted sm:text-base">{seo.intro}</p>
        </header>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-on-surface-muted sm:text-[15px]">
          <section>
            <h2 className="font-display text-lg font-bold text-on-surface">Google AdSense</h2>
            <p className="mt-2">
              This site may show ads served by Google AdSense. Google and its partners use cookies, including the
              DoubleClick cookie, to serve ads based on prior visits to this and other sites. Google's use of
              advertising cookies lets it and its partners serve ads based on your visits here and elsewhere on the
              internet.
            </p>
            <p className="mt-2">
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/20 underline-offset-4 hover:text-on-surface hover:decoration-primary"
              >
                How Google uses information from sites that use its services
              </a>
              {" · "}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/20 underline-offset-4 hover:text-on-surface hover:decoration-primary"
              >
                Manage or opt out of personalised advertising
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-on-surface">Microsoft Clarity</h2>
            <p className="mt-2">
              This site uses Microsoft Clarity for anonymised session replay and heatmaps, to see how the pages are
              actually used: which sections get scrolled to, which links get tapped, where people leave. It does not
              collect names, emails or anything typed into a form, because the site has none.
            </p>
            <p className="mt-2">
              <a
                href="https://privacy.microsoft.com/privacystatement"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/20 underline-offset-4 hover:text-on-surface hover:decoration-primary"
              >
                Microsoft Privacy Statement
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-on-surface">Your choices</h2>
            <p className="mt-2">
              A cookie banner is shown on first visit to any ad-carrying page, with the choice to accept or decline
              non-essential cookies. Declining still lets the site work exactly the same; it only stops ad
              personalisation and Clarity recording. Your choice is remembered in this browser and can be changed
              any time by clearing site data.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-on-surface">What this site does not do</h2>
            <p className="mt-2">
              No account, no login, no newsletter, no form anywhere on the site ever asks for a name, an email
              address or any personal detail. Nothing collected here is sold. What Google and Microsoft process as
              third-party vendors is governed by their own privacy policies, linked above, not by this site.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-on-surface">Children's privacy</h2>
            <p className="mt-2">
              This site is not directed at children under 13 and does not knowingly collect data from them.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-on-surface">Changes to this policy</h2>
            <p className="mt-2">
              If what this site collects or who it shares it with changes, this page is updated to say so. There is
              no separate notification list to sign up for, for the same reason there is no login: there isn't one.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-on-surface">Contact</h2>
            <p className="mt-2">
              Questions or requests about this policy, including asking what data, if any, is held about you:{" "}
              <a
                href="mailto:work.konkomaji@gmail.com"
                className="underline decoration-white/20 underline-offset-4 hover:text-on-surface hover:decoration-primary"
              >
                work.konkomaji@gmail.com
              </a>
              .
            </p>
          </section>
        </div>

        <footer className="mt-16 border-t border-outline-variant pt-6 text-[11px] leading-relaxed text-on-surface-muted/70">
          <p>
            <Link to={PAGE_PATH.home} className="underline decoration-white/20 underline-offset-4 hover:text-on-surface">
              Back to {BRAND.nameEn}
            </Link>
          </p>
        </footer>
      </div>
    </>
  );
}
