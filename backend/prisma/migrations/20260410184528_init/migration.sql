-- CreateTable
CREATE TABLE "Route" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "routeId" TEXT NOT NULL,
    "vesselType" TEXT NOT NULL,
    "fuelType" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "ghgIntensity" REAL NOT NULL,
    "fuelConsumption" REAL NOT NULL,
    "distance" REAL NOT NULL,
    "totalEmissions" REAL NOT NULL,
    "isBaseline" BOOLEAN NOT NULL DEFAULT false
);
