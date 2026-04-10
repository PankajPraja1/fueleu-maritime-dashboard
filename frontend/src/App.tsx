import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import RoutesPage from "./pages/RoutesPage";
import ComparePage from "./pages/ComparePage";
import BankingPage from "./pages/BankingPage";
import PoolsPage from "./pages/PoolsPage";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ALL DASHBOARD ROUTES WRAPPED IN LAYOUT */}
        <Route
          path="/"
          element={
            <DashboardLayout>
              <RoutesPage />
            </DashboardLayout>
          }
        />

        <Route
          path="/compare"
          element={
            <DashboardLayout>
              <ComparePage />
            </DashboardLayout>
          }
        />

        <Route
          path="/banking"
          element={
            <DashboardLayout>
              <BankingPage />
            </DashboardLayout>
          }
        />

        <Route
          path="/pools"
          element={
            <DashboardLayout>
              <PoolsPage />
            </DashboardLayout>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;