CREATE TABLE "partGroup" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "partGroup_pkey" PRIMARY KEY ("id"),
  -- name must be unique
  CONSTRAINT "partGroup_name_key" UNIQUE ("name"),
  -- name must be less than 10 characters
  CONSTRAINT "partGroup_name_check" CHECK (char_length("name") <= 10),
  CONSTRAINT "partGroup_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "partGroup_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);

CREATE TABLE "partAccount" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "partGroupId" TEXT NOT NULL,
  "salesAccountId" TEXT NOT NULL,
  "discountAccountId" TEXT NOT NULL,
  "inventoryAccountId" TEXT NOT NULL,
  "costOfGoodsSoldLaborAccountId" TEXT,
  "costOfGoodsSoldMaterialAccountId" TEXT,
  "costOfGoodsSoldOverheadAccountId" TEXT,
  "costOfGoodsSoldSubcontractorAccountId" TEXT,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "partAccount_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "partAccount_partGroupId_fkey" FOREIGN KEY ("partGroupId") REFERENCES "partGroup"("id") ON DELETE CASCADE,
  CONSTRAINT "partAccount_salesAccountId_fkey" FOREIGN KEY ("salesAccountId") REFERENCES "glAccount"("id") ON DELETE CASCADE,
  CONSTRAINT "partAccount_discountAccountId_fkey" FOREIGN KEY ("discountAccountId") REFERENCES "glAccount"("id") ON DELETE CASCADE,
  CONSTRAINT "partAccount_inventoryAccountId_fkey" FOREIGN KEY ("inventoryAccountId") REFERENCES "glAccount"("id") ON DELETE CASCADE,
  CONSTRAINT "partAccount_costOfGoodsSoldLaborAccountId_fkey" FOREIGN KEY ("costOfGoodsSoldLaborAccountId") REFERENCES "glAccount"("id") ON DELETE CASCADE,
  CONSTRAINT "partAccount_costOfGoodsSoldMaterialAccountId_fkey" FOREIGN KEY ("costOfGoodsSoldMaterialAccountId") REFERENCES "glAccount"("id") ON DELETE CASCADE,
  CONSTRAINT "partAccount_costOfGoodsSoldOverheadAccountId_fkey" FOREIGN KEY ("costOfGoodsSoldOverheadAccountId") REFERENCES "glAccount"("id") ON DELETE CASCADE,
  CONSTRAINT "partAccount_costOfGoodsSoldSubcontractorAccountId_fkey" FOREIGN KEY ("costOfGoodsSoldSubcontractorAccountId") REFERENCES "glAccount"("id") ON DELETE CASCADE,
  CONSTRAINT "partAccount_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "partAccount_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);