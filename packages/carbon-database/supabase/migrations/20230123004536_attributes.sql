
CREATE TABLE "userAttributeCategory" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "name" TEXT NOT NULL,
  "public" BOOLEAN DEFAULT FALSE,
  "protected" BOOLEAN DEFAULT FALSE,
  "active" BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMP(3) DEFAULT now() NOT NULL,
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3),
  "updatedBy" TEXT,

  CONSTRAINT "userAttributeCategory_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "userAttributeCategory_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "userAttributeCategory_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") 
);

-- ALTER TABLE "userAttributeCategory" ENABLE ROW LEVEL SECURITY;

CREATE TABLE "attributeDataType" (
  "id" SERIAL PRIMARY KEY,
  "label" TEXT NOT NULL,
  "isBoolean" BOOLEAN NOT NULL DEFAULT FALSE,
  "isDate" BOOLEAN NOT NULL DEFAULT FALSE,
  "isList" BOOLEAN NOT NULL DEFAULT FALSE,
  "isNumeric" BOOLEAN NOT NULL DEFAULT FALSE,
  "isText" BOOLEAN NOT NULL DEFAULT FALSE,
  "isUser" BOOLEAN NOT NULL DEFAULT FALSE,
    
  CONSTRAINT "userAttributeDataType_singleDataType"
    CHECK (
      (
        "isBoolean" = true AND 
        "isDate" = false AND 
        "isList" = false AND 
        "isNumeric" = false AND 
        "isText" = false AND 
        "isUser" = false
      ) 
      OR (
        "isBoolean" = false AND 
        "isDate" = true AND 
        "isList" = false AND 
        "isNumeric" = false AND 
        "isText" = false AND 
        "isUser" = false
      ) 
      OR (
        "isBoolean" = false AND 
        "isDate" = false AND 
        "isList" = true AND 
        "isNumeric" = false AND 
        "isText" = false AND 
        "isUser" = false
      ) 
      OR (
        "isBoolean" = false AND 
        "isDate" = false AND 
        "isList" = false AND 
        "isNumeric" = true AND 
        "isText" = false AND 
        "isUser" = false
      ) 
      OR (
        "isBoolean" = false AND 
        "isDate" = false AND 
        "isList" = false AND 
        "isNumeric" = false AND 
        "isText" = true AND 
        "isUser" = false
      ) 
      OR (
        "isBoolean" = false AND 
        "isDate" = false AND 
        "isList" = false AND 
        "isNumeric" = false AND 
        "isText" = false AND 
        "isUser" = true
      )
    )
);

INSERT INTO "attributeDataType" ("label", "isBoolean", "isDate", "isList", "isNumeric", "isText", "isUser")
VALUES 
  ('Yes/No', true, false, false, false, false, false),
  ('Date', false, true, false, false, false, false),
  ('List', false, false, true, false, false, false),
  ('Numeric', false, false, false, true, false, false),
  ('Text', false, false, false, false, true, false),
  ('User', false, false, false, false, false, true);
  

-- ALTER TABLE "attributeDataType" ENABLE ROW LEVEL SECURITY;

CREATE TABLE "userAttribute" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "name" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 1,
  "userAttributeCategoryId" TEXT NOT NULL,
  "attributeDataTypeId" INTEGER NOT NULL,
  "listOptions" TEXT ARRAY,
  "canSelfManage" BOOLEAN DEFAULT FALSE,
  "active" BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMP(3) DEFAULT NOW() NOT NULL,
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3),
  "updatedBy" TEXT,

  CONSTRAINT "userAttribute_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "userAttribute_userAttributeCategoryId_fkey" FOREIGN KEY ("userAttributeCategoryId") REFERENCES "userAttributeCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "userAttribute_attributeDataTypeId_fkey" FOREIGN KEY ("attributeDataTypeId") REFERENCES "attributeDataType"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "userAttribute_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "userAttribute_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")

);

-- ALTER TABLE "userAttribute" ENABLE ROW LEVEL SECURITY;

