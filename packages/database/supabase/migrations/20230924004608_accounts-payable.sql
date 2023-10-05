CREATE TYPE "purchaseInvoiceStatus" AS ENUM (
  'Draft', 
  'Issued',
  'Return',
  'Debit Note Issued',
  'Paid', 
  'Partially Paid', 
  'Overdue',
  'Voided'
);

CREATE TABLE "purchaseInvoice" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "invoiceId" TEXT NOT NULL,
  "status" "purchaseInvoiceStatus" NOT NULL DEFAULT 'Draft',
  "supplierId" TEXT,
  "supplierReference" TEXT,
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

  CONSTRAINT "purchaseInvoice_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "purchaseInvoice_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "supplier" ("id"),
  CONSTRAINT "purchaseInvoice_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact" ("id"),
  CONSTRAINT "purchaseInvoice_currencyCode_fkey" FOREIGN KEY ("currencyCode") REFERENCES "currency" ("code"),
  CONSTRAINT "purchaseInvoice_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id"),
  CONSTRAINT "purchaseInvoice_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id")
);

CREATE INDEX "purchaseInvoice_invoiceId_idx" ON "purchaseInvoice" ("invoiceId");
CREATE INDEX "purchaseInvoice_status_idx" ON "purchaseInvoice" ("status");
CREATE INDEX "purchaseInvoice_supplierId_idx" ON "purchaseInvoice" ("supplierId");
CREATE INDEX "purchaseInvoice_dateDue_idx" ON "purchaseInvoice" ("dateDue");
CREATE INDEX "purchaseInvoice_datePaid_idx" ON "purchaseInvoice" ("datePaid");

ALTER TABLE "purchaseInvoice" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with invoicing_view can view AP invoices" ON "purchaseInvoice"
  FOR SELECT
  USING (
    coalesce(get_my_claim('invoicing_view')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with invoicing_create can insert AP invoices" ON "purchaseInvoice"
  FOR INSERT
  WITH CHECK (   
    coalesce(get_my_claim('invoicing_create')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Employees with invoicing_update can update AP invoices" ON "purchaseInvoice"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('invoicing_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with invoicing_delete can delete AP invoices" ON "purchaseInvoice"
  FOR DELETE
  USING (
    coalesce(get_my_claim('invoicing_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE TABLE "purchaseInvoiceStatusHistory" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "invoiceId" TEXT NOT NULL,
  "status" "purchaseInvoiceStatus" NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  CONSTRAINT "purchaseInvoiceStatusHistory_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "purchaseInvoiceStatusHistory_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "purchaseInvoice" ("id") ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE "purchaseInvoiceStatusHistory" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with invoicing_view can view AP invoices status history" ON "purchaseInvoiceStatusHistory"
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

CREATE TABLE "purchaseInvoiceLine" (
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

  CONSTRAINT "purchaseInvoiceLines_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "purchaseInvoiceLines_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "purchaseInvoice" ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT "purchaseInvoiceLines_partId_fkey" FOREIGN KEY ("partId") REFERENCES "part" ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT "purchaseInvoiceLines_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "account" ("number") ON UPDATE CASCADE ON DELETE RESTRICT,
  -- CONSTRAINT "purchaseInvoiceLines_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "fixedAsset" ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT "purchaseInvoiceLines_currencyCode_fkey" FOREIGN KEY ("currencyCode") REFERENCES "currency" ("code") ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT "purchaseInvoiceLines_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT "purchaseInvoiceLines_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON UPDATE CASCADE ON DELETE RESTRICT
);

ALTER TABLE "purchaseInvoiceLine" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with invoicing_view can view AP invoice lines" ON "purchaseInvoiceLine"
  FOR SELECT
  USING (
    coalesce(get_my_claim('invoicing_view')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with invoicing_create can insert AP invoice lines" ON "purchaseInvoiceLine"
  FOR INSERT
  WITH CHECK (   
    coalesce(get_my_claim('invoicing_create')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Employees with invoicing_update can update AP invoice lines" ON "purchaseInvoiceLine"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('invoicing_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with invoicing_delete can delete AP invoice lines" ON "purchaseInvoiceLine"
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

CREATE TABLE "purchaseInvoicePaymentRelation" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "invoiceId" TEXT NOT NULL,
  "paymentId" TEXT NOT NULL,

  CONSTRAINT "payablePayments_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "payablePayments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "purchaseInvoice" ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT "payablePayments_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payablePayment" ("id") ON UPDATE CASCADE ON DELETE RESTRICT
);

ALTER TABLE "purchaseInvoicePaymentRelation" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with invoicing_view can view AP invoice/payment relations" ON "purchaseInvoicePaymentRelation"
  FOR SELECT
  USING (
    coalesce(get_my_claim('invoicing_view')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );


CREATE OR REPLACE VIEW "purchaseInvoices" AS 
  SELECT 
    pi."id",
    pi."invoiceId",
    pi."supplierId",
    pi."supplierReference",
    pi."contactId",
    pi."dateIssued",
    pi."dateDue",
    pi."datePaid",
    pi."currencyCode",
    pi."exchangeRate",
    pi."subtotal",
    pi."totalDiscount",
    pi."totalAmount",
    pi."totalTax",
    pi."balance",
    pi."createdBy",
    pi."createdAt",
    pi."updatedBy",
    pi."updatedAt",
    CASE
      WHEN pi."dateDue" < CURRENT_DATE AND pi."status" = 'Issued' THEN 'Overdue'
      ELSE pi."status"
    END AS status,
    s."name" AS "supplierName",
    c."fullName" AS "contactName",
    u."avatarUrl" AS "createdByAvatar",
    u."fullName" AS "createdByFullName",
    u2."avatarUrl" AS "updatedByAvatar",
    u2."fullName" AS "updatedByFullName"
  FROM "purchaseInvoice" pi
    LEFT JOIN "supplier" s ON s.id = pi."supplierId"
    LEFT JOIN "supplierContact" sc ON sc.id = pi."contactId"
    LEFT JOIN "contact" c ON c.id = sc."contactId"
    LEFT JOIN "user" u ON u."id" = pi."createdBy"
    LEFT JOIN "user" u2 ON u2."id" = pi."updatedBy";



ALTER VIEW "purchaseInvoices" SET (security_invoker = on);