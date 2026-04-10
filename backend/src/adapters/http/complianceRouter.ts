import { Router } from "express";
import type { BankRepositoryPort } from "../../core/ports/bankRepository";
import type { RouteRepositoryPort } from "../../core/ports/routeRepository";
import {
  getAdjustedCbEntries,
  getComplianceBalances,
} from "../../core/usecases/compliance";

export const createComplianceRouter = (
  routeRepo: RouteRepositoryPort,
  bankRepo: BankRepositoryPort
) => {
  const router = Router();

  router.get("/cb", async (req, res) => {
    const yearParam = Number(req.query.year);
    const shipId = req.query.shipId ? String(req.query.shipId) : undefined;

    if (!yearParam) {
      return res.status(400).json({ error: "year is required" });
    }

    const balances = await getComplianceBalances(
      routeRepo,
      yearParam,
      shipId
    );
    res.json(balances);
  });

  router.get("/adjusted-cb", async (req, res) => {
    const yearParam = Number(req.query.year);

    if (!yearParam) {
      return res.status(400).json({ error: "year is required" });
    }

    const entries = await getAdjustedCbEntries(routeRepo, bankRepo, yearParam);
    res.json(entries);
  });

  return router;
};
