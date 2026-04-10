import { Router } from "express";
import type { RouteRepositoryPort } from "../../core/ports/routeRepository";
import { createPool } from "../../core/usecases/pooling";

export const createPoolsRouter = (routeRepo: RouteRepositoryPort) => {
  const router = Router();

  router.post("/", async (req, res) => {
    const { shipIds, year } = req.body as {
      shipIds?: string[];
      year?: number;
    };

    if (!Array.isArray(shipIds) || shipIds.length === 0 || !year) {
      return res.status(400).json({ error: "shipIds and year required" });
    }

    const result = await createPool(routeRepo, shipIds, year);
    if ("error" in result) {
      return res.status(400).json({ error: result.error });
    }

    return res.json({ members: result.members, total: result.total });
  });

  return router;
};
