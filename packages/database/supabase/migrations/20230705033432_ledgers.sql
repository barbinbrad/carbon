CREATE TYPE "generalLedgerDocumentType" AS ENUM (
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
  "postingDate" DATE NOT NULL DEFAULT CURRENT_DATE,
  "accountNumber" TEXT NOT NULL,
  "description" TEXT,
  "amount" NUMERIC(19, 4) NOT NULL,
  "documentType" "generalLedgerDocumentType", 
  "documentId" TEXT,
  "externalDocumentId" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  CONSTRAINT "generalLedger_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "generalLedger_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "account"("number") ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE INDEX "generalLedger_accountNumber_idx" ON "generalLedger" ("accountNumber");
CREATE INDEX "generalLedger_postingDate_idx" ON "generalLedger" ("postingDate");

ALTER TABLE "generalLedger" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with accounting_view can view general ledger entries" ON "generalLedger"
  FOR SELECT
  USING (
    coalesce(get_my_claim('accounting_view')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );
  

CREATE POLICY "Employees with accounting_create can insert general ledger entries" ON "generalLedger"
  FOR INSERT
  WITH CHECK (   
    coalesce(get_my_claim('accounting_create')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

-- delete and update are not availble for general ledger entries

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
  "postingDate" DATE NOT NULL DEFAULT CURRENT_DATE,
  "partLedgerType" "partLedgerType" NOT NULL,
  "costLedgerType" "costLedgerType" NOT NULL,
  "adjustment" BOOLEAN NOT NULL DEFAULT false,
  "documentType" "partLedgerDocumentType",
  "documentId" TEXT,
  "externalDocumentId" TEXT,
  "costAmountActual" NUMERIC(19, 4) NOT NULL DEFAULT 0,
  "costAmountExpected" NUMERIC(19, 4) NOT NULL DEFAULT 0,
  "actualCostPostedToGl" NUMERIC(19, 4) NOT NULL DEFAULT 0,
  "expectedCostPostedToGl" NUMERIC(19, 4) NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  CONSTRAINT "valueLedger_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "valueLedger" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with accounting_view can view the value ledger" ON "valueLedger"
  FOR SELECT
  USING (
    coalesce(get_my_claim('accounting_view')::boolean, false) = true AND
    (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE TABLE "valueLedgerGeneralLedgerRelation" (
  "valueLedgerId" TEXT NOT NULL,
  "generalLedgerId" TEXT NOT NULL,

  CONSTRAINT "valueLedgerGeneralLedgerRelation_pkey" PRIMARY KEY ("valueLedgerId", "generalLedgerId"),
  CONSTRAINT "valueLedgerGeneralLedgerRelation_valueLedgerId_fkey" FOREIGN KEY ("valueLedgerId") REFERENCES "valueLedger"("id"),
  CONSTRAINT "valueLedgerGeneralLedgerRelation_generalLedgerId_fkey" FOREIGN KEY ("generalLedgerId") REFERENCES "generalLedger"("id")
);

ALTER TABLE "valueLedgerGeneralLedgerRelation" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with accounting_view can view the value ledger/general ledger relations" ON "valueLedgerGeneralLedgerRelation"
  FOR SELECT
  USING (
    coalesce(get_my_claim('accounting_view')::boolean, false) = true AND
    (get_my_claim('role'::text)) = '"employee"'::jsonb
  );


CREATE TABLE "partLedger" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "entryNumber" SERIAL,
  "postingDate" DATE NOT NULL DEFAULT CURRENT_DATE,
  "entryType" "partLedgerType" NOT NULL,
  "documentType" "partLedgerDocumentType",
  "documentId" TEXT,
  "externalDocumentId" TEXT,
  "partId" TEXT NOT NULL,
  "locationId" TEXT,
  "shelfId" TEXT,
  "quantity" NUMERIC(12, 4) NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  CONSTRAINT "partLedger_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "partLedger_partId_fkey" FOREIGN KEY ("partId") REFERENCES "part"("id") ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT "partLedger_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT "partLedger_shelfId_fkey" FOREIGN KEY ("shelfId", "locationId") REFERENCES "shelf"("id", "locationId") ON UPDATE CASCADE ON DELETE SET NULL
);

ALTER TABLE "partLedger" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Certain employees can view the parts ledger" ON "partLedger"
  FOR SELECT
  USING (
    (
      coalesce(get_my_claim('accounting_view')::boolean, false) = true OR
      coalesce(get_my_claim('parts_view')::boolean, false) = true
    )
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );
  
CREATE TABLE "partLedgerValueLedgerRelation" (
  "partLedgerId" TEXT NOT NULL,
  "valueLedgerId" TEXT NOT NULL,

  CONSTRAINT "partLedgerValueLedgerRelation_pkey" PRIMARY KEY ("partLedgerId", "valueLedgerId"),
  CONSTRAINT "partLedgerValueLedgerRelation_partLedgerId_fkey" FOREIGN KEY ("partLedgerId") REFERENCES "partLedger"("id"),
  CONSTRAINT "partLedgerValueLedgerRelation_valueLedgerId_fkey" FOREIGN KEY ("valueLedgerId") REFERENCES "valueLedger"("id")
);

ALTER TABLE "partLedgerValueLedgerRelation" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with accounting_view can view the part ledger/value ledger relations" ON "partLedgerValueLedgerRelation"
  FOR SELECT
  USING (
    coalesce(get_my_claim('accounting_view')::boolean, false) = true AND
    (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE TYPE "supplierLedgerDocumentType" AS ENUM (
  'Payment',
  'Invoice',
  'Credit Memo',
  'Finance Charge Memo',
  'Reminder',
  'Refund'
);

CREATE TABLE "supplierLedger" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "entryNumber" SERIAL,
  "postingDate" DATE NOT NULL DEFAULT CURRENT_DATE,
  "documentType" "supplierLedgerDocumentType",
  "documentId" TEXT,
  "externalDocumentId" TEXT,
  "supplierId" TEXT NOT NULL,
  "amount" NUMERIC(19, 4) NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  CONSTRAINT "supplierLedger_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "supplierLedger_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "supplier"("id") ON UPDATE CASCADE ON DELETE CASCADE
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




