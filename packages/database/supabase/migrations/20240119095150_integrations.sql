-- Enable the "pg_jsonschema" extension
CREATE EXTENSION pg_jsonschema WITH SCHEMA extensions;

CREATE TABLE integration (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "logoPath" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT FALSE,
  "visible" BOOLEAN NOT NULL DEFAULT TRUE,
  "jsonschema" JSON NOT NULL,
  "metadata" JSON NOT NULL DEFAULT '{}',
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT,

  CONSTRAINT integration_pkey PRIMARY KEY ("id"),
  CONSTRAINT integration_metadata CHECK (
    active = false OR
    json_matches_schema(jsonschema, metadata)
  ),
  CONSTRAINT "integration_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON UPDATE CASCADE
);

CREATE POLICY "Employees with settings_view can view integrations." ON "integration"
  FOR SELECT USING (
    coalesce(get_my_claim('settings_view')::boolean,false) AND 
    (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with settings_update can update integrations." ON "integration"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('settings_update')::boolean,false) AND 
    (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

INSERT INTO "integration" ("id", "title", "description", "logoPath", "jsonschema") 
VALUES (
  'exchange-rates-v1', 
  'Exchange Rates',
  'Pulls currency rates from exchange rates API',
  '/integrations/exchange-rates.png',
  '{
    "type": "object",
    "properties": {
      "apiKey": {
        "type": "string"
      }
    },
    "required": [
      "apiKey"
    ]
  }'::json),
  (
  'resend', 
  'Resend Emails',
  'Sends Transactional Emails with Resend API',
  '/integrations/resend.png',
  '{
    "type": "object",
    "properties": {
      "apiKey": {
        "type": "string"
      }
    },
    "required": [
      "apiKey"
    ]
  }'::json);
  -- (
  -- 'google-places-v2', 
  -- 'Google Places',
  -- 'Autocomplete addresses with Google Places API',
  -- '/integrations/google-places.png',
  -- '{
  --   "type": "object",
  --   "properties": {
  --     "apiKey": {
  --       "type": "string"
  --     }
  --   },
  --   "required": [
  --     "apiKey"
  --   ]
  -- }'::json);

