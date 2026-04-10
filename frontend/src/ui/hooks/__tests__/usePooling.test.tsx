import { act, renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { usePooling } from "../usePooling";

const mockApi = {
  getAdjustedCb: vi.fn(),
  createPool: vi.fn(),
};

vi.mock("../../../adapters/api/fuelEuApi", () => ({
  fuelEuApi: mockApi,
}));

describe("usePooling", () => {
  beforeEach(() => {
    mockApi.getAdjustedCb.mockResolvedValue([
      { shipId: "R001", year: 2024, cb_before: 100, cb_after: 100 },
    ]);
    mockApi.createPool.mockResolvedValue([
      { shipId: "R001", cb_before: 100, cb_after: 100 },
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("loads adjusted CB entries", async () => {
    const { result } = renderHook(() => usePooling());

    await act(async () => {
      await result.current.loadEntries(2024);
    });

    await waitFor(() => {
      expect(result.current.entries).toHaveLength(1);
    });
  });

  it("creates pool members", async () => {
    const { result } = renderHook(() => usePooling());

    await act(async () => {
      await result.current.create({ year: 2024, shipIds: ["R001"] });
    });

    expect(result.current.members).toHaveLength(1);
  });
});
