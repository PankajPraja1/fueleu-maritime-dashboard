import { act, renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useBanking } from "../useBanking";

const mockApi = {
  getComplianceBalance: vi.fn(),
  bankSurplus: vi.fn(),
  applyBanked: vi.fn(),
};

vi.mock("../../../adapters/api/fuelEuApi", () => ({
  fuelEuApi: mockApi,
}));

describe("useBanking", () => {
  beforeEach(() => {
    mockApi.getComplianceBalance.mockResolvedValue([
      { shipId: "R001", year: 2024, cb: 1000 },
    ]);
    mockApi.bankSurplus.mockResolvedValue({
      id: 1,
      shipId: "R001",
      year: 2024,
      amount: 1000,
    });
    mockApi.applyBanked.mockResolvedValue({
      cb_before: -500,
      applied: 250,
      cb_after: -250,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("loads compliance balance", async () => {
    const { result } = renderHook(() => useBanking());

    await act(async () => {
      await result.current.loadBalances(2024);
    });

    await waitFor(() => {
      expect(result.current.balances).toHaveLength(1);
    });
  });

  it("banks surplus and stores result", async () => {
    const { result } = renderHook(() => useBanking());

    await act(async () => {
      await result.current.bank({ year: 2024, shipId: "R001" });
    });

    expect(result.current.bankResult?.shipId).toBe("R001");
  });

  it("applies banked surplus", async () => {
    const { result } = renderHook(() => useBanking());

    await act(async () => {
      await result.current.apply({ year: 2024, shipId: "R001", amount: 250 });
    });

    expect(result.current.applyResult?.applied).toBe(250);
  });
});
