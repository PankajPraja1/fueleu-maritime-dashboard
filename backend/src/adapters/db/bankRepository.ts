import type {
  BankEntryFilter,
  BankRepositoryPort,
} from "../../core/ports/bankRepository";
import { prisma } from "./prismaClient";

export const bankRepository: BankRepositoryPort = {
  async createEntry(shipId: string, year: number, amount: number) {
    return prisma.bankEntry.create({
      data: { shipId, year, amount },
    });
  },

  async listEntries(filter?: BankEntryFilter) {
    return prisma.bankEntry.findMany({
      where: {
        year: filter?.year,
        shipId: filter?.shipId,
      },
    });
  },
};
