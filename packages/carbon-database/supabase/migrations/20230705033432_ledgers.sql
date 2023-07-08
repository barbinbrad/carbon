CREATE TYPE "accountDocumentEntryType" AS ENUM (
  'Quote',
  'Order',
  'Invoice',
  'Credit Memo',
  'Blanket Order',
  'Return Order'
);

CREATE TABLE "accountEntry" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "entryNumber" SERIAL,
  "postingDate" DATE NOT NULL,
  "accountNumber" TEXT NOT NULL,
  "description" TEXT,
  "amount" NUMERIC(19, 4) NOT NULL,
  "documentType" "accountDocumentEntryType", 
  "documentNumber" TEXT,
  "externalDocumentNumber" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  CONSTRAINT "accountEntry_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "accountEntry_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "account"("number")
);

CREATE TYPE "partEntryType" AS ENUM (
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

CREATE TYPE "costEntryType" AS ENUM (
  'Direct Cost',
  'Revaluation',
  'Rounding',
  'Indirect Cost',
  'Variance',
  'Total'
);

CREATE TYPE "partEntryDocumentType" AS ENUM (
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

CREATE TABLE "valueEntry" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "entryNumber" SERIAL,
  "postingDate" DATE NOT NULL,
  "partEntryType" "partEntryType" NOT NULL,
  "costEntryType" "costEntryType" NOT NULL,
  "adjustment" BOOLEAN NOT NULL DEFAULT false,
  "documentType" "partEntryDocumentType",
  "documentNumber" TEXT,
  "costAmountActual" NUMERIC(19, 4) NOT NULL DEFAULT 0,
  "costAmountExpected" NUMERIC(19, 4) NOT NULL DEFAULT 0,
  "actualCostPostedToGl" NUMERIC(19, 4) NOT NULL DEFAULT 0,
  "expectedCostPostedToGl" NUMERIC(19, 4) NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  CONSTRAINT "valueEntry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "valueEntryAccountEntryRelation" (
  "valueEntryId" TEXT NOT NULL,
  "accountEntryId" TEXT NOT NULL,

  CONSTRAINT "valueEntryAccountEntryRelation_pkey" PRIMARY KEY ("valueEntryId", "accountEntryId"),
  CONSTRAINT "valueEntryAccountEntryRelation_valueEntryId_fkey" FOREIGN KEY ("valueEntryId") REFERENCES "valueEntry"("id"),
  CONSTRAINT "valueEntryAccountEntryRelation_accountEntryId_fkey" FOREIGN KEY ("accountEntryId") REFERENCES "accountEntry"("id")
);

CREATE TABLE "partEntry" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "entryNumber" SERIAL,
  "postingDate" DATE NOT NULL,
  "entryType" "partEntryType" NOT NULL,
  "documentType" "partEntryDocumentType",
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

  CONSTRAINT "partEntry_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "partEntry_partId_fkey" FOREIGN KEY ("partId") REFERENCES "part"("id"),
  CONSTRAINT "partEntry_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location"("id"),
  CONSTRAINT "partEntry_shelfId_fkey" FOREIGN KEY ("shelfId") REFERENCES "shelf"("id")

);



