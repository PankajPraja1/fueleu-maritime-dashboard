import { computeCb } from "../domain/compute";
import type { PoolMember } from "../domain/types";
import type { RouteRepositoryPort } from "../ports/routeRepository";

export const createPool = async (
  routeRepo: RouteRepositoryPort,
  shipIds: string[],
  year: number
) => {
  const routes = await routeRepo.findByRouteIdsYear(shipIds, year);
  const members: PoolMember[] = routes.map((route) => ({
    shipId: route.routeId,
    cb_before: computeCb(route),
    cb_after: computeCb(route),
  }));

  const total = members.reduce((sum, member) => sum + member.cb_after, 0);
  if (total < 0) {
    return { error: "Pool not valid (total CB < 0)" } as const;
  }

  const surplus = members
    .filter((member) => member.cb_after > 0)
    .sort((a, b) => b.cb_after - a.cb_after);
  const deficit = members.filter((member) => member.cb_after < 0);

  for (const d of deficit) {
    let needed = -d.cb_after;

    for (const s of surplus) {
      if (needed <= 0) break;

      const transfer = Math.min(s.cb_after, needed);
      s.cb_after -= transfer;
      d.cb_after += transfer;
      needed -= transfer;
    }
  }

  const invalidDeficit = members.some(
    (member) => member.cb_after < member.cb_before
  );
  const invalidSurplus = members.some((member) => member.cb_after < 0);

  if (invalidDeficit || invalidSurplus) {
    return { error: "Pool allocation violates constraints" } as const;
  }

  return { members, total } as const;
};
