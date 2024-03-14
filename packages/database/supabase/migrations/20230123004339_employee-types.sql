CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "employeeType" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "protected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE,

    CONSTRAINT "employeeType_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "employeeType" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only claims admin can view/modify permissions for employee types" ON "employeeType" FOR ALL USING (is_claims_admin());

