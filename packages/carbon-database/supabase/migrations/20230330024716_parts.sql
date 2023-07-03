CREATE TABLE "partGroup" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "name" TEXT NOT NULL,
  "description" TEXT,
  "salesAccountId" TEXT,
  "discountAccountId" TEXT,
  "inventoryAccountId" TEXT,
  "costOfGoodsSoldLaborAccountId" TEXT,
  "costOfGoodsSoldMaterialAccountId" TEXT,
  "costOfGoodsSoldOverheadAccountId" TEXT,
  "costOfGoodsSoldSubcontractorAccountId" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "partGroup_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "partGroup_name_key" UNIQUE ("name"),
  CONSTRAINT "partGroup_salesAccountId_fkey" FOREIGN KEY ("salesAccountId") REFERENCES "account"("number") ON DELETE CASCADE,
  CONSTRAINT "partGroup_discountAccountId_fkey" FOREIGN KEY ("discountAccountId") REFERENCES "account"("number") ON DELETE CASCADE,
  CONSTRAINT "partGroup_inventoryAccountId_fkey" FOREIGN KEY ("inventoryAccountId") REFERENCES "account"("number") ON DELETE CASCADE,
  CONSTRAINT "partGroup_costOfGoodsSoldLaborAccountId_fkey" FOREIGN KEY ("costOfGoodsSoldLaborAccountId") REFERENCES "account"("number") ON DELETE CASCADE,
  CONSTRAINT "partGroup_costOfGoodsSoldMaterialAccountId_fkey" FOREIGN KEY ("costOfGoodsSoldMaterialAccountId") REFERENCES "account"("number") ON DELETE CASCADE,
  CONSTRAINT "partGroup_costOfGoodsSoldOverheadAccountId_fkey" FOREIGN KEY ("costOfGoodsSoldOverheadAccountId") REFERENCES "account"("number") ON DELETE CASCADE,
  CONSTRAINT "partGroup_costOfGoodsSoldSubcontractorAccountId_fkey" FOREIGN KEY ("costOfGoodsSoldSubcontractorAccountId") REFERENCES "account"("number") ON DELETE CASCADE,
  CONSTRAINT "partGroup_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "partGroup_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);

