CREATE TABLE "location" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "name" TEXT NOT NULL,
  "timezone" TEXT NOT NULL,
  "latitude" NUMERIC,
  "longitude" NUMERIC,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP,

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
  "sunday" BOOLEAN NOT NULL DEFAULT false,
  "monday" BOOLEAN NOT NULL DEFAULT false,
  "tuesday" BOOLEAN NOT NULL DEFAULT false,
  "wednesday" BOOLEAN NOT NULL DEFAULT false,
  "thursday" BOOLEAN NOT NULL DEFAULT false,
  "friday" BOOLEAN NOT NULL DEFAULT false,
  "saturday" BOOLEAN NOT NULL DEFAULT false,
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


CREATE TABLE "employeeJob" (
  "id" TEXT NOT NULL,
  "locationId" TEXT,
  "shiftId" TEXT,
  "managerId" TEXT,
  "title" TEXT,

  CONSTRAINT "employeeJob_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "employeeJob_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "employeeJob_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "employeeJob_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "shift"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "employeeJob_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE POLICY "Employees can view employee jobs" ON "employeeJob"
  FOR SELECT
  USING (
    auth.role() = 'authenticated' 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with resources_create can insert employee jobs" ON "employeeJob"
  FOR INSERT
  WITH CHECK (   
    coalesce(get_my_claim('resources_create')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Employees with resources_update can update employee jobs" ON "employeeJob"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('resources_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with resources_delete can delete employee jobs" ON "employeeJob"
  FOR DELETE
  USING (
    coalesce(get_my_claim('resources_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );