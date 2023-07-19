CREATE TYPE "accountDocumentLedgerType" AS ENUM (
  'Quote',
  'Order',
  'Invoice',
  'Credit Memo',
  'Blanket Order',
  'Return Order'
);

CREATE TABLE "generalLedger" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "entryNumber" SERIAL,
  "postingDate" DATE NOT NULL,
  "accountNumber" TEXT NOT NULL,
  "description" TEXT,
  "amount" NUMERIC(19, 4) NOT NULL,
  "documentType" "accountDocumentLedgerType", 
  "documentNumber" TEXT,
  "externalDocumentNumber" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  CONSTRAINT "generalLedger_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "generalLedger_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "account"("number") ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE INDEX "generalLedger_accountNumber_idx" ON "generalLedger" ("accountNumber");
CREATE INDEX "generalLedger_postingDate_idx" ON "generalLedger" ("postingDate");

CREATE TYPE "partLedgerType" AS ENUM (
  'Purchase',
  'Sale',
  'Positive Adjmt.',
  'Negative Adjmt.',
  'Transfer',
  'Consumption',
  'Output',
  'Assembly Consumption',
  'Assembly Output'
);

CREATE TYPE "costLedgerType" AS ENUM (
  'Direct Cost',
  'Revaluation',
  'Rounding',
  'Indirect Cost',
  'Variance',
  'Total'
);

CREATE TYPE "partLedgerDocumentType" AS ENUM (
  'Sales Shipment',
  'Sales Invoice',
  'Sales Return Receipt',
  'Sales Credit Memo',
  'Purchase Receipt',
  'Purchase Invoice',
  'Purchase Return Shipment',
  'Purchase Credit Memo',
  'Transfer Shipment',
  'Transfer Receipt',
  'Service Shipment',
  'Service Invoice',
  'Service Credit Memo',
  'Posted Assembly',
  'Inventory Receipt',
  'Inventory Shipment',
  'Direct Transfer'
);

CREATE TABLE "valueLedger" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "entryNumber" SERIAL,
  "postingDate" DATE NOT NULL,
  "partLedgerType" "partLedgerType" NOT NULL,
  "costLedgerType" "costLedgerType" NOT NULL,
  "adjustment" BOOLEAN NOT NULL DEFAULT false,
  "documentType" "partLedgerDocumentType",
  "documentNumber" TEXT,
  "costAmountActual" NUMERIC(19, 4) NOT NULL DEFAULT 0,
  "costAmountExpected" NUMERIC(19, 4) NOT NULL DEFAULT 0,
  "actualCostPostedToGl" NUMERIC(19, 4) NOT NULL DEFAULT 0,
  "expectedCostPostedToGl" NUMERIC(19, 4) NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  CONSTRAINT "valueLedger_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "valueLedgerAccountLedgerRelation" (
  "valueLedgerId" TEXT NOT NULL,
  "generalLedgerId" TEXT NOT NULL,

  CONSTRAINT "valueLedgerAccountLedgerRelation_pkey" PRIMARY KEY ("valueLedgerId", "generalLedgerId"),
  CONSTRAINT "valueLedgerAccountLedgerRelation_valueLedgerId_fkey" FOREIGN KEY ("valueLedgerId") REFERENCES "valueLedger"("id"),
  CONSTRAINT "valueLedgerAccountLedgerRelation_generalLedgerId_fkey" FOREIGN KEY ("generalLedgerId") REFERENCES "generalLedger"("id")
);

CREATE TABLE "partLedger" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "entryNumber" SERIAL,
  "postingDate" DATE NOT NULL,
  "entryType" "partLedgerType" NOT NULL,
  "documentType" "partLedgerDocumentType",
  "documentNumber" TEXT,
  "partId" TEXT NOT NULL,
  "locationId" TEXT,
  "shelfId" TEXT,
  "quantity" NUMERIC(12, 4) NOT NULL,
  "invoicedQuantity" NUMERIC(12, 4) NOT NULL,
  "remainingQuantity" NUMERIC(12, 4) NOT NULL,
  "salesAmount" NUMERIC(12, 4) NOT NULL,
  "costAmount" NUMERIC(12, 4) NOT NULL,
  "open" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  CONSTRAINT "partLedger_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "partLedger_partId_fkey" FOREIGN KEY ("partId") REFERENCES "part"("id") ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT "partLedger_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT "partLedger_shelfId_fkey" FOREIGN KEY ("shelfId") REFERENCES "shelf"("id") ON UPDATE CASCADE ON DELETE SET NULL
);



CREATE OR REPLACE FUNCTION gl_transactions_by_account_number(
  from_date DATE DEFAULT (now() - INTERVAL '100 year'),
  to_date DATE DEFAULT now()
) 
RETURNS TABLE (
  "number" TEXT,
  "balance" NUMERIC(19, 4),
  "balanceAtDate" NUMERIC(19, 4),
  "netChange" NUMERIC(19, 4)
) LANGUAGE "plpgsql" SECURITY INVOKER SET search_path = public
AS $$
  BEGIN
    RETURN QUERY
      SELECT 
        a."number",
        SUM(g."amount") AS "balance",
        SUM(CASE WHEN g."postingDate" <= to_date THEN g."amount" ELSE 0 END) AS "balanceAtDate",
        SUM(CASE WHEN g."postingDate" >= from_date AND g."postingDate" <= to_date THEN g."amount" ELSE 0 END) AS "netChange"
      FROM "account" a
      LEFT JOIN "generalLedger" g ON g."accountNumber" = a."number"
      GROUP BY a."number";
  END;
$$;


