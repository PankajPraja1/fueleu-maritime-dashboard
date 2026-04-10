import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import ComparePage from "../ComparePage";

vi.mock("../../ui/hooks/useComparison", () => ({
  useComparison: () => ({
    data: {
      rows: [
        {
          routeId: "R001",
          ghgIntensity: 91,
          percentDiff: 0,
          compliant: false,
        },
      ],
    },
    loading: false,
    error: null,
  }),
}));

describe("ComparePage", () => {
  it("renders comparison table", () => {
    render(<ComparePage />);
    expect(screen.getByText("Route Emission Comparison Dashboard")).toBeInTheDocument();
    expect(screen.getByText("R001")).toBeInTheDocument();
    expect(screen.getByText("0.00%")).toBeInTheDocument();
  });
});