CREATE TABLE "userAttributeValue" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "userAttributeId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "valueBoolean" BOOLEAN,
  "valueDate" DATE,
  "valueNumeric" NUMERIC,
  "valueText" TEXT,
  "valueUser" TEXT,
  "createdAt" TIMESTAMP(3) DEFAULT now() NOT NULL,
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3),
  "updatedBy" TEXT,

  CONSTRAINT "userAttributeValue_singleValue"
    CHECK (
      (
        "valueBoolean" IS NOT NULL AND
        "valueDate" IS NULL AND
        "valueNumeric" IS NULL AND
        "valueText" IS NULL AND
        "valueUser" IS NULL
      ) 
      OR (
        "valueBoolean" IS NULL AND
        "valueDate" IS NULL AND
        "valueNumeric" IS NULL AND
        "valueText" IS NOT NULL AND
        "valueUser" IS NULL
      ) 
      OR (
        "valueBoolean" IS NULL AND
        "valueDate" IS NOT NULL AND
        "valueNumeric" IS NULL AND
        "valueText" IS NULL AND
        "valueUser" IS NULL
      ) 
      OR (
        "valueBoolean" IS NULL AND
        "valueDate" IS NULL AND
        "valueNumeric" IS NOT NULL AND
        "valueText" IS NULL AND
        "valueUser" IS NULL
      ) 
      OR (
        "valueBoolean" IS NULL AND
        "valueDate" IS NULL AND
        "valueNumeric" IS NULL AND
        "valueText" IS NULL AND
        "valueUser" IS NOT NULL
      ) 
    ),

  CONSTRAINT "userAttributeValue_userAttributeId_fkey" FOREIGN KEY ("userAttributeId") REFERENCES "userAttribute"("id") ON DELETE CASCADE,
  CONSTRAINT "userAttributeValue_valueUser_fkey" FOREIGN KEY ("valueUser") REFERENCES "user"("id") ON DELETE CASCADE,
  CONSTRAINT "userAttributeValue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE,
  CONSTRAINT "userAttributeValue_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "userAttributeValue_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id"),
  CONSTRAINT uq_userAttributeId_userId 
    UNIQUE ( "userAttributeId", "userId")
);

ALTER TABLE "userAttributeValue" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Claims admin can view/modify user attribute values" ON "userAttributeValue" FOR ALL USING (is_claims_admin());
CREATE POLICY "Users can insert attributes for themselves" ON "userAttributeValue" FOR UPDATE WITH CHECK (auth.uid() = "userId"::uuid);
CREATE POLICY "Users can modify attributes for themselves" ON "userAttributeValue" FOR UPDATE WITH CHECK (auth.uid() = "userId"::uuid);
CREATE POLICY "Users can view their own attribtues" ON "userAttributeValue" FOR SELECT USING (auth.uid() = "userId"::uuid);
CREATE POLICY "Users can view other users attributes if the category is public" ON "userAttributeValue" FOR SELECT 
  USING (
    auth.role() = 'authenticated' AND
    "userAttributeValue"."userAttributeId" IN (
      SELECT "id" FROM "userAttribute" WHERE "userAttributeCategoryId" IN (
        SELECT "id" FROM "userAttributeCategory" WHERE "public" = true
      )
    )
  );

-- CREATE TABLE employee_personal_data (
--   "id" TEXT NOT NULL DEFAULT xid(), 
--   bank_account_number TEXT,
--   bank_routing_number TEXT,
--   drivers_license_number TEXT,
--   social_security TEXT,
--   user_id TEXT NOT NULL,
-- 	 key_id uuid NOT NULL DEFAULT '7da3ce7e-98f0-4c4f-9b63-b3f783eab919'::uuid,
--   nonce BYTEA DEFAULT pgsodium.crypto_aead_det_noncegen(),

--   CONSTRAINT "employee_personal_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE
-- );

-- SECURITY LABEL FOR pgsodium
-- 	ON COLUMN employee_personal_data.bank_account
--   	IS 'ENCRYPT WITH KEY COLUMN key_id ASSOCIATED (user_id) NONCE nonce';

-- SECURITY LABEL FOR pgsodium
-- 	ON COLUMN employee_personal_data.bank_routing
--   	IS 'ENCRYPT WITH KEY COLUMN key_id ASSOCIATED (user_id) NONCE nonce';

-- SECURITY LABEL FOR pgsodium
-- 	ON COLUMN employee_personal_data.drivers_license
--   	IS 'ENCRYPT WITH KEY COLUMN key_id ASSOCIATED (user_id) NONCE nonce';

-- SECURITY LABEL FOR pgsodium
-- 	ON COLUMN employee_personal_data.social_security
--   	IS 'ENCRYPT WITH KEY COLUMN key_id ASSOCIATED (user_id) NONCE nonce';

-- ALTER TABLE "employee_personal_data" ENABLE ROW LEVEL SECURITY;