/*
  Warnings:

  - You are about to drop the column `image` on the `floor_plans` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_floor_plans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "pdf" TEXT,
    "projectId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "floor_plans_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_floor_plans" ("createdAt", "id", "name", "projectId", "updatedAt") SELECT "createdAt", "id", "name", "projectId", "updatedAt" FROM "floor_plans";
DROP TABLE "floor_plans";
ALTER TABLE "new_floor_plans" RENAME TO "floor_plans";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
