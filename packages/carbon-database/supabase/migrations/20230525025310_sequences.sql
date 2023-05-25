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
  CONSTRAINT "sequence_table_check" CHECK ("table" ~ '^[a-zA-Z0-9_]+$'),
  CONSTRAINT "sequence_prefix_check" CHECK ("prefix" ~ '^[a-zA-Z0-9_]+$'),
  CONSTRAINT "sequence_suffix_check" CHECK ("suffix" ~ '^[a-zA-Z0-9_]+$'),
  CONSTRAINT "sequence_next_check" CHECK ("next" >= 1),
  CONSTRAINT "sequence_size_check" CHECK ("size" >= 1),
  CONSTRAINT "sequence_step_check" CHECK ("step" >= 1),
  CONSTRAINT "sequence_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "sequence" ("table", "name", "prefix", "suffix", "next", "size", "step")
VALUES ('purchaseOrder', 'Purchase Order', 'PO', NULL, 1, 5, 1);

