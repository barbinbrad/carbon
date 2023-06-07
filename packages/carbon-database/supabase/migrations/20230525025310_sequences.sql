CREATE TABLE "sequence" (
  "table" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "prefix" TEXT,
  "suffix" TEXT,
  "next" BIGINT NOT NULL DEFAULT 1,
  "size" INTEGER NOT NULL DEFAULT 5,
  "step" INTEGER NOT NULL DEFAULT 1,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "updatedBy" TEXT,

  CONSTRAINT "sequence_pkey" PRIMARY KEY ("table"),
  CONSTRAINT "sequence_next_check" CHECK ("next" >= 0),
  CONSTRAINT "sequence_size_check" CHECK ("size" >= 1),
  CONSTRAINT "sequence_step_check" CHECK ("step" >= 1),
  CONSTRAINT "sequence_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "sequence" ("table", "name", "prefix", "suffix", "next", "size", "step")
VALUES ('purchaseOrder', 'Purchase Order', 'PO', NULL, 0, 5, 1);

