CREATE TABLE "currency" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "name" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "symbol" TEXT,
  "exchangeRate" NUMERIC(20,8) NOT NULL DEFAULT 1,
  "decimalPlaces" INTEGER NOT NULL DEFAULT 2,
  "isBaseCurrency" BOOLEAN NOT NULL DEFAULT false,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "currency_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "currency_code_key" UNIQUE ("code"),
  CONSTRAINT "currency_exchangeRate_check" CHECK ("exchangeRate" > 0),
  CONSTRAINT "currency_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);

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

CREATE TYPE "glAccountClass" AS ENUM (
  'Asset',
  'Liability',
  'Equity',
  'Revenue',
  'Expense'
);

CREATE TYPE "glIncomeBalance" AS ENUM (
  'Balance Sheet',
  'Income Statement'
);

CREATE TYPE "glAccountType" AS ENUM (
  'Posting',
  'Total',
  'Begin Total',
  'End Total'
);

CREATE TABLE "accountCategory" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "category" TEXT NOT NULL,
  "class" "glAccountClass" NOT NULL,
  "incomeBalance" "glIncomeBalance" NOT NULL,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "accountCategory_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "accountCategory_unique_category" UNIQUE ("category"),
  CONSTRAINT "accountCategory_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "accountCategory_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);

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

CREATE TYPE "glConsolidatedRate" AS ENUM (
  'Average',
  'Current',
  'Historical'
);

CREATE TABLE "accountSubcategory" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "name" TEXT NOT NULL,
  "accountCategoryId" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "accountSubcategory_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "accountSubcategory_name_key" UNIQUE ("name"),
  CONSTRAINT "accountSubcategory_accountCategoryId_fkey" FOREIGN KEY ("accountCategoryId") REFERENCES "accountCategory"("id"),
  CONSTRAINT "accountSubcategory_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "accountSubcategory_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);

CREATE INDEX "accountSubcategory_accountCategoryId_idx" ON "accountSubcategory" ("accountCategoryId");

ALTER TABLE "accountSubcategory" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with accounting_view can view account subcategories" ON "accountSubcategory"
  FOR SELECT
  USING (
    coalesce(get_my_claim('accounting_view')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );
  

CREATE POLICY "Employees with accounting_create can insert account subcategories" ON "accountSubcategory"
  FOR INSERT
  WITH CHECK (   
    coalesce(get_my_claim('accounting_create')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Employees with accounting_update can update account subcategories" ON "accountSubcategory"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('accounting_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with accounting_delete can delete account subcategories" ON "accountSubcategory"
  FOR DELETE
  USING (
    coalesce(get_my_claim('accounting_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE TABLE "account" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "number" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" "glAccountType" NOT NULL,
  "class" "glAccountClass",
  "accountCategoryId" TEXT,
  "accountSubcategoryId" TEXT,
  "incomeBalance" "glIncomeBalance" NOT NULL,
  "consolidatedRate" "glConsolidatedRate",
  "directPosting" BOOLEAN NOT NULL DEFAULT false,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "account_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "account_number_key" UNIQUE ("number"),
  CONSTRAINT "account_name_key" UNIQUE ("name"),
  CONSTRAINT "account_accountCategoryId_fkey" FOREIGN KEY ("accountCategoryId") REFERENCES "accountCategory"("id"),
  CONSTRAINT "account_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "account_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);

CREATE INDEX "account_number_idx" ON "account" ("number");
CREATE INDEX "account_type_idx" ON "account" ("type");
CREATE INDEX "account_incomeBalance_idx" ON "account" ("incomeBalance");
CREATE INDEX "account_accountCategoryId_idx" ON "account" ("accountCategoryId");
CREATE INDEX "account_accountSubcategoryId_idx" ON "account" ("accountSubcategoryId");


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

CREATE OR REPLACE VIEW "accountCategories" AS
  SELECT
    "id",
    "category",
    "class",
    "incomeBalance",
    "createdBy",
    "createdAt",
    "updatedBy",
    "updatedAt",
    (SELECT count(*) FROM "accountSubcategory" WHERE "accountSubcategory"."accountCategoryId" = "accountCategory"."id" AND "accountSubcategory"."active" = true) AS "subCategoriesCount"
  FROM "accountCategory"
;

CREATE OR REPLACE VIEW "accounts" AS
  SELECT 
    "id",
    "number",
    "name",
    "type",
    "accountCategoryId",
    (SELECT "category" FROM "accountCategory" WHERE "accountCategory"."id" = "account"."accountCategoryId") AS "accountCategory",
    "accountSubcategoryId",
    (SELECT "name" FROM "accountSubcategory" WHERE "accountSubcategory"."id" = "account"."accountSubcategoryId") AS "accountSubCategory",
    "class",
    "incomeBalance",
    "consolidatedRate",
    "directPosting",
    "active",
    "createdBy",
    "createdAt",
    "updatedBy",
    "updatedAt"
  FROM "account"
;