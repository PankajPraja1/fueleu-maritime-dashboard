import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import PoolsPage from "../PoolsPage";

vi.mock("../../ui/hooks/usePooling", () => ({
  usePooling: () => ({
    entries: [
      { shipId: "R001", year: 2024, cb_before: -10, cb_after: -10 },
    ],
    members: [],
    loading: false,
    error: null,
    loadEntries: vi.fn(),
    create: vi.fn(),
  }),
}));

describe("PoolsPage", () => {
  it("renders pooling table", () => {
    render(<PoolsPage />);
    expect(screen.getByText("Emission Credit Pools")).toBeInTheDocument();
    expect(screen.getByText("R001")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Pool" })).toBeDisabled();
  });
});
