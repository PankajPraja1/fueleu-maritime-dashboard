import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useComparison } from "../useComparison";

const mockApi = {
  getComparison: vi.fn(),
};

vi.mock("../../../adapters/api/fuelEuApi", () => ({
  fuelEuApi: mockApi,
}));

describe("useComparison", () => {
  beforeEach(() => {
    mockApi.getComparison.mockResolvedValue({
      rows: [
        {
          routeId: "R001",
          ghgIntensity: 91,
          percentDiff: 0,
          compliant: false,
        },
      ],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("loads comparison rows", async () => {
    const { result } = renderHook(() => useComparison());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data.rows).toHaveLength(1);
  });
});
