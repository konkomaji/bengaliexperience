import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RoutePage } from "./pages/RoutePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoutePage routeId="kolkata" />} />
        <Route path="/kolkata" element={<Navigate to="/" replace />} />
        <Route path="/digha" element={<RoutePage routeId="digha" />} />
        <Route path="/darjeeling" element={<RoutePage routeId="darjeeling" />} />
        <Route path="/shantiniketan" element={<RoutePage routeId="shantiniketan" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
