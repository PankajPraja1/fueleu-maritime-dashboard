-- CreateTable
CREATE TABLE "BankEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shipId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "amount" REAL NOT NULL
);
