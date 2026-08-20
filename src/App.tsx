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
import { MOVED_PATHS, PAGE_PATH } from "./data/seo";

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
    </BrowserRouter>
  );
}
