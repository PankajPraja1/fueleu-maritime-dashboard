import type { FuelEuApiPort } from "../ports/fuelEuApiPort";

export const getRoutes = (api: FuelEuApiPort) => api.getRoutes();

export const setBaseline = (api: FuelEuApiPort, routeId: string) =>
  api.setBaseline(routeId);
