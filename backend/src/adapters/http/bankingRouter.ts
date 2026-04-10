import { Router } from "express";
import type { BankRepositoryPort } from "../../core/ports/bankRepository";
import type { RouteRepositoryPort } from "../../core/ports/routeRepository";
import { applyBanked, bankSurplus } from "../../core/usecases/banking";

export const createBankingRouter = (
  routeRepo: RouteRepositoryPort,
  bankRepo: BankRepositoryPort
) => {
  const router = Router();

  router.post("/bank", async (req, res) => {
    const { shipId, year } = req.body as { shipId?: string; year?: number };

    if (!shipId || !year) {
      return res.status(400).json({ error: "shipId and year required" });
    }

    const result = await bankSurplus(routeRepo, bankRepo, shipId, year);
    if (!result) {
      return res.status(404).json({ error: "Route not found" });
    }

    if ("error" in result) {
      return res.status(400).json({ error: result.error });
    }

    return res.json(result.entry);
  });

  router.post("/apply", async (req, res) => {
    const { shipId, year, amount } = req.body as {
      shipId?: string;
      year?: number;
      amount?: number;
    };

    if (!shipId || !year || typeof amount !== "number") {
      return res
        .status(400)
        .json({ error: "shipId, year, and amount required" });
    }

    const result = await applyBanked(
      routeRepo,
      bankRepo,
      shipId,
      year,
      amount
    );
    if (!result) {
      return res.status(404).json({ error: "Route not found" });
    }

    if ("error" in result) {
      return res.status(400).json({ error: result.error });
    }

    return res.json(result);
  });

  router.get("/records", async (req, res) => {
    const year = req.query.year ? Number(req.query.year) : undefined;
    const shipId = req.query.shipId ? String(req.query.shipId) : undefined;

    const records = await bankRepo.listEntries({ year, shipId });
    res.json(records);
  });

  return router;
};
