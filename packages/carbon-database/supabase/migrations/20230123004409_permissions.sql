CREATE TABLE "feature" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "feature_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "feature" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only claims admin can view/modify modules" ON "feature" FOR ALL USING (is_claims_admin());

CREATE TABLE "employeeTypePermission" (
    "employeeTypeId" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,
    "create" BOOLEAN NOT NULL DEFAULT false,
    "delete" BOOLEAN NOT NULL DEFAULT false,
    "update" BOOLEAN NOT NULL DEFAULT false,
    "view" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "employeeTypePermission_pkey" PRIMARY KEY ("employeeTypeId", "featureId"),
    CONSTRAINT "employeeTypePermission_employeeTypeId_fkey" FOREIGN KEY ("employeeTypeId") REFERENCES "employeeType"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "employeeTypePermission_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "feature"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE "employeeTypePermission" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only claims admin can view/modify permissions for employee types" ON "employeeTypePermission" FOR ALL USING (is_claims_admin());


