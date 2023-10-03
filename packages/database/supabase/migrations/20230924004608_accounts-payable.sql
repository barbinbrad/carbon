CREATE TYPE "payableInvoiceStatus" AS ENUM (
  'Draft', 
  'Issued', 
  'Paid', 
  'Partially Paid', 
  'Voided'
);

CREATE TABLE "payableInvoice" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "invoiceId" TEXT NOT NULL,
  "accountingPeriodId" TEXT NOT NULL,
  "supplierId" TEXT,
  "contactId" TEXT,
  "dateIssued" DATE,
  "dateDue" DATE,
  "datePaid" DATE,
  "currencyCode" TEXT NOT NULL,
  "exchangeRate" NUMERIC(10, 4) NOT NULL DEFAULT 1,
  "subtotal" NUMERIC(10, 2) NOT NULL DEFAULT 0,
  "totalDiscount" NUMERIC(10, 2) NOT NULL DEFAULT 0,
  "totalAmount" NUMERIC(10, 2) NOT NULL DEFAULT 0,
  "totalTax" NUMERIC(10, 2) NOT NULL DEFAULT 0,
  "balance" NUMERIC(10, 2) NOT NULL DEFAULT 0,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "payableInvoice_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "payableInvoice_accountingPeriodId_fkey" FOREIGN KEY ("accountingPeriodId") REFERENCES "accountingPeriod" ("id"),
  CONSTRAINT "payableInvoice_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "supplier" ("id"),
  CONSTRAINT "payableInvoice_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact" ("id"),
  CONSTRAINT "payableInvoice_currencyCode_fkey" FOREIGN KEY ("currencyCode") REFERENCES "currency" ("code"),
  CONSTRAINT "payableInvoice_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id"),
  CONSTRAINT "payableInvoice_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id")
);

CREATE INDEX "payableInvoice_invoiceId_idx" ON "payableInvoice" ("invoiceId");
CREATE INDEX "payableInvoice_accountingPeriodId_idx" ON "payableInvoice" ("accountingPeriodId");
CREATE INDEX "payableInvoice_supplierId_idx" ON "payableInvoice" ("supplierId");
CREATE INDEX "payableInvoice_dateDue_idx" ON "payableInvoice" ("dateDue");
CREATE INDEX "payableInvoice_datePaid_idx" ON "payableInvoice" ("datePaid");

ALTER TABLE "payableInvoice" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with invoicing_view can view AP invoices" ON "payableInvoice"
  FOR SELECT
  USING (
    coalesce(get_my_claim('invoicing_view')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with invoicing_create can insert AP invoices" ON "payableInvoice"
  FOR INSERT
  WITH CHECK (   
    coalesce(get_my_claim('invoicing_create')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Employees with invoicing_update can update AP invoices" ON "payableInvoice"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('invoicing_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with invoicing_delete can delete AP invoices" ON "payableInvoice"
  FOR DELETE
  USING (
    coalesce(get_my_claim('invoicing_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE TABLE "payableInvoiceStatusHistory" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "invoiceId" TEXT NOT NULL,
  "status" "payableInvoiceStatus" NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  CONSTRAINT "payableInvoiceStatusHistory_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "payableInvoiceStatusHistory_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "payableInvoice" ("id") ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE "payableInvoiceStatusHistory" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with invoicing_view can view AP invoices status history" ON "payableInvoiceStatusHistory"
  FOR SELECT
  USING (
    coalesce(get_my_claim('invoicing_view')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );


CREATE TYPE "payableLineType" AS ENUM (
  'G/L Account',
  'Part',
  'Fixed Asset'
);

CREATE TABLE "payableInvoiceLine" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "invoiceId" TEXT NOT NULL,
  "invoiceLineType" "payableLineType" NOT NULL,
  "partId" TEXT,
  "accountNumber" TEXT,
  "assetId" TEXT,
  "description" TEXT,
  "quantity" NUMERIC(10, 2) NOT NULL DEFAULT 0,
  "unitPrice" NUMERIC(10, 2) NOT NULL DEFAULT 0,
  "totalAmount" NUMERIC(10, 2) GENERATED ALWAYS AS ("quantity" * "unitPrice") STORED,
  "currencyCode" TEXT NOT NULL,
  "exchangeRate" NUMERIC(10, 4) NOT NULL DEFAULT 1,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "payableInvoiceLines_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "payableInvoiceLines_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "payableInvoice" ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT "payableInvoiceLines_partId_fkey" FOREIGN KEY ("partId") REFERENCES "part" ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT "payableInvoiceLines_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "account" ("number") ON UPDATE CASCADE ON DELETE RESTRICT,
  -- CONSTRAINT "payableInvoiceLines_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "fixedAsset" ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT "payableInvoiceLines_currencyCode_fkey" FOREIGN KEY ("currencyCode") REFERENCES "currency" ("code") ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT "payableInvoiceLines_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT "payableInvoiceLines_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON UPDATE CASCADE ON DELETE RESTRICT
);

ALTER TABLE "payableInvoiceLine" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with invoicing_view can view AP invoice lines" ON "payableInvoiceLine"
  FOR SELECT
  USING (
    coalesce(get_my_claim('invoicing_view')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with invoicing_create can insert AP invoice lines" ON "payableInvoiceLine"
  FOR INSERT
  WITH CHECK (   
    coalesce(get_my_claim('invoicing_create')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Employees with invoicing_update can update AP invoice lines" ON "payableInvoiceLine"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('invoicing_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with invoicing_delete can delete AP invoice lines" ON "payableInvoiceLine"
  FOR DELETE
  USING (
    coalesce(get_my_claim('invoicing_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE TABLE "payablePayment" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "paymentId" TEXT NOT NULL,
  "supplierId" TEXT NOT NULL,
  "paymentDate" DATE,
  "currencyCode" TEXT NOT NULL,
  "exchangeRate" NUMERIC(10, 4) NOT NULL DEFAULT 1,
  "totalAmount" NUMERIC(10, 2) NOT NULL DEFAULT 0,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "payablePayment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "payablePayment_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "supplier" ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT "payablePayment_currencyCode_fkey" FOREIGN KEY ("currencyCode") REFERENCES "currency" ("code") ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT "payablePayment_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT "payablePayment_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON UPDATE CASCADE ON DELETE RESTRICT
);

ALTER TABLE "payablePayment" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with invoicing_view can view AP payments" ON "payablePayment"
  FOR SELECT
  USING (
    coalesce(get_my_claim('invoicing_view')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with invoicing_create can insert AP payments" ON "payablePayment"
  FOR INSERT
  WITH CHECK (   
    coalesce(get_my_claim('invoicing_create')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Employees with invoicing_update can update AP payments" ON "payablePayment"
  FOR UPDATE
  USING (
    "paymentDate" IS NULL
    AND coalesce(get_my_claim('invoicing_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with invoicing_delete can delete AP payments" ON "payablePayment"
  FOR DELETE
  USING (
    "paymentDate" IS NULL
    AND coalesce(get_my_claim('invoicing_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE TABLE "payableInvoicePaymentRelation" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "invoiceId" TEXT NOT NULL,
  "paymentId" TEXT NOT NULL,

  CONSTRAINT "payablePayments_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "payablePayments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "payableInvoice" ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT "payablePayments_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payablePayment" ("id") ON UPDATE CASCADE ON DELETE RESTRICT
);

ALTER TABLE "payableInvoicePaymentRelation" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with invoicing_view can view AP invoice/payment relations" ON "payableInvoicePaymentRelation"
  FOR SELECT
  USING (
    coalesce(get_my_claim('invoicing_view')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );
