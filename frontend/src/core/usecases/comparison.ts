import type { FuelEuApiPort } from "../ports/fuelEuApiPort";

export const getComparison = (api: FuelEuApiPort) => api.getComparison();
