CREATE TYPE "paymentTermCalculationMethod" AS ENUM (
  'Transaction Date',
  'End of Month',
  'Day of Month'
);

CREATE TABLE "paymentTerm" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "name" TEXT NOT NULL,
  "description" TEXT,
  "daysDue" INTEGER NOT NULL DEFAULT 0,
  "daysDiscount" INTEGER NOT NULL DEFAULT 0,
  "discountPercentage" NUMERIC(10,5) NOT NULL DEFAULT 0,
  "gracePeriod" INTEGER NOT NULL DEFAULT 0,
  "calculationMethod" "paymentTermCalculationMethod" NOT NULL DEFAULT 'Transaction Date',
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
  "orderSubTotal" NUMERIC(10,5) NOT NULL DEFAULT 0,
  "orderTax" NUMERIC(10,5) NOT NULL DEFAULT 0,
  "orderDiscount" NUMERIC(10,5) NOT NULL DEFAULT 0,
  "orderShipping" NUMERIC(10,5) NOT NULL DEFAULT 0,
  "orderTotal" NUMERIC(10,5) NOT NULL DEFAULT 0,
  "notes" TEXT,
  "supplierId" TEXT NOT NULL,
  "supplierContactId" TEXT NOT NULL,
  "invoiceSupplierId" TEXT,
  "invoiceSupplierLocationId" TEXT,
  "invoiceSupplierContactId" TEXT,
  "paymentTermId" TEXT,
  "shippingMethodId" TEXT,
  "currencyId" TEXT NOT NULL,
  "approvalRequestDate" DATE,
  "approvalDecisionDate" DATE,
  "approvalDecisionUserId" TEXT,
  "approvalDecisionNotes" TEXT,
  "closed" BOOLEAN NOT NULL DEFAULT FALSE,
  "closedDate" DATE,
  "closedUserId" TEXT,
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
  CONSTRAINT "purchaseOrder_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "currency" ("id") ON DELETE CASCADE,
  CONSTRAINT "purchaseOrder_approvalDecisionUserId_fkey" FOREIGN KEY ("approvalDecisionUserId") REFERENCES "user" ("id") ON DELETE CASCADE,
  CONSTRAINT "purchaseOrder_closedUserId_fkey" FOREIGN KEY ("closedUserId") REFERENCES "user" ("id") ON DELETE CASCADE,
  CONSTRAINT "purchaseOrder_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE CASCADE,
  CONSTRAINT "purchaseOrder_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE CASCADE
);

CREATE INDEX "purchaseOrder_purchaseOrderId_idx" ON "purchaseOrder" ("purchaseOrderId");
CREATE INDEX "purchaseOrder_supplierId_idx" ON "purchaseOrder" ("supplierId");
CREATE INDEX "purchaseOrder_supplierContactId_idx" ON "purchaseOrder" ("supplierContactId");
CREATE INDEX "purchaseOrder_invoiceSupplierId_idx" ON "purchaseOrder" ("invoiceSupplierId");
CREATE INDEX "purchaseOrder_invoiceSupplierLocationId_idx" ON "purchaseOrder" ("invoiceSupplierLocationId");
CREATE INDEX "purchaseOrder_invoiceSupplierContactId_idx" ON "purchaseOrder" ("invoiceSupplierContactId");
CREATE INDEX "purchaseOrder_approvalDecisionUserId_idx" ON "purchaseOrder" ("approvalDecisionUserId");
