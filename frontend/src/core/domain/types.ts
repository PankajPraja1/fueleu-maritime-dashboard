export type Route = {
  id?: number;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline?: boolean;
};

export type ComparisonRow = {
  routeId: string;
  ghgIntensity: number;
  percentDiff: number;
  compliant: boolean;
  isBaseline?: boolean;
};

export type ComparisonResult = {
  baseline?: Route;
  rows: ComparisonRow[];
};

export type ComplianceBalance = {
  shipId?: string;
  year: number;
  cb: number;
};

export type AdjustedCbEntry = {
  shipId: string;
  year: number;
  cb_before: number;
  cb_after: number;
};

export type BankRecord = {
  id?: number;
  shipId: string;
  year: number;
  amount: number;
  status?: string;
};

export type BankApplyResult = {
  cb_before: number;
  applied: number;
  cb_after: number;
};

export type PoolMember = {
  shipId: string;
  cb_before: number;
  cb_after: number;
};

export type PoolResult = {
  members: PoolMember[];
  total: number;
};
