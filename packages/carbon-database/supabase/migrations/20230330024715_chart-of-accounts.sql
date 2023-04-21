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

INSERT INTO "currency" ("name", "code", "symbol", "symbolPlacementBefore", "exchangeRate", "currencyPrecision", "isBaseCurrency", "createdBy")
VALUES ('US Dollar', 'USD', '$', true, 1.0000, 2, true, 'system');

CREATE INDEX "currency_code_index" ON "currency" ("code");

ALTER TABLE "currency" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view currencies" ON "currency"
  FOR SELECT
  USING (
    auth.role() = 'authenticated' 
  );

CREATE POLICY "Employees with accounting_create can insert currencies" ON "currency"
  FOR INSERT
  WITH CHECK (   
    coalesce(get_my_claim('accounting_create')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Employees with accounting_update can update currencies" ON "currency"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('accounting_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with accounting_delete can delete currencies" ON "currency"
  FOR DELETE
  USING (
    coalesce(get_my_claim('accounting_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

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
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "accountCategory_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "accountCategory_category_type_key" UNIQUE ("category"),
  CONSTRAINT "accountCategory_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "accountCategory_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);

INSERT INTO "accountCategory" ("category", "type", "normalBalance", "createdBy")
VALUES 
  ('Bank', 'Balance Sheet', 'Credit', 'system'),
  ('Accounts Receivable', 'Balance Sheet', 'Credit', 'system'),
  ('Inventory', 'Balance Sheet', 'Debit', 'system'),
  ('Other Current Asset', 'Balance Sheet', 'Debit', 'system'),
  ('Fixed Asset', 'Balance Sheet', 'Debit', 'system'),
  ('Accumulated Depreciation', 'Balance Sheet', 'Credit', 'system'),
  ('Other Asset', 'Balance Sheet', 'Debit', 'system'),
  ('Accounts Payable', 'Balance Sheet', 'Debit', 'system'),
  ('Other Current Liability', 'Balance Sheet', 'Debit', 'system'),
  ('Long Term Liability', 'Balance Sheet', 'Debit', 'system'),
  ('Equity - No Close', 'Balance Sheet', 'Credit', 'system'),
  ('Equity - Close', 'Balance Sheet', 'Credit', 'system'),
  ('Retained Earnings', 'Balance Sheet', 'Credit', 'system'),
  ('Income', 'Income Statement', 'Credit', 'system'),
  ('Cost of Goods Sold', 'Income Statement', 'Debit', 'system'),
  ('Expense', 'Income Statement', 'Debit', 'system'),
  ('Other Income', 'Income Statement', 'Credit', 'system'),
  ('Other Expense', 'Income Statement', 'Debit', 'system');

ALTER TABLE "accountCategory" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with accounting_view can view account categories" ON "accountCategory"
  FOR SELECT
  USING (
    coalesce(get_my_claim('accounting_view')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );
  

CREATE POLICY "Employees with accounting_create can insert account categories" ON "accountCategory"
  FOR INSERT
  WITH CHECK (   
    coalesce(get_my_claim('accounting_create')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Employees with accounting_update can update account categories" ON "accountCategory"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('accounting_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with accounting_delete can delete account categories" ON "accountCategory"
  FOR DELETE
  USING (
    coalesce(get_my_claim('accounting_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

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

INSERT INTO "account" ("number", "name", "consolidatedRate", "currencyCode", "createdBy")
VALUES ('999999', 'Unassigned', 'Average', 'USD', 'system');

ALTER TABLE "account" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Certain employees can view accounts" ON "account"
  FOR SELECT
  USING (
    (
      coalesce(get_my_claim('accounting_view')::boolean, false) = true OR
      coalesce(get_my_claim('parts_view')::boolean, false) = true OR
      coalesce(get_my_claim('resources_view')::boolean, false) = true OR
      coalesce(get_my_claim('sales_view')::boolean, false) = true OR
      coalesce(get_my_claim('purchasing_view')::boolean, false) = true
    )
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );
  

CREATE POLICY "Employees with accounting_create can insert accounts" ON "account"
  FOR INSERT
  WITH CHECK (   
    coalesce(get_my_claim('accounting_create')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Employees with accounting_update can update accounts" ON "account"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('accounting_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with accounting_delete can delete accounts" ON "account"
  FOR DELETE
  USING (
    coalesce(get_my_claim('accounting_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );