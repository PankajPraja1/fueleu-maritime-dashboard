import type { FuelEuApiPort, PoolCreatePayload } from "../ports/fuelEuApiPort";

export const getAdjustedCb = (api: FuelEuApiPort, year: number) =>
  api.getAdjustedCb(year);

export const createPool = (api: FuelEuApiPort, payload: PoolCreatePayload) =>
  api.createPool(payload);
