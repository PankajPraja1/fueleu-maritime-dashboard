import { useCallback, useEffect, useMemo, useState } from "react";
import type { Route } from "../../core/domain/types";
import { getRoutes, setBaseline } from "../../core/usecases/routes";
import { fuelEuApi } from "../../adapters/api/fuelEuApi";

export type RouteFilters = {
  vesselType: string;
  fuelType: string;
  year: string;
};

const emptyFilters: RouteFilters = {
  vesselType: "",
  fuelType: "",
  year: "",
};

export const useRoutes = () => {
  const [routes, setRoutesState] = useState<Route[]>([]);
  const [filters, setFilters] = useState<RouteFilters>(emptyFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getRoutes(fuelEuApi);
      setRoutesState(data || []);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load routes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filtered = useMemo(() => {
    return routes.filter((route) => {
      if (filters.vesselType && route.vesselType !== filters.vesselType)
        return false;
      if (filters.fuelType && route.fuelType !== filters.fuelType) return false;
      if (filters.year && route.year !== Number(filters.year)) return false;
      return true;
    });
  }, [routes, filters]);

  const setBaselineRoute = useCallback(
    async (routeId: string) => {
      setError(null);
      try {
        await setBaseline(fuelEuApi, routeId);
        await refresh();
      } catch (err: any) {
        setError(err?.message ?? "Failed to set baseline.");
      }
    },
    [refresh]
  );

  return {
    routes: filtered,
    allRoutes: routes,
    filters,
    setFilters,
    setBaselineRoute,
    loading,
    error,
  };
};
