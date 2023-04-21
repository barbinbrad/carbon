CREATE TABLE "holiday" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "name" TEXT NOT NULL,
  "date" DATE NOT NULL,
  "year" INTEGER GENERATED ALWAYS AS (EXTRACT(YEAR FROM "date")) STORED,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP,

  CONSTRAINT "holiday_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "uq_holiday_date" UNIQUE ("date"),
  CONSTRAINT "holiday_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "holiday_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE VIEW "holiday_years" AS SELECT DISTINCT "year" FROM "holiday";

ALTER TABLE "holiday" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees can view holidays" ON "holiday"
  FOR SELECT
  USING (
    auth.role() = 'authenticated' 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with resources_create can insert holidays" ON "holiday"
  FOR INSERT
  WITH CHECK (   
    coalesce(get_my_claim('resources_create')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Employees with resources_update can update holidays" ON "holiday"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('resources_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with resources_delete can delete holidays" ON "holiday"
  FOR DELETE
  USING (
    coalesce(get_my_claim('resources_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );