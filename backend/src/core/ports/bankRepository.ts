import type { BankEntry } from "../domain/types";

export type BankEntryFilter = {
  year?: number;
  shipId?: string;
};

export interface BankRepositoryPort {
  createEntry(shipId: string, year: number, amount: number): Promise<BankEntry>;
  listEntries(filter?: BankEntryFilter): Promise<BankEntry[]>;
}
