import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { BusDriverPage } from "./pages/BusDriverPage";
import { BreakdownScreen } from "./components/BreakdownScreen";
import { MOVED_PATHS, PAGE_PATH } from "./data/seo";

/**
 * Two real pages: the collection, and the one experience that exists.
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
