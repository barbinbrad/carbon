CREATE TABLE "location" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "name" TEXT NOT NULL,
  "timezone" TEXT NOT NULL,
  "latitude" NUMERIC,
  "longitude" NUMERIC,

  CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "location" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees can view locations" ON "location"
  FOR SELECT
  USING (
    auth.role() = 'authenticated' 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with resources_create can insert locations" ON "location"
  FOR INSERT
  WITH CHECK (   
    coalesce(get_my_claim('resources_create')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Employees with resources_update can update locations" ON "location"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('resources_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with resources_delete can delete locations" ON "location"
  FOR DELETE
  USING (
    coalesce(get_my_claim('resources_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );


CREATE TABLE "shift" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "name" TEXT NOT NULL,
  "startTime" TIME NOT NULL,
  "endTime" TIME NOT NULL,
  "locationId" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  
  CONSTRAINT "shifts_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "shifts_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE "shift" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees can view shifts" ON "shift"
  FOR SELECT
  USING (
    auth.role() = 'authenticated' 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with resources_create can insert shifts" ON "shift"
  FOR INSERT
  WITH CHECK (   
    coalesce(get_my_claim('resources_create')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Employees with resources_update can update shifts" ON "shift"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('resources_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with resources_delete can delete shifts" ON "shift"
  FOR DELETE
  USING (
    coalesce(get_my_claim('resources_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );


CREATE TABLE "employeeShift" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "employeeId" TEXT NOT NULL,
  "shiftId" TEXT NOT NULL,

  CONSTRAINT "employeeShift_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "employeeShift_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "employeeShift_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "shift"("id") ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT uq_employeeShift_employeeId_shiftId UNIQUE ( "employeeId", "shiftId")
);

ALTER TABLE "employeeShift" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees can view employee shifts" ON "employeeShift"
  FOR SELECT
  USING (
    auth.role() = 'authenticated' 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with resources_create can insert employee shifts" ON "employeeShift"
  FOR INSERT
  WITH CHECK (   
    coalesce(get_my_claim('resources_create')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Employees with resources_update can update employee shifts" ON "employeeShift"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('resources_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with resources_delete can delete employee shifts" ON "employeeShift"
  FOR DELETE
  USING (
    coalesce(get_my_claim('resources_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );
