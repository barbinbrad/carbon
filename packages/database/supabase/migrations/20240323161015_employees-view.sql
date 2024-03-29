CREATE OR REPLACE VIEW "employees" WITH(SECURITY_INVOKER=true) AS
  SELECT 
    u.id,
    u."fullName" AS "name",
    u."avatarUrl"
  FROM "user" u
  INNER JOIN "employee" e
    ON e.id = u.id
  WHERE u.active = TRUE;
