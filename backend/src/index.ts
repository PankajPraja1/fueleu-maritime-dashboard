import express from "express";
import cors from "cors";
import { createRoutesRouter } from "./adapters/http/routesRouter";
import { createComplianceRouter } from "./adapters/http/complianceRouter";
import { createBankingRouter } from "./adapters/http/bankingRouter";
import { createPoolsRouter } from "./adapters/http/poolsRouter";
import { routeRepository } from "./adapters/db/routeRepository";
import { bankRepository } from "./adapters/db/bankRepository";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("API Running");
});

app.use("/routes", createRoutesRouter(routeRepository));
app.use(
  "/compliance",
  createComplianceRouter(routeRepository, bankRepository)
);
app.use(
  "/banking",
  createBankingRouter(routeRepository, bankRepository)
);
app.use("/pools", createPoolsRouter(routeRepository));

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});