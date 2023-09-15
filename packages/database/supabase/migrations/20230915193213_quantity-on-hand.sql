CREATE VIEW "part_inventory_view" AS 
  SELECT
    pi."partId",
    pi."locationId",
    pi."defaultShelfId",
    COALESCE(SUM(pl."quantity"), 0) AS "quantityOnHand",
    COALESCE(pol."quantityToReceive", 0) AS "quantityOnPurchaseOrder",
    0 AS "quantityOnSalesOrder",
    0 AS "quantityOnProdOrder",
    0 AS "quantityAvailable"
  FROM "partInventory" pi
  LEFT JOIN "partLedger" pl
      ON pl."partId" = pi."partId" AND pl."locationId" = pi."locationId"
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
  ) pol ON pol."partId" = pi."partId" AND pol."locationId" = pi."locationId"
  GROUP BY 
    pi."partId",
    pi."locationId",
    pi."defaultShelfId",
    pol."quantityToReceive";;