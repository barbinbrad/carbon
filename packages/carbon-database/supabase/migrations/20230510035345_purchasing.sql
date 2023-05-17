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
  CONSTRAINT "paymentTerm_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE CASCADE,
  CONSTRAINT "paymentTerm_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE CASCADE
);

INSERT INTO "paymentTerm" ("name", "daysDue", "calculationMethod", "daysDiscount", "discountPercentage", "createdBy") 
VALUES 
  ('Net 15', 15, 'Net', 0, 0, 'system'),
  ('Net 30', 30, 'Net', 0, 0, 'system'),
  ('Net 50', 50, 'Net', 0, 0, 'system'),
  ('Net 60', 60, 'Net', 0, 0, 'system'),
  ('Net 90', 90, 'Net', 0, 0, 'system'),
  ('1% 10 Net 30', 30, 'Net', 10, 1, 'system'),
  ('2% 10 Net 30', 30, 'Net', 10, 2, 'system'),
  ('Due on Receipt', 0, 'Net', 0, 0, 'system'),
  ('Net EOM 10', 10, 'End of Month', 0, 0, 'system');
  

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
  CONSTRAINT "shippingMethod_carrierAccountId_fkey" FOREIGN KEY ("carrierAccountId") REFERENCES "account" ("number") ON DELETE CASCADE,
  CONSTRAINT "shippingMethod_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE CASCADE,
  CONSTRAINT "shippingMethod_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE CASCADE
);

CREATE INDEX "shippingMethod_name_idx" ON "shippingMethod" ("name");

CREATE TYPE "purchaseOrderType" AS ENUM (
  'Draft',
  'Purchase', 
  'Return'
);

CREATE TYPE "purchaseOrderApprovalStatus" AS ENUM (
  'Draft',
  'In Review',
  'In External Review',
  'Approved',
  'Rejected',
  'Confirmed'
);

CREATE TABLE "purchaseOrder" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "purchaseOrderId" TEXT NOT NULL,
  "type" "purchaseOrderType" NOT NULL,
  "status" "purchaseOrderApprovalStatus" NOT NULL,
  "orderDate" DATE NOT NULL DEFAULT CURRENT_DATE,
  "orderDueDate" DATE,
  "receivedDate" DATE,
  "orderSubTotal" NUMERIC(10,5) NOT NULL DEFAULT 0,
  "orderTax" NUMERIC(10,5) NOT NULL DEFAULT 0,
  "orderDiscount" NUMERIC(10,5) NOT NULL DEFAULT 0,
  "orderShipping" NUMERIC(10,5) NOT NULL DEFAULT 0,
  "orderTotal" NUMERIC(10,5) NOT NULL DEFAULT 0,
  "notes" TEXT,
  "supplierId" TEXT NOT NULL,
  "supplierContactId" TEXT,
  "supplierReference" TEXT,
  "invoiceSupplierId" TEXT,
  "invoiceSupplierLocationId" TEXT,
  "invoiceSupplierContactId" TEXT,
  "paymentTermId" TEXT,
  "shippingMethodId" TEXT,
  "currencyCode" TEXT NOT NULL,
  -- "approvalRequestDate" DATE,
  -- "approvalDecisionDate" DATE,
  -- "approvalDecisionUserId" TEXT,
  -- "approvalDecisionNotes" TEXT,
  "closed" BOOLEAN NOT NULL DEFAULT FALSE,
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
  CONSTRAINT "purchaseOrder_invoiceSupplierId_fkey" FOREIGN KEY ("invoiceSupplierId") REFERENCES "supplier" ("id") ON DELETE CASCADE,
  CONSTRAINT "purchaseOrder_invoiceSupplierLocationId_fkey" FOREIGN KEY ("invoiceSupplierLocationId") REFERENCES "supplierLocation" ("id") ON DELETE CASCADE,
  CONSTRAINT "purchaseOrder_invoiceSupplierContactId_fkey" FOREIGN KEY ("invoiceSupplierContactId") REFERENCES "supplierContact" ("id") ON DELETE CASCADE,
  CONSTRAINT "purchaseOrder_paymentTermId_fkey" FOREIGN KEY ("paymentTermId") REFERENCES "paymentTerm" ("id") ON DELETE CASCADE,
  CONSTRAINT "purchaseOrder_shippingMethodId_fkey" FOREIGN KEY ("shippingMethodId") REFERENCES "shippingMethod" ("id") ON DELETE CASCADE,
  CONSTRAINT "purchaseOrder_currencyCode_fkey" FOREIGN KEY ("currencyCode") REFERENCES "currency" ("code") ON DELETE CASCADE,
  -- CONSTRAINT "purchaseOrder_approvalDecisionUserId_fkey" FOREIGN KEY ("approvalDecisionUserId") REFERENCES "user" ("id") ON DELETE CASCADE,
  CONSTRAINT "purchaseOrder_closedBy_fkey" FOREIGN KEY ("closedBy") REFERENCES "user" ("id") ON DELETE CASCADE,
  CONSTRAINT "purchaseOrder_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE CASCADE,
  CONSTRAINT "purchaseOrder_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE CASCADE
);

CREATE INDEX "purchaseOrder_purchaseOrderId_idx" ON "purchaseOrder" ("purchaseOrderId");
CREATE INDEX "purchaseOrder_supplierId_idx" ON "purchaseOrder" ("supplierId");
CREATE INDEX "purchaseOrder_supplierContactId_idx" ON "purchaseOrder" ("supplierContactId");
CREATE INDEX "purchaseOrder_invoiceSupplierId_idx" ON "purchaseOrder" ("invoiceSupplierId");
CREATE INDEX "purchaseOrder_invoiceSupplierLocationId_idx" ON "purchaseOrder" ("invoiceSupplierLocationId");
CREATE INDEX "purchaseOrder_invoiceSupplierContactId_idx" ON "purchaseOrder" ("invoiceSupplierContactId");
-- CREATE INDEX "purchaseOrder_approvalDecisionUserId_idx" ON "purchaseOrder" ("approvalDecisionUserId");

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