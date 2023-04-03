CREATE TABLE "currency" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "name" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "symbol" TEXT,
  "symbolPlacementBefore" BOOLEAN NOT NULL DEFAULT true,
  "exchangeRate" NUMERIC(10,4) NOT NULL DEFAULT 1.0000,
  "currencyPrecision" INTEGER NOT NULL DEFAULT 2,
  "isBaseCurrency" BOOLEAN NOT NULL DEFAULT false,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "currency_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "currency_code_key" UNIQUE ("code"),
  CONSTRAINT "currency_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "currency_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);

CREATE INDEX "currency_code_index" ON "currency" ("code");

CREATE TYPE "glAccountCategory" AS ENUM (
  'Bank',
  'Accounts Receivable',
  'Inventory',
  'Other Current Asset',
  'Fixed Asset',
  'Accumulated Depreciation',
  'Other Asset',
  'Accounts Payable',
  'Other Current Liability',
  'Long Term Liability',
  'Equity - No Close',
  'Equity - Close',
  'Retained Earnings',
  'Income',
  'Cost of Goods Sold',
  'Expense',
  'Other Income',
  'Other Expense'
);

CREATE TYPE "glAccountType" AS ENUM (
  'Balance Sheet',
  'Income Statement'
);

CREATE TYPE "glNormalBalance" AS ENUM (
  'Debit',
  'Credit'
);

CREATE TABLE "accountCategory" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "category" "glAccountCategory" NOT NULL,
  "type" "glAccountType" NOT NULL,
  "normalBalance" "glNormalBalance" NOT NULL,

  CONSTRAINT "accountCategory_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "accountCategory_category_type_key" UNIQUE ("category")
);

INSERT INTO "accountCategory" ("category", "type", "normalBalance")
VALUES 
  ('Bank', 'Balance Sheet', 'Credit'),
  ('Accounts Receivable', 'Balance Sheet', 'Credit'),
  ('Inventory', 'Balance Sheet', 'Debit'),
  ('Other Current Asset', 'Balance Sheet', 'Debit'),
  ('Fixed Asset', 'Balance Sheet', 'Debit'),
  ('Accumulated Depreciation', 'Balance Sheet', 'Credit'),
  ('Other Asset', 'Balance Sheet', 'Debit'),
  ('Accounts Payable', 'Balance Sheet', 'Debit'),
  ('Other Current Liability', 'Balance Sheet', 'Debit'),
  ('Long Term Liability', 'Balance Sheet', 'Debit'),
  ('Equity - No Close', 'Balance Sheet', 'Credit'),
  ('Equity - Close', 'Balance Sheet', 'Credit'),
  ('Retained Earnings', 'Balance Sheet', 'Credit'),
  ('Income', 'Income Statement', 'Credit'),
  ('Cost of Goods Sold', 'Income Statement', 'Debit'),
  ('Expense', 'Income Statement', 'Debit'),
  ('Other Income', 'Income Statement', 'Credit'),
  ('Other Expense', 'Income Statement', 'Debit');

CREATE TYPE "consolidatedRate" AS ENUM (
  'Average',
  'Current',
  'Historical'
);

CREATE TABLE "account" (
  "number" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "accountCategoryId" TEXT,
  "controlAccount" BOOLEAN NOT NULL DEFAULT false,
  "cashAccount" BOOLEAN NOT NULL DEFAULT false,
  "consolidatedRate" "consolidatedRate",
  "currencyCode" TEXT,
  "parentAccountNumber" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "account_pkey" PRIMARY KEY ("number"),
  CONSTRAINT "account_name_key" UNIQUE ("name"),
  CONSTRAINT "account_accountCategoryId_fkey" FOREIGN KEY ("accountCategoryId") REFERENCES "accountCategory"("id"),
  CONSTRAINT "account_currencyCode_fkey" FOREIGN KEY ("currencyCode") REFERENCES "currency"("code") ON DELETE SET NULL,
  CONSTRAINT "account_parentAccountNumber_fkey" FOREIGN KEY ("parentAccountNumber") REFERENCES "account"("number"),
  CONSTRAINT "account_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "account_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);
