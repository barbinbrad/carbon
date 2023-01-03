
CREATE TABLE "userAttributeCategory" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "public" BOOLEAN DEFAULT FALSE,
  "protected" BOOLEAN DEFAULT FALSE,
  "active" BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMP(3) DEFAULT now() NOT NULL,
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3),
  "updatedBy" TEXT,

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
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 1,
  "userAttributeCategoryId" INTEGER NOT NULL,
  "attributeDataTypeId" INTEGER NOT NULL,
  "listOptions" TEXT ARRAY,
  "canSelfManage" BOOLEAN DEFAULT FALSE,
  "active" BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMP(3) DEFAULT now() NOT NULL,
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3),
  "updatedBy" TEXT,

  CONSTRAINT "userAttribute_userAttributeCategoryId_fkey" FOREIGN KEY ("userAttributeCategoryId") REFERENCES "userAttributeCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "userAttribute_attributeDataTypeId_fkey" FOREIGN KEY ("attributeDataTypeId") REFERENCES "attributeDataType"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "userAttribute_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "userAttribute_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")

);

-- ALTER TABLE "userAttribute" ENABLE ROW LEVEL SECURITY;

CREATE TABLE "userAttributeValue" (
  "id" SERIAL PRIMARY KEY,
  "userAttributeId" INTEGER NOT NULL,
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

-- ALTER TABLE "userAttributeValue" ENABLE ROW LEVEL SECURITY;