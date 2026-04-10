import type {
  AdjustedCbEntry,
  BankApplyResult,
  BankRecord,
  ComparisonResult,
  ComparisonRow,
  ComplianceBalance,
  PoolMember,
  Route,
} from "../../core/domain/types";
import type {
  BankApplyPayload,
  BankSurplusPayload,
  ComplianceBalanceParams,
  FuelEuApiPort,
  PoolCreatePayload,
} from "../../core/ports/fuelEuApiPort";
import { httpClient } from "./httpClient";

const TARGET = 89.3368;

const computePercentDiff = (baseline: number, comparison: number) =>
  baseline === 0 ? 0 : ((comparison / baseline) - 1) * 100;

const normalizeComparison = (data: unknown): ComparisonResult => {
  if (Array.isArray(data)) {
    const rows: ComparisonRow[] = data.map((item: any) => {
      const ghg = Number(item.ghgIntensity ?? item.ghg_intensity ?? 0);
      const baselineIntensity = Number(item.baselineGhgIntensity ?? 0);
      const percentDiff =
        typeof item.percentDiff === "number"
          ? item.percentDiff
          : computePercentDiff(baselineIntensity, ghg);

      return {
        routeId: String(item.routeId ?? item.route ?? ""),
        ghgIntensity: ghg,
        percentDiff,
        compliant:
          typeof item.compliant === "boolean"
            ? item.compliant
            : ghg <= TARGET,
        isBaseline: Boolean(item.isBaseline),
      };
    });

    return { rows };
  }

  const payload = data as any;
  if (payload && payload.baseline && payload.comparisons) {
    const baseline = payload.baseline as Route;
    const rows: ComparisonRow[] = (payload.comparisons as any[]).map((item) => {
      const ghg = Number(item.ghgIntensity ?? item.ghg_intensity ?? 0);
      return {
        routeId: String(item.routeId ?? item.route ?? ""),
        ghgIntensity: ghg,
        percentDiff: computePercentDiff(baseline.ghgIntensity, ghg),
        compliant: ghg <= TARGET,
        isBaseline: false,
      };
    });

    return { baseline, rows };
  }

  return { rows: [] };
};

const normalizeCompliance = (
  data: unknown,
  params: ComplianceBalanceParams
): ComplianceBalance[] => {
  if (Array.isArray(data)) {
    return data.map((item: any) => ({
      shipId: String(item.shipId ?? item.routeId ?? ""),
      year: params.year,
      cb: Number(item.cb ?? item.cb_gco2eq ?? 0),
    }));
  }

  const payload = data as any;
  if (payload && typeof payload.cb === "number") {
    return [
      {
        shipId: payload.shipId ? String(payload.shipId) : params.shipId,
        year: params.year,
        cb: payload.cb,
      },
    ];
  }

  return [];
};

const normalizeAdjustedCb = (data: unknown, year: number): AdjustedCbEntry[] => {
  if (!Array.isArray(data)) return [];

  return data.map((item: any) => {
    const cbBefore = Number(item.cb_before ?? item.cb ?? 0);
    const cbAfter = Number(item.cb_after ?? item.cb ?? 0);

    return {
      shipId: String(item.shipId ?? item.routeId ?? ""),
      year: Number(item.year ?? year),
      cb_before: cbBefore,
      cb_after: cbAfter,
    };
  });
};

const normalizeBankRecord = (data: any): BankRecord => {
  if (data && data.entry) {
    return {
      id: data.entry.id,
      shipId: String(data.entry.shipId ?? data.entry.routeId ?? ""),
      year: Number(data.entry.year ?? 0),
      amount: Number(data.entry.amount ?? data.entry.credits ?? 0),
      status: data.entry.status,
    };
  }

  return {
    id: data?.id,
    shipId: String(data?.shipId ?? data?.routeId ?? ""),
    year: Number(data?.year ?? 0),
    amount: Number(data?.amount ?? data?.credits ?? 0),
    status: data?.status,
  };
};

const normalizePoolMembers = (data: any): PoolMember[] => {
  const list = Array.isArray(data?.members)
    ? data.members
    : Array.isArray(data?.result)
    ? data.result
    : Array.isArray(data)
    ? data
    : [];

  return list.map((item: any) => ({
    shipId: String(item.shipId ?? item.routeId ?? ""),
    cb_before: Number(item.cb_before ?? item.cb ?? 0),
    cb_after: Number(item.cb_after ?? item.cb ?? 0),
  }));
};

export const fuelEuApi: FuelEuApiPort = {
  async getRoutes() {
    const res = await httpClient.get("/routes");
    return res.data as Route[];
  },

  async setBaseline(routeId: string) {
    const res = await httpClient.post(`/routes/${routeId}/baseline`);
    return res.data as Route;
  },

  async getComparison() {
    const res = await httpClient.get("/routes/comparison");
    return normalizeComparison(res.data);
  },

  async getComplianceBalance(params: ComplianceBalanceParams) {
    const res = await httpClient.get("/compliance/cb", { params });
    return normalizeCompliance(res.data, params);
  },

  async getAdjustedCb(year: number) {
    const res = await httpClient.get("/compliance/adjusted-cb", {
      params: { year },
    });
    return normalizeAdjustedCb(res.data, year);
  },

  async bankSurplus(payload: BankSurplusPayload) {
    const res = await httpClient.post("/banking/bank", payload);
    return normalizeBankRecord(res.data);
  },

  async applyBanked(payload: BankApplyPayload) {
    const res = await httpClient.post("/banking/apply", payload);
    return res.data as BankApplyResult;
  },

  async createPool(payload: PoolCreatePayload) {
    const res = await httpClient.post("/pools", payload);
    return normalizePoolMembers(res.data);
  },
};
