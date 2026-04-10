import type {
  BankApplyPayload,
  BankSurplusPayload,
  ComplianceBalanceParams,
  FuelEuApiPort,
} from "../ports/fuelEuApiPort";

export const getComplianceBalance = (
  api: FuelEuApiPort,
  params: ComplianceBalanceParams
) => api.getComplianceBalance(params);

export const bankSurplus = (api: FuelEuApiPort, payload: BankSurplusPayload) =>
  api.bankSurplus(payload);

export const applyBanked = (api: FuelEuApiPort, payload: BankApplyPayload) =>
  api.applyBanked(payload);
