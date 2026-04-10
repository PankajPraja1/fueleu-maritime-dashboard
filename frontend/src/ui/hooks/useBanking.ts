import { useCallback, useState } from "react";
import type { BankApplyResult, BankRecord, ComplianceBalance } from "../../core/domain/types";
import {
  applyBanked,
  bankSurplus,
  getComplianceBalance,
} from "../../core/usecases/banking";
import { fuelEuApi } from "../../adapters/api/fuelEuApi";

export const useBanking = () => {
  const [balances, setBalances] = useState<ComplianceBalance[]>([]);
  const [bankResult, setBankResult] = useState<BankRecord | null>(null);
  const [applyResult, setApplyResult] = useState<BankApplyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBalances = useCallback(async (year: number, shipId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getComplianceBalance(fuelEuApi, { year, shipId });
      setBalances(result);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load compliance balance.");
    } finally {
      setLoading(false);
    }
  }, []);

  const bank = useCallback(async (payload: { year: number; shipId: string }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await bankSurplus(fuelEuApi, payload);
      setBankResult(result);
      return result;
    } catch (err: any) {
      setError(err?.response?.data?.error ?? err?.message ?? "Banking failed.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const apply = useCallback(
    async (payload: { year: number; shipId: string; amount: number }) => {
      setLoading(true);
      setError(null);

      try {
        const result = await applyBanked(fuelEuApi, payload);
        setApplyResult(result);
        return result;
      } catch (err: any) {
        setError(
          err?.response?.data?.error ?? err?.message ?? "Apply failed."
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    balances,
    bankResult,
    applyResult,
    loading,
    error,
    loadBalances,
    bank,
    apply,
  };
};
