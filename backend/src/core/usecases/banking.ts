import { computeCb } from "../domain/compute";
import type { BankRepositoryPort } from "../ports/bankRepository";
import type { RouteRepositoryPort } from "../ports/routeRepository";

export const bankSurplus = async (
  routeRepo: RouteRepositoryPort,
  bankRepo: BankRepositoryPort,
  shipId: string,
  year: number
) => {
  const route = await routeRepo.findByRouteIdYear(shipId, year);
  if (!route) return null;

  const cb = computeCb(route);
  if (cb <= 0) {
    return { error: "Cannot bank deficit" } as const;
  }

  const entry = await bankRepo.createEntry(shipId, year, cb);
  return { entry } as const;
};

export const applyBanked = async (
  routeRepo: RouteRepositoryPort,
  bankRepo: BankRepositoryPort,
  shipId: string,
  year: number,
  amount: number
) => {
  const route = await routeRepo.findByRouteIdYear(shipId, year);
  if (!route) return null;

  const cb = computeCb(route);
  if (cb >= 0) {
    return { error: "No deficit to apply bank" } as const;
  }

  if (amount <= 0) {
    return { error: "Amount must be positive" } as const;
  }

  const banked = await bankRepo.listEntries({ year, shipId });
  const totalBanked = banked.reduce((sum, entry) => sum + entry.amount, 0);

  if (amount > totalBanked) {
    return { error: "Not enough banked surplus" } as const;
  }

  await bankRepo.createEntry(shipId, year, -amount);

  return {
    cb_before: cb,
    applied: amount,
    cb_after: cb + amount,
  } as const;
};
