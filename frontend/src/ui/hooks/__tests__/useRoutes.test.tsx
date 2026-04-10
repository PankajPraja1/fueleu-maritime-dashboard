import { act, renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useRoutes } from "../useRoutes";

const mockApi = {
  getRoutes: vi.fn(),
  setBaseline: vi.fn(),
};

vi.mock("../../../adapters/api/fuelEuApi", () => ({
  fuelEuApi: mockApi,
}));

const routes = [
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
  {
    routeId: "R002",
    vesselType: "BulkCarrier",
    fuelType: "LNG",
    year: 2024,
    ghgIntensity: 88,
    fuelConsumption: 4800,
    distance: 11500,
    totalEmissions: 4200,
    isBaseline: false,
  },
];

describe("useRoutes", () => {
  beforeEach(() => {
    mockApi.getRoutes.mockResolvedValue(routes);
    mockApi.setBaseline.mockResolvedValue(routes[1]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("loads routes and filters by vessel type", async () => {
    const { result } = renderHook(() => useRoutes());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.routes).toHaveLength(2);

    act(() => {
      result.current.setFilters({
        vesselType: "Container",
        fuelType: "",
        year: "",
      });
    });

    expect(result.current.routes).toHaveLength(1);
    expect(result.current.routes[0].routeId).toBe("R001");
  });

  it("calls setBaseline and refreshes", async () => {
    const { result } = renderHook(() => useRoutes());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.setBaselineRoute("R002");
    });

    expect(mockApi.setBaseline).toHaveBeenCalledWith("R002");
    expect(mockApi.getRoutes).toHaveBeenCalledTimes(2);
  });
});
