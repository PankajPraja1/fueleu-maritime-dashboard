import { useCallback, useEffect, useState } from "react";
import type { ComparisonResult } from "../../core/domain/types";
import { getComparison } from "../../core/usecases/comparison";
import { fuelEuApi } from "../../adapters/api/fuelEuApi";

export const useComparison = () => {
  const [data, setData] = useState<ComparisonResult>({ rows: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getComparison(fuelEuApi);
      setData(result);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load comparison.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
};
