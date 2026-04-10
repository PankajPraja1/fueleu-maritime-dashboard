import { useCallback, useState } from "react";
import type { AdjustedCbEntry, PoolMember } from "../../core/domain/types";
import { createPool, getAdjustedCb } from "../../core/usecases/pooling";
import { fuelEuApi } from "../../adapters/api/fuelEuApi";

export const usePooling = () => {
  const [entries, setEntries] = useState<AdjustedCbEntry[]>([]);
  const [members, setMembers] = useState<PoolMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEntries = useCallback(async (year: number) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getAdjustedCb(fuelEuApi, year);
      setEntries(result);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load adjusted CB.");
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (payload: { year: number; shipIds: string[] }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await createPool(fuelEuApi, payload);
      setMembers(result);
      return result;
    } catch (err: any) {
      setError(err?.response?.data?.error ?? err?.message ?? "Pool creation failed.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { entries, members, loading, error, loadEntries, create };
};
