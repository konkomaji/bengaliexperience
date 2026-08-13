import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { TOTAL_TRACKS } from "../data/playlists";
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
 * The bus. One scene, and the driver's playlist running behind it.
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
  const { honk, honking, blasting, style: hornStyle } = useHorn({ onDuck: duck });

  const [queueOpen, setQueueOpen] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);

  const seo = PAGE_SEO.busdriver;
  useDocumentHead(seo, PAGE_PATH.busdriver);

  const nowPlaying = splitTitle(engine.track?.title ?? "", engine.track?.author ?? "");

  return (
    <>
      <JsonLd data={buildJsonLd("busdriver")} />
      <HeroScene honking={honking} shake={hornStyle.scene} shakeMs={hornStyle.sceneMs} />

      {/* No callout on press. A second badge appearing mid-screen was a second
          thing to read at the exact moment the horn is meant to be felt, not
          read: the sound, the scene rattle and the dancing heading say it. */}

      {/* pointer-events-none shell so the scene stays interactive; each
          interactive cluster opts back in */}
      <div className="pointer-events-none relative z-10 flex min-h-dvh flex-col">
        <Header aboard={aboard} />

        <main className="flex flex-1 flex-col items-center px-4 pb-4 pt-32 sm:pt-28">
          <Hero
            trackCount={TOTAL_TRACKS}
            onHonk={honk}
            blasting={blasting}
            letters={hornStyle.letters}
            letterMs={hornStyle.letterMs}
            staggerMs={hornStyle.staggerMs}
          />

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
