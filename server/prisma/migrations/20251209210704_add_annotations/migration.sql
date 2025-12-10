-- CreateTable
CREATE TABLE "annotations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "width" REAL,
    "height" REAL,
    "endX" REAL,
    "endY" REAL,
    "text" TEXT,
    "color" TEXT NOT NULL DEFAULT '#8B0000',
    "distance" INTEGER,
    "floorPlanId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "annotations_floorPlanId_fkey" FOREIGN KEY ("floorPlanId") REFERENCES "floor_plans" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
