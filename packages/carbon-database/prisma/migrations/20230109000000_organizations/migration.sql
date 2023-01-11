CREATE TABLE "country" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "code" TEXT NOT NULL
);

CREATE TABLE "contact" (
  "id" SERIAL PRIMARY KEY,
  "firstName" TEXT,
  "lastName" TEXT,
  "title" TEXT,
  "email" TEXT,
  "mobilePhone" TEXT,
  "homePhone" TEXT,
  "workPhone" TEXT,
  "fax" TEXT,
  "addressLine1" TEXT,
  "addressLine2" TEXT,
  "city" TEXT,
  "state" TEXT,
  "countryId" INTEGER,
  "birthday" DATE,

  CONSTRAINT "contact_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE SET NULL ON UPDATE CASCADE
);


CREATE TABLE "address" (
  "id" SERIAL PRIMARY KEY,
  "addressLine1" TEXT,
  "addressLine2" TEXT,
  "city" TEXT,
  "state" TEXT,
  "countryId" INTEGER,
  "phone" TEXT,
  "fax" TEXT,

  CONSTRAINT "address_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "supplierStatus" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3)
);

CREATE TABLE "supplierType" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT DEFAULT '#000000',
    "protected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "supplierType_colorCheck" CHECK ("color" is null or "color" ~* '^#[a-f0-9]{6}$')
);

CREATE TABLE "supplier" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "supplierTypeId" INTEGER,
    "supplierStatusId" INTEGER,
    "taxId" TEXT,
    "taxable" BOOLEAN DEFAULT TRUE,
    "established" DATE,
    "accountManagerId" TEXT,
    "logo" TEXT,
    "website" TEXT,
    "twitter" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "linkedin" TEXT,
    "github" TEXT,
    "youtube" TEXT,
    "twitch" TEXT,
    "discord" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "supplier_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "supplier_supplierTypeId_fkey" FOREIGN KEY ("supplierTypeId") REFERENCES "supplierType"("id") ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT "supplier_supplierStatusId_fkey" FOREIGN KEY ("supplierStatusId") REFERENCES "supplierStatus"("id") ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT "supplier_accountManagerId_fkey" FOREIGN KEY ("accountManagerId") REFERENCES "user"("id") ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT "supplier_name_unique" UNIQUE ("name"),
    CONSTRAINT "supplier_taxId_unique" UNIQUE ("taxId")
);

CREATE TABLE "supplierLocation" (
  "id" SERIAL PRIMARY KEY,
  "supplierId" TEXT NOT NULL,
  "addressId" INTEGER NOT NULL,

  CONSTRAINT "supplierLocation_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "supplier"("id") ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT "supplierLocation_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE "supplierContact" (
  "id" SERIAL PRIMARY KEY,
  "supplierId" TEXT NOT NULL,
  "contactId" INTEGER NOT NULL,
  "supplierLocationId" INTEGER,

  CONSTRAINT "supplierContact_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "supplier"("id") ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT "supplierContact_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT "supplierContact_supplierLocationId_fkey" FOREIGN KEY ("supplierLocationId") REFERENCES "supplierLocation"("id") ON UPDATE CASCADE ON DELETE SET NULL
);