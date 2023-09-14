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

CREATE TABLE "partnerAbility" (
  "partnerId" TEXT NOT NULL,
  "abilityId" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  CONSTRAINT "partnerAbility_pkey" PRIMARY KEY ("partnerId", "abilityId"),
  CONSTRAINT "partnerAbility_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partner"("id") ON DELETE CASCADE,
  CONSTRAINT "partnerAbility_abilityId_fkey" FOREIGN KEY ("abilityId") REFERENCES "ability"("id") ON DELETE CASCADE,
  CONSTRAINT "partnerAbility_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id")
);

CREATE VIEW "partners_view" AS
  SELECT 
    p.id AS "supplierLocationId", 
    p."active", 
    p."hoursPerWeek", 
    s.id AS "supplierId", 
    s.name AS "supplierName", 
    a.city,
    a.state,
    array_agg(pa."abilityId") AS "abilityIds"
  FROM "partner" p 
    INNER JOIN "supplierLocation" sl 
      ON sl.id = p.id
    INNER JOIN "supplier" s
      ON s.id = sl."supplierId"
    INNER JOIN "address" a 
      ON a.id = sl."addressId"
    INNER JOIN "partnerAbility" pa
      ON pa."partnerId" = p.id
  WHERE p."active" = true
  GROUP BY p.id, p.active, p."hoursPerWeek", s.id, a.id, s.name, a.city, a.state
;