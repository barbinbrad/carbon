CREATE OR REPLACE VIEW "userDefaults" AS
  SELECT
    u.id as "userId",
    ej."locationId"
  FROM "user" u
  LEFT JOIN "employeeJob" ej ON ej.id = u.id;