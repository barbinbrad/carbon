CREATE VIEW "suppliers_view" AS 
  SELECT 
    s.id,
    s.name,
    s."supplierTypeId",
    st.name AS "type",
    s."supplierStatusId",
    ss.name AS "status",
    po.count AS "orderCount",
    p.count AS "partCount"
  FROM "supplier" s
  LEFT JOIN "supplierType" st ON st.id = s."supplierTypeId"
  LEFT JOIN "supplierStatus" ss ON ss.id = s."supplierStatusId"
  LEFT JOIN (
    SELECT 
      "supplierId",
      COUNT(*) AS "count"
    FROM "purchaseOrder"
    GROUP BY "supplierId"
  ) po ON po."supplierId" = s.id
  LEFT JOIN (
    SELECT 
      "supplierId",
      COUNT(*) AS "count"
    FROM "partSupplier"
    GROUP BY "supplierId"
  ) p ON p."supplierId" = s.id;