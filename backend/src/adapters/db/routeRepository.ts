import type { RouteRepositoryPort } from "../../core/ports/routeRepository";
import { prisma } from "./prismaClient";

export const routeRepository: RouteRepositoryPort = {
  async listRoutes() {
    return prisma.route.findMany();
  },

  async findByRouteId(routeId: string) {
    return prisma.route.findFirst({ where: { routeId } });
  },

  async findByRouteIdYear(routeId: string, year: number) {
    return prisma.route.findFirst({ where: { routeId, year } });
  },

  async findByRouteIdsYear(routeIds: string[], year: number) {
    return prisma.route.findMany({
      where: { routeId: { in: routeIds }, year },
    });
  },

  async getBaseline() {
    return prisma.route.findFirst({ where: { isBaseline: true } });
  },

  async clearBaseline() {
    await prisma.route.updateMany({ data: { isBaseline: false } });
  },

  async setBaseline(routeId: string) {
    const updated = await prisma.route.updateMany({
      where: { routeId },
      data: { isBaseline: true },
    });

    if (updated.count === 0) return null;

    return prisma.route.findFirst({ where: { routeId } });
  },
};
