CREATE TABLE "contractor" (
  "id" TEXT NOT NULL,
  "hoursPerWeek" INTEGER NOT NULL DEFAULT 0,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "contractor_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "contractor_id_fkey" FOREIGN KEY ("id") REFERENCES "supplierContact"("id"),
  CONSTRAINT "contractor_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "contractor_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);

ALTER TABLE "contractor" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with resources_view can view contractors" ON "contractor"
  FOR SELECT
  USING (
    coalesce(get_my_claim('resources_view')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with resources_create can insert contractors" ON "contractor"
  FOR INSERT
  WITH CHECK (   
    coalesce(get_my_claim('resources_create')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Employees with resources_update can update contractors" ON "contractor"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('resources_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with resources_delete can delete contractors" ON "contractor"
  FOR DELETE
  USING (
    coalesce(get_my_claim('resources_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );


CREATE TABLE "contractorAbility" (
  "contractorId" TEXT NOT NULL,
  "abilityId" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  CONSTRAINT "contractorAbility_pkey" PRIMARY KEY ("contractorId", "abilityId"),
  CONSTRAINT "contractorAbility_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "contractor"("id") ON DELETE CASCADE,
  CONSTRAINT "contractorAbility_abilityId_fkey" FOREIGN KEY ("abilityId") REFERENCES "ability"("id") ON DELETE CASCADE,
  CONSTRAINT "contractorAbility_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id")
);

ALTER TABLE "contractorAbility" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with resources_view can view contractorAbilities" ON "contractorAbility"
  FOR SELECT
  USING (
    coalesce(get_my_claim('resources_view')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with resources_create can insert contractorAbilities" ON "contractorAbility"
  FOR INSERT
  WITH CHECK (   
    coalesce(get_my_claim('resources_create')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Employees with resources_update can update contractorAbilities" ON "contractorAbility"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('resources_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with resources_delete can delete contractorAbilities" ON "contractorAbility"
  FOR DELETE
  USING (
    coalesce(get_my_claim('resources_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );


CREATE VIEW "contractors_view" AS
  SELECT 
    p.id AS "supplierContactId", 
    p."active", 
    p."hoursPerWeek", 
    s.id AS "supplierId", 
    s.name AS "supplierName", 
    c."firstName",
    c."lastName",
    c."email",
    array_agg(pa."abilityId") AS "abilityIds"
  FROM "contractor" p 
    INNER JOIN "supplierContact" sc 
      ON sc.id = p.id
    INNER JOIN "supplier" s
      ON s.id = sc."supplierId"
    INNER JOIN "contact" c 
      ON c.id = sc."contactId"
    INNER JOIN "contractorAbility" pa
      ON pa."contractorId" = p.id
  WHERE p."active" = true
  GROUP BY p.id, p.active, p."hoursPerWeek", s.id, c.id, s.name, c."firstName", c."lastName", c."email"
;