ALTER TABLE "partGroup" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with parts_view can view part groups" ON "partGroup"
  FOR SELECT
  USING (
    coalesce(get_my_claim('parts_view')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );
  

CREATE POLICY "Employees with parts_create can insert part groups" ON "partGroup"
  FOR INSERT
  WITH CHECK (   
    coalesce(get_my_claim('parts_create')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Employees with parts_update can update part groups" ON "partGroup"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('parts_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with parts_delete can delete part groups" ON "partGroup"
  FOR DELETE
  USING (
    coalesce(get_my_claim('parts_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE TYPE "partType" AS ENUM (
  'Inventory',
  'Non-Inventory',
  'Service'
);

CREATE TYPE "partReplenishmentSystem" AS ENUM (
  'Buy',
  'Make',
  'Buy and Make'
);

CREATE TYPE "partManufacturingPolicy" AS ENUM (
  'Make to Order',
  'Make to Stock'
);


CREATE TYPE "partCostingMethod" AS ENUM (
  'Standard',
  'Average',
  'LIFO',
  'FIFO'
);

CREATE TYPE "partReorderingPolicy" AS ENUM (
  'Manual Reorder',
  'Demand-Based Reorder',
  'Fixed Reorder Quantity',
  'Maximum Quantity'
);

CREATE TABLE "unitOfMeasure" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "unitOfMeasure_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "unitOfMeasure_code_key" UNIQUE ("code"),
  CONSTRAINT "unitOfMeasure_code_check" CHECK (char_length("code") <= 3),
  CONSTRAINT "unitOfMeasure_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "unitOfMeasure_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);

CREATE INDEX "unitOfMeasure_code_index" ON "unitOfMeasure"("code");

INSERT INTO "unitOfMeasure" ("code", "name", "createdBy")
VALUES 
( 'EA', 'Each', 'system'),
( 'PCS', 'Pieces', 'system');

ALTER TABLE "unitOfMeasure" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view units of measure" ON "unitOfMeasure"
  FOR SELECT
  USING (
    auth.role() = 'authenticated'
  );
  

CREATE POLICY "Employees with parts_create can insert units of measure" ON "unitOfMeasure"
  FOR INSERT
  WITH CHECK (   
    coalesce(get_my_claim('parts_create')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Employees with parts_update can update units of measure" ON "unitOfMeasure"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('parts_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with parts_delete can delete units of measure" ON "unitOfMeasure"
  FOR DELETE
  USING (
    coalesce(get_my_claim('parts_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );


CREATE TABLE "part" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "blocked" BOOLEAN NOT NULL DEFAULT false,
  "replenishmentSystem" "partReplenishmentSystem" NOT NULL,
  "partGroupId" TEXT NOT NULL,
  "partType" "partType" NOT NULL,
  "manufacturerPartNumber" TEXT,
  "unitOfMeasureCode" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "approved" BOOLEAN NOT NULL DEFAULT false,
  "approvedBy" TEXT,
  "fromDate" DATE,
  "toDate" DATE,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "part_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "part_unitOfMeasureCode_fkey" FOREIGN KEY ("unitOfMeasureCode") REFERENCES "unitOfMeasure"("code") ON DELETE SET NULL,
  CONSTRAINT "part_partGroupId_fkey" FOREIGN KEY ("partGroupId") REFERENCES "partGroup"("id") ON DELETE SET NULL,
  CONSTRAINT "part_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "user"("id"),
  CONSTRAINT "part_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "part_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);

CREATE INDEX "part_name_index" ON "part"("name");
CREATE INDEX "part_description_index" ON "part"("description");
CREATE INDEX "part_partType_index" ON "part"("partType");
CREATE INDEX "part_partGroupId_index" ON "part"("partGroupId");
CREATE INDEX "part_replenishmentSystem_index" ON "part"("replenishmentSystem");

ALTER TABLE "part" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees can view parts" ON "part"
  FOR SELECT
  USING (
    (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with parts_create can insert parts" ON "part"
  FOR INSERT
  WITH CHECK (   
    coalesce(get_my_claim('parts_create')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with parts_update can update parts" ON "part"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('parts_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with parts_delete can delete parts" ON "part"
  FOR DELETE
  USING (
    coalesce(get_my_claim('parts_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE FUNCTION public.create_part_search_result()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.search(name, description, entity, uuid, link)
  VALUES (new.id, new.id || ' ' || new.name || ' ' || COALESCE(new.description, ''), 'Part', new.id, '/x/part/' || new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER create_part_search_result
  AFTER INSERT on public.part
  FOR EACH ROW EXECUTE PROCEDURE public.create_part_search_result();

CREATE FUNCTION public.create_part_related_records()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."partCost"("partId", "costingMethod", "createdBy")
  VALUES (new.id, 'Standard', new."createdBy");

  INSERT INTO public."partReplenishment"("partId", "createdBy")
  VALUES (new.id, new."createdBy");

  INSERT INTO public."partPlanning"("partId", "createdBy")
  VALUES (new.id, new."createdBy");

  INSERT INTO public."partInventory"("partId", "createdBy")
  VALUES (new.id, new."createdBy");

  INSERT INTO public."partUnitSalePrice"("partId", "currencyCode", "createdBy")
  -- TODO: get default currency
  VALUES (new.id, 'USD', new."createdBy");
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER create_part_related_records
  AFTER INSERT on public.part
  FOR EACH ROW EXECUTE PROCEDURE public.create_part_related_records();

CREATE FUNCTION public.update_part_search_result()
RETURNS TRIGGER AS $$
BEGIN
  IF (old.name <> new.name OR old.description <> new.description) THEN
    UPDATE public.search SET name = new.name, description = new.id || ' ' || new.name || ' ' || COALESCE(new.description, '')
    WHERE entity = 'Part' AND uuid = new.id;
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_part_search_result
  AFTER UPDATE on public.customer
  FOR EACH ROW EXECUTE PROCEDURE public.update_part_search_result();


CREATE TABLE "partCost" (
  "partId" TEXT NOT NULL,
  "costingMethod" "partCostingMethod" NOT NULL,
  "standardCost" NUMERIC(15,5) NOT NULL DEFAULT 0,
  "unitCost" NUMERIC(15,5) NOT NULL DEFAULT 0,
  "salesAccountId" TEXT,
  "discountAccountId" TEXT,
  "inventoryAccountId" TEXT,
  "costIsAdjusted" BOOLEAN NOT NULL DEFAULT false,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "partCost_partId_fkey" FOREIGN KEY ("partId") REFERENCES "part"("id") ON DELETE CASCADE,
  CONSTRAINT "partGroup_salesAccountId_fkey" FOREIGN KEY ("salesAccountId") REFERENCES "account"("number") ON DELETE CASCADE,
  CONSTRAINT "partGroup_discountAccountId_fkey" FOREIGN KEY ("discountAccountId") REFERENCES "account"("number") ON DELETE CASCADE,
  CONSTRAINT "partGroup_inventoryAccountId_fkey" FOREIGN KEY ("inventoryAccountId") REFERENCES "account"("number") ON DELETE CASCADE,
  CONSTRAINT "partGroup_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "partGroup_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);

CREATE INDEX "partCost_partId_index" ON "partCost" ("partId");

ALTER TABLE "partCost" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with part_view can view part costs" ON "partCost"
  FOR SELECT
  USING (
    coalesce(get_my_claim('parts_view')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with parts_update can update part costs" ON "partCost"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('parts_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE TABLE "partUnitSalePrice" (
  "partId" TEXT NOT NULL,
  "unitSalePrice" NUMERIC(15,5) NOT NULL DEFAULT 0,
  "currencyCode" TEXT NOT NULL,
  "salesUnitOfMeasureCode" TEXT,
  "salesBlocked" BOOLEAN NOT NULL DEFAULT false,
  "priceIncludesTax" BOOLEAN NOT NULL DEFAULT false,
  "allowInvoiceDiscount" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "partUnitSalePrice_partId_fkey" FOREIGN KEY ("partId") REFERENCES "part"("id") ON DELETE CASCADE,
  CONSTRAINT "partUnitSalePrice_currencyCode_fkey" FOREIGN KEY ("currencyCode") REFERENCES "currency"("code") ON DELETE SET NULL,
  CONSTRAINT "partUnitSalePrice_salesUnitOfMeasureId_fkey" FOREIGN KEY ("salesUnitOfMeasureCode") REFERENCES "unitOfMeasure"("code") ON DELETE SET NULL,
  CONSTRAINT "partUnitSalePrice_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "partUnitSalePrice_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);

CREATE INDEX "partUnitSalePrice_partId_index" ON "partUnitSalePrice"("partId");

ALTER TABLE "partUnitSalePrice" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with part_view can view part sale prices" ON "partUnitSalePrice"
  FOR SELECT
  USING (
    coalesce(get_my_claim('parts_view')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with parts_update can update part sale prices" ON "partUnitSalePrice"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('parts_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE TABLE "partSupplier" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "partId" TEXT NOT NULL,
  "supplierId" TEXT NOT NULL,
  "supplierPartId" TEXT,
  "supplierUnitOfMeasureCode" TEXT,
  "minimumOrderQuantity" INTEGER DEFAULT 1,
  "conversionFactor" NUMERIC(15,5) NOT NULL DEFAULT 1,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "partSupplier_id_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "partSupplier_partId_fkey" FOREIGN KEY ("partId") REFERENCES "part"("id") ON DELETE CASCADE,
  CONSTRAINT "partSupplier_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "supplier"("id") ON DELETE CASCADE,
  CONSTRAINT "partSupplier_part_supplier_unique" UNIQUE ("partId", "supplierId"),
  CONSTRAINT "partSupplier_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "partSupplier_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);

CREATE TABLE "partReplenishment" (
  "partId" TEXT NOT NULL,
  "preferredSupplierId" TEXT,
  "purchasingLeadTime" INTEGER NOT NULL DEFAULT 0,
  "purchasingUnitOfMeasureCode" TEXT,
  "conversionFactor" NUMERIC(15,5) NOT NULL DEFAULT 1,
  "purchasingBlocked" BOOLEAN NOT NULL DEFAULT false,
  "manufacturingPolicy" "partManufacturingPolicy" NOT NULL DEFAULT 'Make to Stock',
  "manufacturingLeadTime" INTEGER NOT NULL DEFAULT 0,
  "manufacturingBlocked" BOOLEAN NOT NULL DEFAULT false,
  "requiresConfiguration" BOOLEAN NOT NULL DEFAULT false,
  "scrapPercentage" NUMERIC(15,5) NOT NULL DEFAULT 0,
  "lotSize" INTEGER,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT "partReplenishment_partId_fkey" FOREIGN KEY ("partId") REFERENCES "part"("id") ON DELETE CASCADE,
  CONSTRAINT "partReplenishment_preferredSupplierId_fkey" FOREIGN KEY ("preferredSupplierId") REFERENCES "supplier"("id") ON DELETE SET NULL,
  CONSTRAINT "partReplenishment_purchaseUnitOfMeasureCode_fkey" FOREIGN KEY ("purchasingUnitOfMeasureCode") REFERENCES "unitOfMeasure"("code") ON DELETE SET NULL,
  CONSTRAINT "partReplenishment_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "partReplenishment_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);

CREATE INDEX "partReplenishment_partId_index" ON "partReplenishment" ("partId");
CREATE INDEX "partReplenishment_preferredSupplierId_index" ON "partReplenishment" ("preferredSupplierId");

ALTER TABLE "partReplenishment" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with part_view can view part costs" ON "partReplenishment"
  FOR SELECT
  USING (
    coalesce(get_my_claim('parts_view')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with parts_update can update part costs" ON "partReplenishment"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('parts_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

-- TODO: uncomment this code after adding partSupplier table
-- CREATE POLICY "Suppliers with parts_view can view parts they created or supply" ON "part"
--   FOR SELECT
--   USING (
--     coalesce(get_my_claim('parts_view')::boolean, false) = true 
--     AND (get_my_claim('role'::text)) = '"supplier"'::jsonb 
--     AND (
--       "createdBy" = auth.uid()::text
--       OR (
--         id IN (
--           SELECT "partId" FROM "partReplenishment" WHERE "supplierId" IN (
--               SELECT "supplierId" FROM "supplierAccount" WHERE id::uuid = auth.uid()
--           )
--         )              
--       ) 
--     )
--   );

CREATE POLICY "Supliers with parts_create can insert parts" ON "part"
  FOR INSERT
  WITH CHECK (   
    coalesce(get_my_claim('parts_create')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"supplier"'::jsonb
  );

-- CREATE POLICY "Suppliers with parts_update can update parts that they created or supply" ON "part"
--   FOR UPDATE
--   USING (
--     coalesce(get_my_claim('parts_update')::boolean, false) = true 
--     AND (get_my_claim('role'::text)) = '"employee"'::jsonb
--     AND (
--       "createdBy" = auth.uid()::text
--       OR (
--         id IN (
--           SELECT "partId" FROM "partReplenishment" WHERE "supplierId" IN (
--               SELECT "supplierId" FROM "supplierAccount" WHERE id::uuid = auth.uid()
--           )
--         )              
--       ) 
--     )
--   );

-- CREATE POLICY "Suppliers with parts_delete can delete parts that they created or supply" ON "part"
--   FOR DELETE
--   USING (
--     coalesce(get_my_claim('parts_delete')::boolean, false) = true 
--     AND (get_my_claim('role'::text)) = '"employee"'::jsonb
--     AND (
--       "createdBy" = auth.uid()::text
--       OR (
--         id IN (
--           SELECT "partId" FROM "partReplenishment" WHERE "supplierId" IN (
--               SELECT "supplierId" FROM "supplierAccount" WHERE id::uuid = auth.uid()
--           )
--         )              
--       ) 
--     ) 
--   );

-- CREATE POLICY "Suppliers with parts_view can view part costs they supply" ON "partCost"
--   FOR SELECT
--   USING (
--     coalesce(get_my_claim('parts_view')::boolean, false) = true 
--     AND (get_my_claim('role'::text)) = '"supplier"'::jsonb 
--     AND (
--       "partId" IN (
--         SELECT "partId" FROM "partReplenishment" WHERE "supplierId" IN (
--             SELECT "supplierId" FROM "supplierAccount" WHERE id::uuid = auth.uid()
--         )
--       )                 
--     )
--   );

-- CREATE POLICY "Suppliers with parts_update can update parts costs that they supply" ON "partCost"
--   FOR UPDATE
--   USING (
--     coalesce(get_my_claim('parts_update')::boolean, false) = true 
--     AND (get_my_claim('role'::text)) = '"employee"'::jsonb
--     AND (
--       "partId" IN (
--         SELECT "partId" FROM "partReplenishment" WHERE "supplierId" IN (
--             SELECT "supplierId" FROM "supplierAccount" WHERE id::uuid = auth.uid()
--         )
--       )                 
--     )
--   );

-- CREATE POLICY "Suppliers with parts_view can view part replenishments they supply" ON "partReplenishment"
--   FOR SELECT
--   USING (
--     coalesce(get_my_claim('parts_view')::boolean, false) = true 
--     AND (get_my_claim('role'::text)) = '"supplier"'::jsonb 
--     AND (
--       "supplierId" IN (
--           SELECT "supplierId" FROM "supplierAccount" WHERE id::uuid = auth.uid()
--       )               
--     )
--   );

-- CREATE POLICY "Suppliers with parts_update can update parts replenishments that they supply" ON "partReplenishment"
--   FOR UPDATE
--   USING (
--     coalesce(get_my_claim('parts_update')::boolean, false) = true 
--     AND (get_my_claim('role'::text)) = '"employee"'::jsonb
--     AND (
--       "supplierId" IN (
--           SELECT "supplierId" FROM "supplierAccount" WHERE id::uuid = auth.uid()
--       )               
--     )
--   );

CREATE TABLE "shelf" (
  "id" TEXT NOT NULL,
  "locationId" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "shelf_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "shelf_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE,
  CONSTRAINT "shelf_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "shelf_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);

CREATE INDEX "shelf_locationId_index" ON "shelf" ("locationId");

ALTER TABLE "shelf" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view shelves" ON "shelf"
  FOR SELECT
  USING (
    auth.role() = 'authenticated'
  );
  

CREATE POLICY "Employees with parts_create can insert shelves" ON "shelf"
  FOR INSERT
  WITH CHECK (   
    coalesce(get_my_claim('parts_create')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Employees with parts_update can update shelves" ON "shelf"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('parts_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with parts_delete can delete shelves" ON "shelf"
  FOR DELETE
  USING (
    coalesce(get_my_claim('parts_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );


CREATE TABLE "partPlanning" (
  "partId" TEXT NOT NULL,
  "reorderingPolicy" "partReorderingPolicy" NOT NULL DEFAULT 'Demand-Based Reorder',
  "critical" BOOLEAN NOT NULL DEFAULT false,
  "safetyStockQuantity" INTEGER NOT NULL DEFAULT 0,
  "safetyStockLeadTime" INTEGER NOT NULL DEFAULT 0,
  "demandAccumulationPeriod" INTEGER NOT NULL DEFAULT 0,
  "demandReschedulingPeriod" INTEGER NOT NULL DEFAULT 0,
  "demandAccumulationIncludesInventory" BOOLEAN NOT NULL DEFAULT false,
  "reorderPoint" INTEGER NOT NULL DEFAULT 0,
  "reorderQuantity" INTEGER NOT NULL DEFAULT 0,
  "reorderMaximumInventory" INTEGER NOT NULL DEFAULT 0,
  "reorderOverflowLevel" INTEGER NOT NULL DEFAULT 0,
  "reorderTimeBucket" INTEGER NOT NULL DEFAULT 5,
  "minimumOrderQuantity" INTEGER NOT NULL DEFAULT 0,
  "maximumOrderQuantity" INTEGER NOT NULL DEFAULT 0,
  "orderMultiple" INTEGER NOT NULL DEFAULT 1,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "partPlanning_partId_fkey" FOREIGN KEY ("partId") REFERENCES "part"("id") ON DELETE CASCADE,
  CONSTRAINT "partPlanning_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "partPlanning_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);

CREATE INDEX "partPlanning_partId_index" ON "partPlanning" ("partId");
ALTER TABLE "partPlanning" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with part_view can view part planning" ON "partPlanning"
  FOR SELECT
  USING (
    coalesce(get_my_claim('parts_view')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with parts_update can update part planning" ON "partPlanning"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('parts_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );


CREATE TABLE "partInventory" (
  "partId" TEXT NOT NULL,
  "shelfId" TEXT,
  "stockoutWarning" BOOLEAN NOT NULL DEFAULT true,
  "unitVolume" NUMERIC(15,5) NOT NULL DEFAULT 0,
  "unitWeight" NUMERIC(15,5) NOT NULL DEFAULT 0,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "partInventory_partId_shelfId_key" UNIQUE ("partId", "shelfId"),
  CONSTRAINT "partInventory_partId_fkey" FOREIGN KEY ("partId") REFERENCES "part"("id") ON DELETE CASCADE,
  CONSTRAINT "partInventory_shelfId_fkey" FOREIGN KEY ("shelfId") REFERENCES "shelf"("id") ON DELETE SET NULL,
  CONSTRAINT "partInventory_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "partInventory_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);

CREATE INDEX "partInventory_partId_index" ON "partInventory" ("partId");
CREATE INDEX "partInventory_shelfId_index" ON "partInventory" ("shelfId");

ALTER TABLE "partInventory" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with part_view can view part planning" ON "partInventory"
  FOR SELECT
  USING (
    coalesce(get_my_claim('parts_view')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with parts_update can update part planning" ON "partInventory"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('parts_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

-- CREATE POLICY "Suppliers with parts_view can view part inventory they supply" ON "partInventory"
--   FOR SELECT
--   USING (
--     coalesce(get_my_claim('parts_view')::boolean, false) = true 
--     AND (get_my_claim('role'::text)) = '"supplier"'::jsonb 
--     AND (
--       "partId" IN (
--         SELECT "partId" FROM "partReplenishment" WHERE "supplierId" IN (
--             SELECT "supplierId" FROM "supplierAccount" WHERE id::uuid = auth.uid()
--         )
--       )                 
--     )
--   );

-- CREATE POLICY "Suppliers with parts_update can update part inventory that they supply" ON "partInventory"
--   FOR UPDATE
--   USING (
--     coalesce(get_my_claim('parts_update')::boolean, false) = true 
--     AND (get_my_claim('role'::text)) = '"employee"'::jsonb
--     AND (
--       "partId" IN (
--         SELECT "partId" FROM "partReplenishment" WHERE "supplierId" IN (
--             SELECT "supplierId" FROM "supplierAccount" WHERE id::uuid = auth.uid()
--         )
--       )                 
--     )
--   );