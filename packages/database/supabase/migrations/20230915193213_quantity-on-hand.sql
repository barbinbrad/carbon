CREATE VIEW "part_quantities_view" AS 
  SELECT 
    p."id" AS "partId", 
    loc."id" AS "locationId",
    COALESCE(SUM(pl."quantity"), 0) AS "quantityOnHand",
    COALESCE(pol."quantityToReceive", 0) AS "quantityOnPurchaseOrder",
    0 AS "quantityOnSalesOrder",
    0 AS "quantityOnProdOrder",
    0 AS "quantityAvailable"
  FROM "part" p 
  CROSS JOIN "location" loc
  LEFT JOIN "partLedger" pl
    ON pl."partId" = p."id" AND pl."locationId" = loc."id"
  LEFT JOIN (
    SELECT 
        pol."partId",
        pol."locationId",
        COALESCE(SUM(GREATEST(pol."quantityToReceive", 0)), 0) AS "quantityToReceive"
      FROM "purchaseOrderLine" pol 
      INNER JOIN "purchaseOrder" po 
        ON pol."purchaseOrderId" = po."id"
      WHERE po."status" != 'Draft' 
        AND po."status" != 'Rejected'
        AND po."status" != 'Closed'
      GROUP BY 
        pol."partId",
        pol."locationId"
  ) pol ON pol."partId" = p."id" AND pol."locationId" = loc."id"
  GROUP BY 
    p."id", 
    loc."id",
    pol."quantityToReceive"