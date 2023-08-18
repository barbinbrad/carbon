CREATE TYPE "receiptSourceDocument" AS ENUM (
  'Sales Order',
  'Sales Return Order',
  'Purchase Order',
  'Purchase Return Order',
  'Inbound Transfer',
  'Outbound Transfer',
  'Manufacturing Consumption',
  'Manufacturing Output'
);

CREATE TABLE "receipt" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "receiptId" TEXT NOT NULL,
  "locationId" TEXT,
  "sourceDocument" "receiptSourceDocument",
  "sourceDocumentId" TEXT,
  "sourceDocumentReadableId" TEXT,
  "supplierId" TEXT,
  "postingDate" DATE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "updatedBy" TEXT,

  CONSTRAINT "receipt_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "receipt_receiptId_key" UNIQUE ("receiptId"),
  CONSTRAINT "receipt_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "receipt_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "supplier" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "receipt_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "receipt_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "receipt_receiptId_idx" ON "receipt" ("receiptId");
CREATE INDEX "receipt_locationId_idx" ON "receipt" ("locationId");
CREATE INDEX "receipt_sourceDocumentId_idx" ON "receipt" ("sourceDocumentId");
CREATE INDEX "receipt_supplierId_idx" ON "receipt" ("supplierId");

INSERT INTO "sequence" ("table", "name", "prefix", "suffix", "next", "size", "step")
VALUES ('receipt', 'Receipt', 'RE', NULL, 0, 6, 1);

CREATE TABLE "receiptLine" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "receiptId" TEXT NOT NULL,
  "lineId" TEXT,
  "partId" TEXT NOT NULL,
  "orderQuantity" NUMERIC(18, 4) NOT NULL,
  "outstandingQuantity" NUMERIC(18, 4) NOT NULL DEFAULT 0,
  "receivedQuantity" NUMERIC(18, 4) NOT NULL DEFAULT 0,
  "locationId" TEXT,
  "shelfId" TEXT,
  "unitOfMeasure" TEXT NOT NULL,
  "unitPrice" NUMERIC(18, 4) NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "updatedBy" TEXT,

  CONSTRAINT "receiptLine_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "receiptLine_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "receipt" ("receiptId") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "receiptLine_partId_fkey" FOREIGN KEY ("partId") REFERENCES "part" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "receiptLine_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "receiptLine_shelfId_fkey" FOREIGN KEY ("shelfId", "locationId") REFERENCES "shelf" ("id", "locationId") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "receiptLine_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "receiptLine_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "receiptLine_receiptId_idx" ON "receiptLine" ("receiptId");
CREATE INDEX "receiptLine_lineId_idx" ON "receiptLine" ("lineId");
CREATE INDEX "receiptLine_receiptId_lineId_idx" ON "receiptLine" ("receiptId", "lineId");

CREATE VIEW "receipt_quantity_received_by_line" AS 
  SELECT
    r."sourceDocumentId",
    l."lineId",
    SUM(l."receivedQuantity") AS "receivedQuantity"
  FROM "receipt" r 
  INNER JOIN "receiptLine" l
    ON l."receiptId" = r."receiptId"
  GROUP BY r."sourceDocumentId", l."lineId";
