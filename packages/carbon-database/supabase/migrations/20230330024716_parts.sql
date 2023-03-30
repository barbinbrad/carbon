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

