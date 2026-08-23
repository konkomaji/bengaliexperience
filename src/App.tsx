import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { BusDriverPage } from "./pages/BusDriverPage";
import { MahalayaPage } from "./pages/MahalayaPage";
import { TarakeswarHubPage } from "./pages/tarakeswar/TarakeswarHubPage";
import { TarakeswarTemplePage } from "./pages/tarakeswar/TarakeswarTemplePage";
import { TarakeswarFoodPage } from "./pages/tarakeswar/TarakeswarFoodPage";
import { TarakeswarReachPage } from "./pages/tarakeswar/TarakeswarReachPage";
import { TarakeswarBlogIndexPage } from "./pages/tarakeswar/TarakeswarBlogIndexPage";
import { TarakeswarBlogPostPage } from "./pages/tarakeswar/TarakeswarBlogPostPage";
import { BreakdownScreen } from "./components/BreakdownScreen";
import { KABIRSUMAN_ALBUM_PREFIX, KABIRSUMAN_SONG_PREFIX, MOVED_PATHS, PAGE_PATH } from "./data/seo";

/**
 * The Kabir Suman section is lazy-loaded, not imported at the top like every
 * other page. Its catalogue (30 albums' worth of metadata plus a song index)
 * is real data, not a component, and importing any of its pages eagerly pulls
 * that data into the one shared bundle every visitor downloads — including
 * someone who only ever opens the bus. Split here, it downloads only when a
 * visitor actually goes to /kabirsuman.
 */
const KabirSumanHubPage = lazy(() => import("./pages/kabirsuman/KabirSumanHubPage").then((m) => ({ default: m.KabirSumanHubPage })));
const KabirSumanLifePage = lazy(() => import("./pages/kabirsuman/KabirSumanLifePage").then((m) => ({ default: m.KabirSumanLifePage })));
const KabirSumanWorksPage = lazy(() => import("./pages/kabirsuman/KabirSumanWorksPage").then((m) => ({ default: m.KabirSumanWorksPage })));
const KabirSumanAlbumPage = lazy(() => import("./pages/kabirsuman/KabirSumanAlbumPage").then((m) => ({ default: m.KabirSumanAlbumPage })));
const KabirSumanSongPage = lazy(() => import("./pages/kabirsuman/KabirSumanSongPage").then((m) => ({ default: m.KabirSumanSongPage })));
const KabirSumanWordsPage = lazy(() => import("./pages/kabirsuman/KabirSumanWordsPage").then((m) => ({ default: m.KabirSumanWordsPage })));
const KabirSumanSourcesPage = lazy(() => import("./pages/kabirsuman/KabirSumanSourcesPage").then((m) => ({ default: m.KabirSumanSourcesPage })));

/**
 * The collection (home, the bus, Mahalaya), plus the Tarakeswar section: a
 * separate local guide living at its own URLs, not part of the collection
 * and not linked from it (see src/data/seo.ts and src/data/tarakeswar/).
 *
 * The four old route URLs are redirected rather than dropped. The edge sends
 * a 301 for them (functions/_middleware.ts), which is what a crawler needs;
 * these client-side redirects are for the case where a visitor is already in
 * the app and follows an old in-page link.
 */
export default function App() {
  return (
    <BrowserRouter>
      {/* Only the seven lazy Kabir Suman routes ever suspend; every eager
          page above resolves synchronously and never shows this fallback. */}
      <Suspense fallback={null}>
      <Routes>
        <Route path={PAGE_PATH.home} element={<HomePage />} />
        <Route path={PAGE_PATH.busdriver} element={<BusDriverPage />} />
        <Route path={PAGE_PATH.mahalaya} element={<MahalayaPage />} />

        {/* Tarakeswar: a separate local guide, not one of the experiences
            above and not linked from this project's own home page or nav
            (see src/data/seo.ts). Five routes of its own. */}
        <Route path={PAGE_PATH.tarakeswar} element={<TarakeswarHubPage />} />
        <Route path={PAGE_PATH.tarakeswarTemple} element={<TarakeswarTemplePage />} />
        <Route path={PAGE_PATH.tarakeswarFood} element={<TarakeswarFoodPage />} />
        <Route path={PAGE_PATH.tarakeswarReach} element={<TarakeswarReachPage />} />
        <Route path={PAGE_PATH.tarakeswarBlog} element={<TarakeswarBlogIndexPage />} />
        <Route path={`${PAGE_PATH.tarakeswarBlog}/:slug`} element={<TarakeswarBlogPostPage />} />

        {/* Kabir Suman: a tribute archive, not one of the experiences above
            and not one of the Tarakeswar routes — its own section, linked
            from the home page under its own heading (see
            src/data/tributes.ts). Two routes are dynamic (30 albums, 317
            songs), so they take a :slug rather than living in PAGE_PATH. */}
        <Route path={PAGE_PATH.kabirsuman} element={<KabirSumanHubPage />} />
        <Route path={PAGE_PATH.kabirsumanLife} element={<KabirSumanLifePage />} />
        <Route path={PAGE_PATH.kabirsumanWorks} element={<KabirSumanWorksPage />} />
        <Route path={`${KABIRSUMAN_ALBUM_PREFIX}/:slug`} element={<KabirSumanAlbumPage />} />
        <Route path={`${KABIRSUMAN_SONG_PREFIX}/:slug`} element={<KabirSumanSongPage />} />
        <Route path={PAGE_PATH.kabirsumanWords} element={<KabirSumanWordsPage />} />
        <Route path={PAGE_PATH.kabirsumanSources} element={<KabirSumanSourcesPage />} />

        {Object.entries(MOVED_PATHS).map(([from, to]) => (
          <Route key={from} path={from} element={<Navigate to={to} replace />} />
        ))}

        {/* unknown path: same breakdown screen, different copy */}
        <Route
          path="*"
          element={
            <BreakdownScreen
              title="Wrong stop."
              message="This route does not exist. The driver is having a chai while you figure out where you meant to go."
              action="Take me to the bus"
            />
          }
        />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
