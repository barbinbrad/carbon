CREATE TYPE "accountingPeriodStatus" AS ENUM (
  'Inactive', 
  'Active'
);

CREATE TABLE "fiscalYear" (
  "year" TEXT NOT NULL,
  "startDate" DATE NOT NULL,
  "endDate" DATE NOT NULL,
  "status" "accountingPeriodStatus" NOT NULL DEFAULT 'Inactive',
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "fiscalYear_pkey" PRIMARY KEY ("year"),
  CONSTRAINT "fiscalYear_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE RESTRICT,
  CONSTRAINT "fiscalYear_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE RESTRICT
);

CREATE TABLE "fiscalYearOpeningBalance" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "fiscalYear" TEXT NOT NULL,
  "accountNumber" TEXT NOT NULL,
  "balance" NUMERIC(10, 2) NOT NULL DEFAULT 0,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  CONSTRAINT "fiscalYearOpeningBalance_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "fiscalYearOpeningBalance_fiscalYear_accountNumber_key" UNIQUE ("fiscalYear", "accountNumber"),
  CONSTRAINT "fiscalYearOpeningBalance_fiscalYear_fkey" FOREIGN KEY ("fiscalYear") REFERENCES "fiscalYear" ("year") ON DELETE RESTRICT,
  CONSTRAINT "fiscalYearOpeningBalance_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "account" ("number") ON DELETE RESTRICT,
  CONSTRAINT "fiscalYearOpeningBalance_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE RESTRICT
);

-- TODO: on fiscal year or account creation, create an opening balance entry

CREATE TABLE "accountingPeriod" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "fiscalYear" TEXT NOT NULL,
  "startDate" DATE NOT NULL,
  "endDate" DATE NOT NULL,
  "status" "accountingPeriodStatus" NOT NULL DEFAULT 'Inactive',
  "closedAt" TIMESTAMP WITH TIME ZONE,
  "closedBy" TEXT,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "accountingPeriod_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "accountingPeriod_fiscalYear_fkey" FOREIGN KEY ("fiscalYear") REFERENCES "fiscalYear" ("year") ON DELETE RESTRICT,
  CONSTRAINT "accountingPeriod_closedBy_fkey" FOREIGN KEY ("closedBy") REFERENCES "user" ("id") ON DELETE RESTRICT,
  CONSTRAINT "accountingPeriod_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE RESTRICT,
  CONSTRAINT "accountingPeriod_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE RESTRICT
);

ALTER TABLE "generalLedger" ADD COLUMN "accountingPeriodId" TEXT REFERENCES "accountingPeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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