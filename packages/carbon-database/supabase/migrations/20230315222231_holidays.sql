CREATE TABLE "holiday" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "name" TEXT NOT NULL,
  "date" DATE NOT NULL,
  "year" INTEGER GENERATED ALWAYS AS (EXTRACT(YEAR FROM "date")) STORED,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP,

  CONSTRAINT "holiday_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "uq_holiday_date" UNIQUE ("date"),
  CONSTRAINT "holiday_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "holiday_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE VIEW "holiday_years" AS SELECT DISTINCT "year" FROM "holiday";