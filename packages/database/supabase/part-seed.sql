WITH UserData AS (
    SELECT id FROM "user" WHERE email = 'admin@carbon.us.org'
) INSERT INTO "partGroup"(
    name,
    description,
    active,
    "createdBy"
) VALUES
('Engine Components', 'Parts related to engine assemblies', true, 
  (SELECT id FROM UserData)
),
('Suspension Parts', 'Components for vehicle suspension systems', true, 
  (SELECT id FROM UserData)
),
('Electrical Systems', 'Parts for vehicle electrical systems, including lighting and batteries', true,
  (SELECT id FROM UserData)
),
('Braking Systems', 'Components related to vehicle braking systems', true,
  (SELECT id FROM UserData)
),
('Fuel Systems', 'Parts for fuel storage and delivery in vehicles', true, 
  (SELECT id FROM UserData)
);

WITH UserData AS (
    SELECT id FROM "user" WHERE email = 'admin@carbon.us.org'
) 
INSERT INTO part (
    id,
    name,
    description,
    blocked,
    "replenishmentSystem",
    "partGroupId",
    "partType",
    "manufacturerPartNumber",
    "unitOfMeasureCode",
    active,
    approved,
    "createdBy",
    "createdAt"
) VALUES
(
    '000000001',
    'Carbon Fiber Chassis',
    'Carbon fiber chassis component for high-performance vehicles',
    false,
    'Buy',
    (SELECT id FROM "partGroup" WHERE name = 'Engine Components'),
    'Inventory',
    'MPN12345',
    'PCS',
    true,
    false,
      (SELECT id FROM UserData),
    NOW()
),
(
    '000000002',
    'Hydraulic Pump',
    'High-pressure hydraulic pump for industrial applications.',
    false,
    'Buy',
    (SELECT id FROM "partGroup" WHERE name = 'Engine Components'),
    'Inventory',
    'MPN12345',
    'PCS',
    true,
    false,
    (SELECT id FROM UserData),
    NOW()
);

