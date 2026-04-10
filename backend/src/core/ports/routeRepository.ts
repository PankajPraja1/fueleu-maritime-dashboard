import type { Route } from "../domain/types";

export interface RouteRepositoryPort {
  listRoutes(): Promise<Route[]>;
  findByRouteId(routeId: string): Promise<Route | null>;
  findByRouteIdYear(routeId: string, year: number): Promise<Route | null>;
  findByRouteIdsYear(routeIds: string[], year: number): Promise<Route[]>;
  getBaseline(): Promise<Route | null>;
  clearBaseline(): Promise<void>;
  setBaseline(routeId: string): Promise<Route | null>;
}
