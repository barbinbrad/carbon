CREATE TABLE "employee" (
    "id" TEXT NOT NULL,
    "employeeTypeId" TEXT NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "employee_employeeTypeId_fkey" FOREIGN KEY ("employeeTypeId") REFERENCES "employeeType"("id") ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT "employee_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE "employee" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only claims admin can view/modify employees" ON "employee" FOR ALL USING (is_claims_admin());
CREATE POLICY "Anyone that's authenticated can view employees" ON "employee" FOR SELECT USING (auth.role() = 'authenticated');

