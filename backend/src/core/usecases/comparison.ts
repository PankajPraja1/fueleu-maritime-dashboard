import { TARGET_GHG_INTENSITY } from "../domain/constants";
import type { ComparisonRow } from "../domain/types";
import type { RouteRepositoryPort } from "../ports/routeRepository";

export const getComparison = async (repo: RouteRepositoryPort) => {
  const routes = await repo.listRoutes();
  const baseline = await repo.getBaseline();

  if (!baseline) {
    return { baseline: null, rows: [] };
  }

  const rows: ComparisonRow[] = routes.map((route) => ({
    routeId: route.routeId,
    ghgIntensity: route.ghgIntensity,
    percentDiff: ((route.ghgIntensity / baseline.ghgIntensity) - 1) * 100,
    compliant: route.ghgIntensity <= TARGET_GHG_INTENSITY,
  }));

  return { baseline, rows };
};
