CREATE TABLE "partner" (
  "id" TEXT NOT NULL,
  "hoursPerWeek" INTEGER NOT NULL DEFAULT 0,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "partner_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "partner_id_fkey" FOREIGN KEY ("id") REFERENCES "supplierLocation"("id"),
  CONSTRAINT "partner_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "partner_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);

CREATE VIEW "partners_query" AS
  SELECT 
    p.id AS "supplierLocationId", 
    p."active", 
    p."hoursPerWeek", 
    s.id AS "supplierId", 
    s.name AS "supplierName", 
    a.* 
  FROM "partner" p 
    INNER JOIN "supplierLocation" sl 
      ON sl.id = p.id
    INNER JOIN "supplier" s
      ON s.id = sl."supplierId"
    INNER JOIN "address" a 
      ON a.id = sl."addressId"
;