CREATE TABLE "partner" (
  "id" TEXT NOT NULL,
  "hoursPerWeek" INTEGER NOT NULL DEFAULT 0,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "partner_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "partner_id_fkey" FOREIGN KEY ("id") REFERENCES "supplier"("id"),
  CONSTRAINT "partner_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "partner_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);