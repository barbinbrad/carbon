
CREATE TYPE factor AS ENUM (
  'Hours/Piece',
  'Hours/100 Pieces', 
  'Hours/1000 Pieces',
  'Minutes/Piece',
  'Minutes/100 Pieces',
  'Minutes/1000 Pieces',
  'Pieces/Hour',
  'Pieces/Minute',
  'Seconds/Piece',
  'Total Hours',
  'Total Minutes'
);

CREATE TABLE "department" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "name" TEXT NOT NULL UNIQUE,
  "color" TEXT NOT NULL DEFAULT '#000000',

  CONSTRAINT "department_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "department_colorCheck" CHECK ("color" is null or "color" ~* '^#[a-f0-9]{6}$')
);

CREATE TABLE "workCellType" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "name" TEXT NOT NULL UNIQUE,
  "color" TEXT NOT NULL DEFAULT '#000000',
  "description" TEXT,

  CONSTRAINT "workCellType_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "workCellType_colorCheck" CHECK ("color" is null or "color" ~* '^#[a-f0-9]{6}$')
);

CREATE TABLE "workCell" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "name" TEXT NOT NULL,
  "description" TEXT,
  "defaultProcessId" TEXT NOT NULL,
  "defaultStandardFactor" factor NOT NULL DEFAULT 'Hours/Piece',
  "departmentId" TEXT NOT NULL,
  "locationId" TEXT,
  "setupHours" NUMERIC NOT NULL DEFAULT 0,
  "workCellTypeId" TEXT NOT NULL,

  CONSTRAINT "workCell_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "workCell_defaultProcessId_fkey" FOREIGN KEY ("defaultProcessId") REFERENCES "ability"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "workCell_workCellTypeId_fkey" FOREIGN KEY ("workCellTypeId") REFERENCES "workCellType"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "workCell_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT "uq_workCell_name_departmentId" UNIQUE ("name", "departmentId")
);

ALTER TABLE "employeeJob"
  ADD COLUMN "departmentId" TEXT REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD COLUMN "workCellId" TEXT REFERENCES "workCell"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "crew" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "name" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "crewLeaderId" TEXT,
  "groupId" TEXT NOT NULL,
  "workCellId" TEXT,

  CONSTRAINT "crew_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "crew_crewLeaderId_fkey" FOREIGN KEY ("crewLeaderId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "crew_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "crew_workCellId_fkey" FOREIGN KEY ("workCellId") REFERENCES "workCell"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "crewAbility" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "crewId" TEXT NOT NULL,
  "abilityId" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,

  CONSTRAINT "crewAbility_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "crewAbility_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "crew"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "crewAbility_abilityId_fkey" FOREIGN KEY ("abilityId") REFERENCES "ability"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "equipmentType" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "name" TEXT NOT NULL UNIQUE,
  "color" TEXT NOT NULL DEFAULT '#000000',
  "description" TEXT,

  CONSTRAINT "equipmentType_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "equipmentType_colorCheck" CHECK ("color" is null or "color" ~* '^#[a-f0-9]{6}$')
);

CREATE TABLE "equipment" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "name" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "equipmentTypeId" TEXT NOT NULL,
  "operatorsRequired" NUMERIC NOT NULL DEFAULT 1,
  "workCellId" TEXT,

  CONSTRAINT "equipment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "equipment_equipmentTypeId_fkey" FOREIGN KEY ("equipmentTypeId") REFERENCES "equipmentType"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "equipment_workCellId_fkey" FOREIGN KEY ("workCellId") REFERENCES "workCell"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE "ability" 
  ADD COLUMN "requiresEquipment" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "equipmentTypeId" TEXT,
  ADD COLUMN "requiresWorkCell" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "workCellTypeId" TEXT;

