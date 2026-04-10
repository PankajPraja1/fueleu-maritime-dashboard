import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import BankingPage from "../BankingPage";

vi.mock("../../ui/hooks/useBanking", () => ({
  useBanking: () => ({
    balances: [{ shipId: "R001", year: 2024, cb: 1000 }],
    bankResult: null,
    applyResult: null,
    loading: false,
    error: null,
    loadBalances: vi.fn(),
    bank: vi.fn(),
    apply: vi.fn(),
  }),
}));

describe("BankingPage", () => {
  it("renders banking KPIs", () => {
    render(<BankingPage />);
    expect(screen.getByText("Banking Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Current CB: 1000.00")).toBeInTheDocument();
  });
});
