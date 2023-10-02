CREATE OR REPLACE VIEW "receiptsPostedNotInvoiced" AS 
  SELECT 
    r."id",
    r."receiptId",
    r."sourceDocument",
    r."sourceDocumentId",
    r."sourceDocumentReadableId",
    r."postingDate",
    r."supplierId",
    s."name" AS "supplierName",
    SUM(l."receivedQuantity" * l."unitPrice") AS "estimatedCost"
  FROM "receipt" r
  INNER JOIN "receiptLine" l
    ON l."receiptId" = r."receiptId"
  INNER JOIN "supplier" s
    ON s."id" = r."supplierId"
  WHERE r."status" = 'Posted'
    AND r."invoiced" = FALSE
    AND r."sourceDocument" != 'Manufacturing Consumption'
    AND r."sourceDocument" != 'Manufacturing Output'
    AND r."sourceDocument" != 'Inbound Transfer'
    AND r."sourceDocument" != 'Outbound Transfer'

  GROUP BY 
    r."id",
    r."receiptId",
    r."sourceDocument",
    r."sourceDocumentId",
    r."sourceDocumentReadableId",
    r."postingDate",
    r."supplierId",
    s."name";
;

CREATE OR REPLACE VIEW "totalReceiptsPostedNotInvoiced" AS 
  SELECT SUM(l."receivedQuantity" * l."unitPrice") AS "total"
  FROM "receipt" r
  INNER JOIN "receiptLine" l
    ON l."receiptId" = r."receiptId"
  WHERE r."status" = 'Posted'
    AND r."invoiced" = FALSE
    AND r."sourceDocument" != 'Manufacturing Consumption'
    AND r."sourceDocument" != 'Manufacturing Output'
    AND r."sourceDocument" != 'Inbound Transfer'
    AND r."sourceDocument" != 'Outbound Transfer';