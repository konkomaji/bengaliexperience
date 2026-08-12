import { useState } from "react";
import { Link } from "react-router-dom";
import { getRoute, ROUTES, type RouteId } from "../data/routes";
import { SONGS } from "../data/songs";
import { ROUTE_PATH, ROUTE_SEO } from "../data/seo";
import { BRAND } from "../data/brand";
import { buildJsonLd } from "../lib/jsonld";
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
  const engine = usePlayerEngine(SONGS);
  const aboard = useAboardCount();
  const honk = useHorn();

  const [queueOpen, setQueueOpen] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);

  const seo = ROUTE_SEO[routeId];
  useDocumentHead(seo, ROUTE_PATH[routeId]);

  return (
    <>
      <JsonLd data={buildJsonLd(routeId, route, SONGS)} />
      <HeroScene route={route} />

      {/* pointer-events-none on the shell so the scene stays interactive;
          each interactive cluster opts back in explicitly */}
      <div className="pointer-events-none relative z-10 flex min-h-dvh flex-col">
        <Header route={route} aboard={aboard} />

        <main className="flex flex-1 flex-col items-center px-4 pb-4 pt-32 sm:pt-28">
          <Hero route={route} trackCount={SONGS.length} onHonk={honk} />

          <p className="pointer-events-none mt-3 max-w-md text-center font-display text-xs text-white/75 sm:text-sm"
            style={{ textShadow: "0 1px 10px rgba(0,0,0,0.85)" }} lang="bn">
            {route.taglineBn}
          </p>

          <div className="flex-1" />

          <div className="flex w-full flex-col items-center gap-3">
            <Player
              engine={engine}
              queueSize={SONGS.length}
              onOpenQueue={() => setQueueOpen(true)}
              onOpenTicket={() => setTicketOpen(true)}
            />

            <footer className="pointer-events-auto w-full max-w-xl text-center text-[11px] text-on-surface-muted">
              <nav aria-label="All routes" className="mb-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
                {ROUTES.map((r) => (
                  <Link key={r.id} to={ROUTE_PATH[r.id]}
                    className="underline decoration-white/20 underline-offset-4 hover:text-on-surface hover:decoration-primary">
                    {r.nameEn}
                  </Link>
                ))}
              </nav>
              <p className="opacity-70">
                {BRAND.title} · streams official YouTube uploads, nothing rehosted.
              </p>
            </footer>
          </div>
        </main>
      </div>

      <QueueSheet
        open={queueOpen} onClose={() => setQueueOpen(false)}
        songs={SONGS} currentIndex={engine.currentIndex}
        isPlaying={engine.isPlaying} onPlay={(i) => { engine.playIndex(i); setQueueOpen(false); }}
      />
      <TicketSheet
        open={ticketOpen} onClose={() => setTicketOpen(false)}
        route={route} song={engine.currentSong}
      />
    </>
  );
}
