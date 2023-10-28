CREATE TABLE "sequence" (
  "id" TEXT GENERATED ALWAYS AS (
    CASE WHEN prefix IS NULL AND suffix IS NULL THEN 
      repeat('0', "size")
    WHEN prefix IS NULL THEN
      repeat('0', "size") || suffix
    WHEN suffix IS NULL THEN
      prefix || repeat('0', "size")
    ELSE
      prefix || repeat('0', "size") || suffix
    END
  )
  STORED,
  "table" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "prefix" TEXT,
  "suffix" TEXT,
  "next" BIGINT NOT NULL DEFAULT 1,
  "size" INTEGER NOT NULL DEFAULT 5,
  "step" INTEGER NOT NULL DEFAULT 1,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "updatedBy" TEXT,

  CONSTRAINT "sequence_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "sequence_next_check" CHECK ("next" >= 0),
  CONSTRAINT "sequence_size_check" CHECK ("size" >= 1),
  CONSTRAINT "sequence_step_check" CHECK ("step" >= 1),
  CONSTRAINT "sequence_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

