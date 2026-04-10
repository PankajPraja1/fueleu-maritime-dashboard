import type { RouteRepositoryPort } from "../ports/routeRepository";

export const listRoutes = (repo: RouteRepositoryPort) => repo.listRoutes();

export const setBaseline = async (repo: RouteRepositoryPort, routeId: string) => {
  const route = await repo.findByRouteId(routeId);
  if (!route) return null;

  await repo.clearBaseline();
  return repo.setBaseline(routeId);
};
