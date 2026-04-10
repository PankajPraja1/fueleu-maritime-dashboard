import { Router } from "express";
import { getComparison } from "../../core/usecases/comparison";
import { listRoutes, setBaseline } from "../../core/usecases/routes";
import type { RouteRepositoryPort } from "../../core/ports/routeRepository";

export const createRoutesRouter = (routeRepo: RouteRepositoryPort) => {
  const router = Router();

  router.get("/", async (_req, res) => {
    const routes = await listRoutes(routeRepo);
    res.json(routes);
  });

  router.post("/:routeId/baseline", async (req, res) => {
    const { routeId } = req.params;

    const updated = await setBaseline(routeRepo, routeId);
    if (!updated) {
      return res.status(404).json({ error: "Route not found" });
    }

    res.json(updated);
  });

  router.get("/comparison", async (_req, res) => {
    const comparison = await getComparison(routeRepo);

    if (!comparison.baseline) {
      return res.status(400).json({ error: "No baseline set" });
    }

    res.json(comparison.rows);
  });

  return router;
};
