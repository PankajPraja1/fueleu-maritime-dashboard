import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import RoutesPage from "../RoutesPage";

vi.mock("../../ui/hooks/useRoutes", () => ({
  useRoutes: () => ({
    routes: [
      {
        routeId: "R001",
        vesselType: "Container",
        fuelType: "HFO",
        year: 2024,
        ghgIntensity: 91,
        fuelConsumption: 5000,
        distance: 12000,
        totalEmissions: 4500,
        isBaseline: true,
      },
    ],
    allRoutes: [],
    filters: { vesselType: "", fuelType: "", year: "" },
    setFilters: vi.fn(),
    setBaselineRoute: vi.fn(),
    loading: false,
    error: null,
  }),
}));

describe("RoutesPage", () => {
  it("renders routes table", () => {
    render(<RoutesPage />);
    expect(screen.getByText("Routes Dashboard")).toBeInTheDocument();
    expect(screen.getByText("R001")).toBeInTheDocument();
    expect(screen.getByText("Baseline")).toBeInTheDocument();
  });
});
