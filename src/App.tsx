import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RoutePage } from "./pages/RoutePage";
import { BreakdownScreen } from "./components/BreakdownScreen";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoutePage routeId="kolkata" />} />
        <Route path="/kolkata" element={<Navigate to="/" replace />} />
        <Route path="/digha" element={<RoutePage routeId="digha" />} />
        <Route path="/darjeeling" element={<RoutePage routeId="darjeeling" />} />
        <Route path="/shantiniketan" element={<RoutePage routeId="shantiniketan" />} />
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
