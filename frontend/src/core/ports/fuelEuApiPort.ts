import type {
  AdjustedCbEntry,
  BankApplyResult,
  BankRecord,
  ComparisonResult,
  ComplianceBalance,
  PoolMember,
  Route,
} from "../domain/types";

export type ComplianceBalanceParams = {
  year: number;
  shipId?: string;
};

export type BankSurplusPayload = {
  year: number;
  shipId: string;
};

export type BankApplyPayload = {
  year: number;
  shipId: string;
  amount: number;
};

export type PoolCreatePayload = {
  year: number;
  shipIds: string[];
};

export interface FuelEuApiPort {
  getRoutes(): Promise<Route[]>;
  setBaseline(routeId: string): Promise<Route>;
  getComparison(): Promise<ComparisonResult>;
  getComplianceBalance(
    params: ComplianceBalanceParams
  ): Promise<ComplianceBalance[]>;
  getAdjustedCb(year: number): Promise<AdjustedCbEntry[]>;
  bankSurplus(payload: BankSurplusPayload): Promise<BankRecord>;
  applyBanked(payload: BankApplyPayload): Promise<BankApplyResult>;
  createPool(payload: PoolCreatePayload): Promise<PoolMember[]>;
}
