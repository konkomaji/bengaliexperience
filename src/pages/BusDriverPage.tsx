import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { TOTAL_TRACKS } from "../data/playlists";
import { SCENE } from "../data/scene";
import { PAGE_PATH, PAGE_SEO } from "../data/seo";
import { BRAND } from "../data/brand";
import { buildJsonLd } from "../lib/jsonld";
import { splitTitle } from "../lib/title";
import { usePlayerEngine } from "../hooks/usePlayerEngine";
import { useDocumentHead } from "../hooks/useDocumentHead";
import { useAboardCount } from "../hooks/useAboardCount";
import { useHorn } from "../hooks/useHorn";
import { HeroScene } from "../components/HeroScene";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Player } from "../components/Player";
import { QueueSheet } from "../components/QueueSheet";
import { TicketSheet } from "../components/TicketSheet";
import { JsonLd } from "../components/JsonLd";

/**
 * The bus. One scene, one night, nine playlists behind it.
 *
 * This used to be four near-identical pages with a route chooser on top, and
 * switching route rerolled the playlist. Both are gone: there is one place
 * now, so there is nothing to switch and nothing to reroll.
 */
export function BusDriverPage() {
  const engine = usePlayerEngine();
  const aboard = useAboardCount();

  // the horn ducks the music under itself, then hands the volume back
  const { setDucked } = engine;
  const duck = useCallback((on: boolean) => setDucked(on), [setDucked]);
  const { honk, honking, blasting } = useHorn({ onDuck: duck });

  const [queueOpen, setQueueOpen] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);

  const seo = PAGE_SEO.busdriver;
  useDocumentHead(seo, PAGE_PATH.busdriver);

  const nowPlaying = splitTitle(engine.track?.title ?? "", engine.track?.author ?? "");

  return (
    <>
      <JsonLd data={buildJsonLd("busdriver")} />
      <HeroScene honking={honking} />

      {/* horn callout, on screen for the length of the blast rather than the
          shake, so it lasts as long as the sound does */}
      {blasting && (
        <div className="pointer-events-none fixed inset-x-0 top-[38%] z-20 flex justify-center">
          <span
            className="rounded-full border-2 border-[#2b1600] px-4 py-2 font-display text-sm font-extrabold text-[#2b1600] shadow-[0_6px_20px_rgba(0,0,0,0.5)]"
            style={{
              background: "linear-gradient(180deg, #ffdd55 0%, #ffa726 100%)",
              animation: "var(--animate-blast)",
            }}
          >
            HORN OK PLEASE
          </span>
        </div>
      )}

      {/* pointer-events-none shell so the scene stays interactive; each
          interactive cluster opts back in */}
      <div className="pointer-events-none relative z-10 flex min-h-dvh flex-col">
        <Header aboard={aboard} />

        <main className="flex flex-1 flex-col items-center px-4 pb-4 pt-32 sm:pt-28">
          <Hero trackCount={TOTAL_TRACKS} onHonk={honk} />

          <p
            className="pointer-events-none mt-3 max-w-md text-center font-display text-xs text-white/75 sm:text-sm"
            style={{ textShadow: "0 1px 10px rgba(0,0,0,0.85)" }}
          >
            {SCENE.tagline}
          </p>

          <div className="flex-1" />

          <div className="flex w-full flex-col items-center gap-3">
            <Player
              engine={engine}
              onOpenQueue={() => setQueueOpen(true)}
              onOpenTicket={() => setTicketOpen(true)}
              onHonk={honk}
            />

            <footer className="pointer-events-auto w-full max-w-xl text-center text-[11px] text-on-surface-muted">
              <p className="mb-2">
                <Link
                  to={PAGE_PATH.home}
                  className="underline decoration-white/20 underline-offset-4 hover:text-on-surface hover:decoration-primary"
                >
                  More from {BRAND.nameEn}
                </Link>
              </p>
              <p className="opacity-70">
                {seo.h1} · streams official YouTube uploads, nothing rehosted.
              </p>
            </footer>
          </div>
        </main>
      </div>

      <QueueSheet open={queueOpen} onClose={() => setQueueOpen(false)} engine={engine} />
      <TicketSheet
        open={ticketOpen}
        onClose={() => setTicketOpen(false)}
        song={engine.track ? { title: nowPlaying.title, artist: nowPlaying.artist } : undefined}
        seatNo={engine.index + 1}
      />
    </>
  );
}
