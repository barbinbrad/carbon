CREATE TABLE "ability" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "name" TEXT NOT NULL,
  "curve" JSONB NOT NULL DEFAULT '{"data":[{"id":0,"week":0,"value":50},{"id":1,"week":1,"value":80},{"id":2,"week":2,"value":90},{"id":3,"week":3,"value":100}]}'::jsonb,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "updatedBy" TEXT,

  CONSTRAINT "abilities_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "abilities_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "abilities_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE "ability" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with resources_view can view abilities" ON "ability"
  FOR SELECT
  USING (
    coalesce(get_my_claim('resources_view')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with resources_create can insert abilities" ON "ability"
  FOR INSERT
  WITH CHECK (   
    coalesce(get_my_claim('resources_create')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Employees with resources_update can update abilities" ON "ability"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('resources_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with resources_delete can delete abilities" ON "ability"
  FOR DELETE
  USING (
    coalesce(get_my_claim('resources_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE TABLE "employeeAbility" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "employeeId" TEXT NOT NULL,
  "abilityId" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "lastTrainingDate" DATE,
  "trainingDays" INTEGER NOT NULL DEFAULT 0,
  "trainingCompleted" BOOLEAN DEFAULT false,

  CONSTRAINT "employeeAbilities_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "employeeAbilities_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "employeeAbilities_abilityId_fkey" FOREIGN KEY ("abilityId") REFERENCES "ability"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE "employeeAbility" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with resources_view can view employeeAbilities" ON "employeeAbility"
  FOR SELECT
  USING (
    coalesce(get_my_claim('resources_view')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with resources_create can insert employeeAbilities" ON "employeeAbility"
  FOR INSERT
  WITH CHECK (   
    coalesce(get_my_claim('resources_create')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Employees with resources_update can update employeeAbilities" ON "employeeAbility"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('resources_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with resources_delete can delete employeeAbilities" ON "employeeAbility"
  FOR DELETE
  USING (
    coalesce(get_my_claim('resources_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );
