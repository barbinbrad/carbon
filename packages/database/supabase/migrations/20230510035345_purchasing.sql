CREATE TYPE "paymentTermCalculationMethod" AS ENUM (
  'Net',
  'End of Month',
  'Day of Month'
);

CREATE TABLE "paymentTerm" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "name" TEXT NOT NULL,
  "daysDue" INTEGER NOT NULL DEFAULT 0,
  "daysDiscount" INTEGER NOT NULL DEFAULT 0,
  "discountPercentage" NUMERIC(10,5) NOT NULL DEFAULT 0,
  "calculationMethod" "paymentTermCalculationMethod" NOT NULL DEFAULT 'Net',
  "active" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "updatedBy" TEXT,

  CONSTRAINT "paymentTerm_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "paymentTerm_name_key" UNIQUE ("name", "active"),
  CONSTRAINT "paymentTerm_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE RESTRICT,
  CONSTRAINT "paymentTerm_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE RESTRICT
);

ALTER TABLE "paymentTerm" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Certain employees can view payment terms" ON "paymentTerm"
  FOR SELECT
  USING (
    (
      coalesce(get_my_claim('accounting_view')::boolean, false) = true OR
      coalesce(get_my_claim('parts_view')::boolean, false) = true OR
      coalesce(get_my_claim('resources_view')::boolean, false) = true OR
      coalesce(get_my_claim('sales_view')::boolean, false) = true OR
      coalesce(get_my_claim('purchasing_view')::boolean, false) = true
    )
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );
  

