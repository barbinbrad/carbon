CREATE TABLE "location" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "name" TEXT NOT NULL,
  "timezone" TEXT NOT NULL,
  "latitude" NUMERIC NOT NULL,
  "longitude" NUMERIC NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,

  CONSTRAINT "location_pkey" PRIMARY KEY ("id")
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