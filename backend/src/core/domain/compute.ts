import { ENERGY_FACTOR_MJ_PER_TON, TARGET_GHG_INTENSITY } from "./constants";
import type { Route } from "./types";

export const computeCb = (route: Route) => {
  const energy = route.fuelConsumption * ENERGY_FACTOR_MJ_PER_TON;
  return (TARGET_GHG_INTENSITY - route.ghgIntensity) * energy;
};
