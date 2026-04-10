import { computeCb } from "../domain/compute";
import type { AdjustedCbEntry, ComplianceBalance } from "../domain/types";
import type { BankRepositoryPort } from "../ports/bankRepository";
import type { RouteRepositoryPort } from "../ports/routeRepository";

export const getComplianceBalances = async (
  routeRepo: RouteRepositoryPort,
  year: number,
  shipId?: string
): Promise<ComplianceBalance[]> => {
  const routes = await routeRepo.listRoutes();
  const filtered = routes.filter((route) => {
    if (year && route.year !== year) return false;
    if (shipId && route.routeId !== shipId) return false;
    return true;
  });

  return filtered.map((route) => ({
    shipId: route.routeId,
    year: route.year,
    cb: computeCb(route),
  }));
};

export const getAdjustedCbEntries = async (
  routeRepo: RouteRepositoryPort,
  bankRepo: BankRepositoryPort,
  year: number
): Promise<AdjustedCbEntry[]> => {
  const routes = await routeRepo.listRoutes();
  const filtered = routes.filter((route) => route.year === year);

  const entries: AdjustedCbEntry[] = [];
  for (const route of filtered) {
    const banked = await bankRepo.listEntries({
      year,
      shipId: route.routeId,
    });
    const bankedTotal = banked.reduce((sum, entry) => sum + entry.amount, 0);
    const cbBefore = computeCb(route);

    entries.push({
      shipId: route.routeId,
      year,
      cb_before: cbBefore,
      cb_after: cbBefore + bankedTotal,
    });
  }

  return entries;
};