CREATE POLICY "Employees with accounting_create can insert payment terms" ON "paymentTerm"
  FOR INSERT
  WITH CHECK (   
    coalesce(get_my_claim('accounting_create')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Employees with accounting_update can update payment terms" ON "paymentTerm"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('accounting_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with accounting_delete can delete payment terms" ON "paymentTerm"
  FOR DELETE
  USING (
    coalesce(get_my_claim('accounting_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );
  

CREATE TYPE "shippingCarrier" AS ENUM (
  'UPS',
  'FedEx',
  'USPS',
  'DHL',
  'Other'
);

CREATE TABLE "shippingMethod" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "name" TEXT NOT NULL,
  "carrier" "shippingCarrier" NOT NULL DEFAULT 'Other',
  "carrierAccountId" TEXT,
  "trackingUrl" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "updatedBy" TEXT,

  CONSTRAINT "shippingMethod_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "shippingMethod_name_key" UNIQUE ("name"),
  CONSTRAINT "shippingMethod_carrierAccountId_fkey" FOREIGN KEY ("carrierAccountId") REFERENCES "account" ("number") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "shippingMethod_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE RESTRICT,
  CONSTRAINT "shippingMethod_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE RESTRICT
);

CREATE INDEX "shippingMethod_name_idx" ON "shippingMethod" ("name");


CREATE POLICY "Certain employees can view shipping methods" ON "shippingMethod"
  FOR SELECT
  USING (
    (
      coalesce(get_my_claim('accounting_view')::boolean, false) = true OR
      coalesce(get_my_claim('inventory_view')::boolean, false) = true OR
      coalesce(get_my_claim('parts_view')::boolean, false) = true OR
      coalesce(get_my_claim('purchasing_view')::boolean, false) = true OR
      coalesce(get_my_claim('sales_view')::boolean, false) = true
    )
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );
  

CREATE POLICY "Employees with inventory_create can insert shipping methods" ON "shippingMethod"
  FOR INSERT
  WITH CHECK (   
    coalesce(get_my_claim('inventory_create')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Employees with inventory_update can update shipping methods" ON "shippingMethod"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('inventory_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with inventory_delete can delete shipping methods" ON "shippingMethod"
  FOR DELETE
  USING (
    coalesce(get_my_claim('inventory_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE TABLE "shippingTerm" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "name" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "updatedBy" TEXT,

  CONSTRAINT "shippingTerm_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "shippingTerm_name_key" UNIQUE ("name"),
  CONSTRAINT "shippingTerm_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE RESTRICT,
  CONSTRAINT "shippingTerm_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE RESTRICT
);


CREATE TYPE "purchaseOrderType" AS ENUM (
  'Purchase', 
  'Return'
);

CREATE TYPE "purchaseOrderStatus" AS ENUM (
  'Draft',
  'To Review',
  'Rejected',
  'To Receive',
  'To Receive and Invoice',
  'To Invoice',
  'Completed',
  'Closed'
);

CREATE TABLE "purchaseOrder" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "purchaseOrderId" TEXT NOT NULL,
  "type" "purchaseOrderType" NOT NULL,
  "status" "purchaseOrderStatus" NOT NULL DEFAULT 'Draft',
  "orderDate" DATE NOT NULL DEFAULT CURRENT_DATE,
  "notes" TEXT,
  "supplierId" TEXT NOT NULL,
  "supplierContactId" TEXT,
  "supplierReference" TEXT,
  "closedAt" DATE,
  "closedBy" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "updatedBy" TEXT,

  CONSTRAINT "purchaseOrder_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "purchaseOrder_purchaseOrderId_key" UNIQUE ("purchaseOrderId"),
  CONSTRAINT "purchaseOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "supplier" ("id") ON DELETE CASCADE,
  CONSTRAINT "purchaseOrder_supplierContactId_fkey" FOREIGN KEY ("supplierContactId") REFERENCES "supplierContact" ("id") ON DELETE CASCADE,
  CONSTRAINT "purchaseOrder_closedBy_fkey" FOREIGN KEY ("closedBy") REFERENCES "user" ("id") ON DELETE RESTRICT,
  CONSTRAINT "purchaseOrder_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE RESTRICT,
  CONSTRAINT "purchaseOrder_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE RESTRICT
);

CREATE INDEX "purchaseOrder_purchaseOrderId_idx" ON "purchaseOrder" ("purchaseOrderId");
CREATE INDEX "purchaseOrder_supplierId_idx" ON "purchaseOrder" ("supplierId");
CREATE INDEX "purchaseOrder_supplierContactId_idx" ON "purchaseOrder" ("supplierContactId");
CREATE INDEX "purchaseOrder_status_idx" ON "purchaseOrder" ("status");

CREATE TYPE "purchaseOrderLineType" AS ENUM (
  'Comment',
  'G/L Account',
  'Part',
  'Fixed Asset'
);

CREATE TABLE "purchaseOrderStatusHistory" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "purchaseOrderId" TEXT NOT NULL,
  "status" "purchaseOrderStatus" NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "createdBy" TEXT NOT NULL,

  CONSTRAINT "purchaseOrderStatusHistory_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "purchaseOrderStatusHistory_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchaseOrder" ("id") ON DELETE CASCADE,
  CONSTRAINT "purchaseOrderStatusHistory_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE RESTRICT
);


CREATE TABLE "purchaseOrderLine" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "purchaseOrderId" TEXT NOT NULL,
  "purchaseOrderLineType" "purchaseOrderLineType" NOT NULL,
  "partId" TEXT,
  "accountNumber" TEXT,
  "assetId" TEXT,
  "description" TEXT,
  "purchaseQuantity" NUMERIC(9,2) DEFAULT 0,
  "quantityToReceive" NUMERIC(9,2) GENERATED ALWAYS AS (CASE WHEN "purchaseOrderLineType" = 'Comment' THEN 0 ELSE GREATEST(("purchaseQuantity" - "quantityReceived"), 0) END) STORED,
  "quantityReceived" NUMERIC(9,2) DEFAULT 0,
  "quantityToInvoice" NUMERIC(9,2) GENERATED ALWAYS AS (CASE WHEN "purchaseOrderLineType" = 'Comment' THEN 0 ELSE GREATEST(("purchaseQuantity" - "quantityInvoiced"), 0) END) STORED,
  "quantityInvoiced" NUMERIC(9,2) DEFAULT 0,
  "unitPrice" NUMERIC(9,2),
  "unitOfMeasureCode" TEXT,
  "locationId" TEXT,
  "shelfId" TEXT,
  "setupPrice" NUMERIC(9,2),
  "receivedComplete" BOOLEAN NOT NULL DEFAULT FALSE,
  "invoiceComplete" BOOLEAN NOT NULL DEFAULT FALSE,
  "requiresInspection" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "updatedBy" TEXT,

  CONSTRAINT "purchaseOrderLineType_number"
    CHECK (
      (
        "purchaseOrderLineType" = 'Comment' AND
        "partId" IS NULL AND
        "accountNumber" IS NULL AND
        "assetId" IS NULL AND
        "description" IS NOT NULL
      ) 
      OR (
        "purchaseOrderLineType" = 'G/L Account' AND
        "partId" IS NULL AND
        "accountNumber" IS NOT NULL AND
        "assetId" IS NULL 
      ) 
      OR (
        "purchaseOrderLineType" = 'Part' AND
        "partId" IS NOT NULL AND
        "accountNumber" IS NULL AND
        "assetId" IS NULL 
      ) 
      OR (
        "purchaseOrderLineType" = 'Fixed Asset' AND
        "partId" IS NULL AND
        "accountNumber" IS NULL AND
        "assetId" IS NOT NULL 
      ) 
    ),

  CONSTRAINT "purchaseOrderLine_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "purchaseOrderLine_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchaseOrder" ("id") ON DELETE CASCADE,
  CONSTRAINT "purchaseOrderLine_partId_fkey" FOREIGN KEY ("partId") REFERENCES "part" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "purchaseOrderLine_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "account" ("number") ON DELETE CASCADE ON UPDATE CASCADE,
  -- TODO: Add assetId foreign key
  CONSTRAINT "purchaseOrderLine_shelfId_fkey" FOREIGN KEY ("shelfId", "locationId") REFERENCES "shelf" ("id", "locationId") ON DELETE CASCADE,
  CONSTRAINT "purchaseOrderLine_unitOfMeasureCode_fkey" FOREIGN KEY ("unitOfMeasureCode") REFERENCES "unitOfMeasure" ("code") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "purchaseOrderLine_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE RESTRICT,
  CONSTRAINT "purchaseOrderLine_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE RESTRICT
);

CREATE TABLE "purchaseOrderPayment" (
  "id" TEXT NOT NULL,
  "invoiceSupplierId" TEXT,
  "invoiceSupplierLocationId" TEXT,
  "invoiceSupplierContactId" TEXT,
  "paymentTermId" TEXT,
  "paymentComplete" BOOLEAN NOT NULL DEFAULT FALSE,
  "currencyCode" TEXT NOT NULL DEFAULT 'USD',
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "updatedBy" TEXT,

  CONSTRAINT "purchaseOrderPayment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "purchaseOrderPayment_id_fkey" FOREIGN KEY ("id") REFERENCES "purchaseOrder" ("id") ON DELETE CASCADE,
  CONSTRAINT "purchaseOrderPayment_invoiceSupplierId_fkey" FOREIGN KEY ("invoiceSupplierId") REFERENCES "supplier" ("id") ON DELETE CASCADE,
  CONSTRAINT "purchaseOrderPayment_invoiceSupplierLocationId_fkey" FOREIGN KEY ("invoiceSupplierLocationId") REFERENCES "supplierLocation" ("id") ON DELETE CASCADE,
  CONSTRAINT "purchaseOrderPayment_invoiceSupplierContactId_fkey" FOREIGN KEY ("invoiceSupplierContactId") REFERENCES "supplierContact" ("id") ON DELETE CASCADE,
  CONSTRAINT "purchaseOrderPayment_paymentTermId_fkey" FOREIGN KEY ("paymentTermId") REFERENCES "paymentTerm" ("id") ON DELETE CASCADE,
  CONSTRAINT "purchaseOrderPayment_currencyCode_fkey" FOREIGN KEY ("currencyCode") REFERENCES "currency" ("code") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "purchaseOrderPayment_invoiceSupplierId_idx" ON "purchaseOrderPayment" ("invoiceSupplierId");
CREATE INDEX "purchaseOrderPayment_invoiceSupplierLocationId_idx" ON "purchaseOrderPayment" ("invoiceSupplierLocationId");
CREATE INDEX "purchaseOrderPayment_invoiceSupplierContactId_idx" ON "purchaseOrderPayment" ("invoiceSupplierContactId");

CREATE TABLE "purchaseOrderDelivery" (
  "id" TEXT NOT NULL,
  "locationId" TEXT,
  "shippingMethodId" TEXT,
  "shippingTermId" TEXT,
  "receiptRequestedDate" DATE,
  "receiptPromisedDate" DATE,
  "deliveryDate" DATE,
  "notes" TEXT,
  "trackingNumber" TEXT,
  "dropShipment" BOOLEAN NOT NULL DEFAULT FALSE,
  "customerId" TEXT,
  "customerLocationId" TEXT,
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "purchaseOrderDelivery_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "purchaseOrderDelivery_id_fkey" FOREIGN KEY ("id") REFERENCES "purchaseOrder" ("id") ON DELETE CASCADE,
  CONSTRAINT "purchaseOrderDelivery_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location" ("id") ON DELETE CASCADE,
  CONSTRAINT "purchaseOrderDelivery_shippingMethodId_fkey" FOREIGN KEY ("shippingMethodId") REFERENCES "shippingMethod" ("id") ON DELETE CASCADE,
  CONSTRAINT "purchaseOrderDelivery_shippingTermId_fkey" FOREIGN KEY ("shippingTermId") REFERENCES "shippingTerm" ("id") ON DELETE CASCADE,
  CONSTRAINT "purchaseOrderDelivery_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer" ("id") ON DELETE CASCADE,
  CONSTRAINT "purchaseOrderDelivery_customerLocationId_fkey" FOREIGN KEY ("customerLocationId") REFERENCES "customerLocation" ("id") ON DELETE CASCADE,
  CONSTRAINT "purchaseOrderDelivery_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE RESTRICT
);

CREATE TYPE "purchaseOrderTransactionType" AS ENUM (
  'Edit',
  'Favorite',
  'Unfavorite',
  'Approved',
  'Reject',
  'Request Approval'
);

CREATE TABLE "purchaseOrderTransaction" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "purchaseOrderId" TEXT NOT NULL,
  "type" "purchaseOrderTransactionType" NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  CONSTRAINT "purchaseOrderTransaction_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "purchaseOrderTransaction_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchaseOrder"("id") ON DELETE CASCADE,
  CONSTRAINT "purchaseOrderTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE INDEX "purchaseOrderTransaction_purchaseOrderId_idx" ON "purchaseOrderTransaction" ("purchaseOrderId");
CREATE INDEX "purchaseOrderTransaction_userId_idx" ON "purchaseOrderTransaction" ("userId");

CREATE TABLE "purchaseOrderFavorite" (
  "purchaseOrderId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,

  CONSTRAINT "purchaseOrderFavorites_pkey" PRIMARY KEY ("purchaseOrderId", "userId"),
  CONSTRAINT "purchaseOrderFavorites_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchaseOrder"("id") ON DELETE CASCADE,
  CONSTRAINT "purchaseOrderFavorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE INDEX "purchaseOrderFavorites_userId_idx" ON "purchaseOrderFavorite" ("userId");
CREATE INDEX "purchaseOrderFavorites_purchaseOrderId_idx" ON "purchaseOrderFavorite" ("purchaseOrderId");

ALTER TABLE "purchaseOrderFavorite" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own purchase order favorites" ON "purchaseOrderFavorite" 
  FOR SELECT USING (
    auth.uid()::text = "userId"
  );

CREATE POLICY "Users can create their own purchase order favorites" ON "purchaseOrderFavorite" 
  FOR INSERT WITH CHECK (
    auth.uid()::text = "userId"
  );

CREATE POLICY "Users can delete their own purchase order favorites" ON "purchaseOrderFavorite"
  FOR DELETE USING (
    auth.uid()::text = "userId"
  ); 

CREATE OR REPLACE VIEW "purchaseOrders" AS
  SELECT
    p.*,
    pd."receiptRequestedDate",
    pd."receiptPromisedDate",
    pd."dropShipment",
    pol."lineCount",
    pol."subtotal",
    l."id" AS "locationId",
    l."name" AS "locationName",
    s."name" AS "supplierName",
    u."avatarUrl" AS "createdByAvatar",
    u."fullName" AS "createdByFullName",
    u2."avatarUrl" AS "updatedByAvatar",
    u2."fullName" AS "updatedByFullName",
    u3."avatarUrl" AS "closedByAvatar",
    u3."fullName" AS "closedByFullName",
    EXISTS(SELECT 1 FROM "purchaseOrderFavorite" pf WHERE pf."purchaseOrderId" = p.id AND pf."userId" = auth.uid()::text) AS favorite
  FROM "purchaseOrder" p
  LEFT JOIN "purchaseOrderDelivery" pd ON pd."id" = p."id"
  LEFT JOIN (
    SELECT "purchaseOrderId", COUNT(*) AS "lineCount", SUM("unitPrice" * "purchaseQuantity") AS "subtotal"
    FROM "purchaseOrderLine"
    GROUP BY "purchaseOrderId"
  ) pol ON pol."purchaseOrderId" = p."id"
  LEFT JOIN "location" l ON l."id" = pd."locationId"
  LEFT JOIN "supplier" s ON s."id" = p."supplierId"
  LEFT JOIN "user" u ON u."id" = p."createdBy"
  LEFT JOIN "user" u2 ON u2."id" = p."updatedBy"
  LEFT JOIN "user" u3 ON u3."id" = p."closedBy";

ALTER TABLE "supplier" 
  ADD COLUMN "defaultCurrencyCode" TEXT,
  ADD COLUMN "defaultPaymentTermId" TEXT,
  ADD COLUMN "defaultShippingMethodId" TEXT,
  ADD COLUMN "defaultShippingTermId" TEXT;

ALTER TABLE "supplier"
  ADD CONSTRAINT "supplier_defaultPaymentTermId_fkey" FOREIGN KEY ("defaultPaymentTermId") REFERENCES "paymentTerm" ("id") ON DELETE SET NULL,
  ADD CONSTRAINT "supplier_defaultShippingMethodId_fkey" FOREIGN KEY ("defaultShippingMethodId") REFERENCES "shippingMethod" ("id") ON DELETE SET NULL,
  ADD CONSTRAINT "supplier_defaultShippingTermId_fkey" FOREIGN KEY ("defaultShippingTermId") REFERENCES "shippingTerm" ("id") ON DELETE SET NULL;

CREATE OR REPLACE VIEW "purchaseOrderSuppliers" AS
  SELECT DISTINCT
    s."id",
    s."name"
  FROM "supplier" s
  INNER JOIN "purchaseOrder" p ON p."supplierId" = s."id";
  
