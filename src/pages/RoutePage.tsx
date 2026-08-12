import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getRoute, ROUTES, type RouteId } from "../data/routes";
import { TOTAL_TRACKS } from "../data/playlists";
import { ROUTE_PATH, ROUTE_SEO } from "../data/seo";
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

export function RoutePage({ routeId }: { routeId: RouteId }) {
  const route = getRoute(routeId);
  const engine = usePlayerEngine();
  const aboard = useAboardCount();

  // the horn ducks the music under itself, then hands the volume back
  const { setDucked } = engine;
  const duck = useCallback((on: boolean) => setDucked(on), [setDucked]);
  const { honk, honking, blasting } = useHorn({ onDuck: duck });

  const [queueOpen, setQueueOpen] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);

  // new place, new music — the routes share one player, so changing scene has
  // to change the playlist deliberately or the ride sounds identical
  const lastRoute = useRef(routeId);
  const { rollPlaylist } = engine;
  useEffect(() => {
    if (lastRoute.current === routeId) return;
    lastRoute.current = routeId;
    rollPlaylist();
  }, [routeId, rollPlaylist]);

  const seo = ROUTE_SEO[routeId];
  useDocumentHead(seo, ROUTE_PATH[routeId]);

  const nowPlaying = splitTitle(engine.track?.title ?? "", engine.track?.author ?? "");

  return (
    <>
      <JsonLd data={buildJsonLd(routeId, route)} />
      <HeroScene route={route} honking={honking} />

      {/* horn callout — on screen for the length of the blast, not just the
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
        <Header route={route} aboard={aboard} />

        <main className="flex flex-1 flex-col items-center px-4 pb-4 pt-32 sm:pt-28">
          <Hero route={route} trackCount={TOTAL_TRACKS} onHonk={honk} />

          <p className="pointer-events-none mt-3 max-w-md text-center font-display text-xs text-white/75 sm:text-sm"
            style={{ textShadow: "0 1px 10px rgba(0,0,0,0.85)" }}>
            {route.tagline}
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
              <nav aria-label="All routes" className="mb-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
                {ROUTES.map((r) => (
                  <Link key={r.id} to={ROUTE_PATH[r.id]}
                    className="underline decoration-white/20 underline-offset-4 hover:text-on-surface hover:decoration-primary">
                    {r.name}
                  </Link>
                ))}
              </nav>
              <p className="opacity-70">
                {BRAND.seoTitle} · streams official YouTube uploads, nothing rehosted.
              </p>
            </footer>
          </div>
        </main>
      </div>

      <QueueSheet open={queueOpen} onClose={() => setQueueOpen(false)} engine={engine} />
      <TicketSheet
        open={ticketOpen}
        onClose={() => setTicketOpen(false)}
        route={route}
        song={engine.track ? { title: nowPlaying.title, artist: nowPlaying.artist } : undefined}
        seatNo={engine.index + 1}
      />
    </>
  );
}
