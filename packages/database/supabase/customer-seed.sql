WITH UserData AS (
    SELECT id FROM "user" WHERE email = 'admin@carbon.us.org'
) INSERT INTO "customerType" (name, protected, "createdBy") VALUES
('Retail', false, (SELECT id FROM UserData)),
('Wholesale', false, (SELECT id FROM UserData)),
('Enterprise', false, (SELECT id FROM UserData));

INSERT INTO customer (
    name,
    "taxId",
    "customerTypeId",
    "updatedAt"
) VALUES 
(
    'Acme Corporation',
    '123456789',
    (SELECT id FROM "customerType" WHERE name = 'Retail'),
    NOW()
),
(
    'Baxter Innovations',
    '987654321',
    (SELECT id FROM "customerType" WHERE name = 'Wholesale'),
    NOW()
),
(
    'Crestone LLC',
    '555666777',
    (SELECT id FROM "customerType" WHERE name = 'Enterprise'),
    NOW()
),
(
    'Dynamo Corp',
    '222333444',
    (SELECT id FROM "customerType" WHERE name = 'Wholesale'),
    NOW()
),
(
    'Blue Ocean Technologies',
    '222333444',
    (SELECT id FROM "customerType" WHERE name = 'Wholesale'),
    NOW()
),
(
    'Solar Flare Innovations',
    '222333444',
    (SELECT id FROM "customerType" WHERE name = 'Enterprise'),
    NOW()
);

