CREATE TYPE "accountCategoryType" AS ENUM (
  'Asset',
  'Liability',
  'Equity',
  'Revenue',
  'Expense'
);

CREATE TABLE "glAccountCategory" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "name" TEXT NOT NULL,
  "categoryType" "accountCategoryType" NOT NULL,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "glAccountCategory_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "glAccountCategory_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "glAccountCategory_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);

CREATE TYPE "glAccountType" AS ENUM (
  'Balance Sheet',
  'Income Statement'
);

CREATE TYPE "glNormalBalance" AS ENUM (
  'Debit',
  'Credit'
);

CREATE TYPE "glCashFlowType" AS ENUM (
  'Operating',
  'Investing',
  'Financing'
);

CREATE TABLE "glChart" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "accountCategoryId" TEXT NOT NULL,
  "accountType" "glAccountType" NOT NULL,
  "normalBalance" "glNormalBalance" NOT NULL DEFAULT 'Debit',
  "cashFlowType" "glCashFlowType",
  "cashAndCashEquivalents" BOOLEAN NOT NULL DEFAULT false,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "glChart_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "glChart_accountCategoryId_fkey" FOREIGN KEY ("accountCategoryId") REFERENCES "glAccountCategory"("id"),
  CONSTRAINT "glChart_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "glChart_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);

CREATE TABLE "glDivision" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "glDivision_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "glDivision_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "glDivision_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);

CREATE TABLE "glAccount" (
  "id" TEXT NOT NULL,
  "divisionId" TEXT NOT NULL,
  "chartId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "glAccount_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "glAccount_accountId_key" UNIQUE ("id", "divisionId", "chartId"),
  CONSTRAINT "glAccount_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "glDivision"("id"),
  CONSTRAINT "glAccount_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "glChart"("id"),
  CONSTRAINT "glAccount_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "glAccount_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);

ALTER TABLE "glChart" 
  ADD COLUMN "parentAccountId" TEXT,
  ADD COLUMN "parentChartId" TEXT,
  ADD CONSTRAINT "glChart_parentAccountId_fkey" FOREIGN KEY ("parentAccountId") REFERENCES "glAccount"("id"),
  ADD CONSTRAINT "glChart_parentChartId_fkey" FOREIGN KEY ("parentChartId") REFERENCES "glChart"("id");

ALTER TABLE "glDivision"
  ADD COLUMN "retainedEarningsAccountId" TEXT NOT NULL,
  ADD CONSTRAINT "glDivision_retainedEarningsAccountId_fkey" FOREIGN KEY ("retainedEarningsAccountId") REFERENCES "glAccount"("id");
  

