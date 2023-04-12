CREATE TABLE "partGroup" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "name" TEXT NOT NULL,
  "description" TEXT,
  "salesAccountId" TEXT NOT NULL,
  "discountAccountId" TEXT NOT NULL,
  "inventoryAccountId" TEXT NOT NULL,
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

CREATE TYPE "partType" AS ENUM (
  'Inventory',
  'Non-Inventory',
  'Service'
);

CREATE TYPE "partReplenishmentSystem" AS ENUM (
  'Purchased',
  'Manufactured',
  'Purchased and Manufactured'
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

  CONSTRAINT "unitOfMeasure_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "unitOfMeasure_code_key" UNIQUE ("code"),
  CONSTRAINT "unitOfMeasure_code_check" CHECK (char_length("code") <= 3)
);

CREATE INDEX "unitOfMeasure_code_index" ON "unitOfMeasure"("code");

INSERT INTO "unitOfMeasure" ("code", "name")
VALUES 
( 'EA', 'Each'),
( 'PCS', 'Pieces' );

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


CREATE FUNCTION public.create_part_search_result()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.search(name, description, entity, uuid, link)
  VALUES (new.id, new.id || ' ' || new.name || ' ' || new.description, 'Part', new.id, '/x/part/' || new.id);
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
    UPDATE public.search SET name = new.name, description = new.id || ' ' || new.name || ' ' || new.description
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

CREATE TABLE "partUnitSalePrice" (
  "partId" TEXT NOT NULL,
  "unitSalePrice" NUMERIC(15,5) NOT NULL DEFAULT 0,
  "currencyCode" TEXT NOT NULL,
  "salesUnitOfMeasureCode" TEXT NOT NULL,
  "salesBlocked" BOOLEAN NOT NULL DEFAULT false,
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

CREATE TABLE "partReplenishment" (
  "partId" TEXT NOT NULL,
  "supplierId" TEXT,
  "supplierPartNumber" TEXT,
  "purchasingLeadTime" INTEGER NOT NULL DEFAULT 0,
  "purchaseUnitOfMeasureCode" TEXT NOT NULL,
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
  CONSTRAINT "partReplenishment_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "supplier"("id") ON DELETE SET NULL,
  CONSTRAINT "partReplenishment_purchaseUnitOfMeasureId_fkey" FOREIGN KEY ("purchaseUnitOfMeasureCode") REFERENCES "unitOfMeasure"("code") ON DELETE SET NULL,
  CONSTRAINT "partReplenishment_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "partReplenishment_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);

CREATE INDEX "partReplenishment_partId_index" ON "partReplenishment" ("partId");

CREATE TABLE "bin" (
  "id" TEXT NOT NULL,
  "locationId" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "bin_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "bin_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE,
  CONSTRAINT "bin_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "bin_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);

CREATE INDEX "bin_locationId_index" ON "bin" ("locationId");

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