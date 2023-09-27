-- -- TODO:
-- CREATE TABLE "accountsPayablePayment" (
-- );

CREATE TYPE "accountsPayableInvoiceStatus" AS ENUM (
  'Draft', 
  'Issued', 
  'Paid', 
  'Partially Paid', 
  'Voided'
);

CREATE TABLE "accountsPayableInvoice" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "accountsPayableInvoiceId" TEXT NOT NULL,
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

  CONSTRAINT "accountsPayableInvoice_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "accountsPayableInvoice_accountingPeriodId_fkey" FOREIGN KEY ("accountingPeriodId") REFERENCES "accountingPeriod" ("id"),
  CONSTRAINT "accountsPayableInvoice_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "supplier" ("id"),
  CONSTRAINT "accountsPayableInvoice_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact" ("id"),
  CONSTRAINT "accountsPayableInvoice_currencyCode_fkey" FOREIGN KEY ("currencyCode") REFERENCES "currency" ("code"),
  CONSTRAINT "accountsPayableInvoice_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id"),
  CONSTRAINT "accountsPayableInvoice_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id")
);