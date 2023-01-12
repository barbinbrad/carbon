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
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "color" TEXT DEFAULT '#000000',
    "protected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "supplierType_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "supplierType_colorCheck" CHECK ("color" is null or "color" ~* '^#[a-f0-9]{6}$')
);

CREATE TABLE "supplier" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "supplierTypeId" TEXT,
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
  "userId" TEXT,

  CONSTRAINT "supplierContact_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "supplier"("id") ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT "supplierContact_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT "supplierContact_supplierLocationId_fkey" FOREIGN KEY ("supplierLocationId") REFERENCES "supplierLocation"("id") ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT "supplierContact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE "supplierAccount" (
    "id" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,

    CONSTRAINT "supplierAccount_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "supplierAccount_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "supplierAccount_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "customerStatus" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3)
);

CREATE TABLE "customerType" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "color" TEXT DEFAULT '#000000',
    "protected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "customerType_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "customerType_colorCheck" CHECK ("color" is null or "color" ~* '^#[a-f0-9]{6}$')
);

CREATE TABLE "customer" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "customerTypeId" TEXT,
    "customerStatusId" INTEGER,
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

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "customer_customerTypeId_fkey" FOREIGN KEY ("customerTypeId") REFERENCES "customerType"("id") ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT "customer_customerStatusId_fkey" FOREIGN KEY ("customerStatusId") REFERENCES "customerStatus"("id") ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT "customer_accountManagerId_fkey" FOREIGN KEY ("accountManagerId") REFERENCES "user"("id") ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT "customer_name_unique" UNIQUE ("name"),
    CONSTRAINT "customer_taxId_unique" UNIQUE ("taxId")
);

CREATE TABLE "customerLocation" (
  "id" SERIAL PRIMARY KEY,
  "customerId" TEXT NOT NULL,
  "addressId" INTEGER NOT NULL,

  CONSTRAINT "customerLocation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT "customerLocation_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE "customerContact" (
  "id" SERIAL PRIMARY KEY,
  "customerId" TEXT NOT NULL,
  "contactId" INTEGER NOT NULL,
  "customerLocationId" INTEGER,
  "userId" TEXT,

  CONSTRAINT "customerContact_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT "customerContact_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT "customerContact_customerLocationId_fkey" FOREIGN KEY ("customerLocationId") REFERENCES "customerLocation"("id") ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT "customerContact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE "customerAccount" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "customerAccount_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "customerAccount_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "customerAccount_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE FUNCTION public.create_customer_type_group()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."group" ("id", "name", "isCustomerTypeGroup")
  VALUES (new.id, new.name, TRUE);

  INSERT INTO public."membership"("groupId", "memberGroupId")
  VALUES ('11111111-1111-1111-1111-111111111111', new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE FUNCTION public.create_supplier_type_group()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."group" ("id", "name", "isSupplierTypeGroup")
  VALUES (new.id, new.name, TRUE);

  INSERT INTO public."membership"("groupId", "memberGroupId")
  VALUES ('22222222-2222-2222-2222-222222222222', new.id);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE FUNCTION public.create_customer_org_group()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."group" ("id", "name", "isCustomerOrgGroup")
  VALUES (new.id, new.name, TRUE);

  INSERT INTO public."membership"("groupId", "memberGroupId")
  VALUES (new."customerTypeId", new.id);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE FUNCTION public.create_supplier_org_group()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."group" ("id", "name", "isSupplierOrgGroup")
  VALUES (new.id, new.name, TRUE);

  INSERT INTO public."membership"("groupId", "memberGroupId")
  VALUES (new."supplierTypeId", new.id);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE FUNCTION public.add_customer_account_to_customer_group()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."membership" ("groupId", "memberUserId")
  VALUES (new."customerId", new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE FUNCTION public.add_supplier_account_to_supplier_group()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."membership" ("groupId", "memberUserId")
  VALUES (new."supplierId", new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE FUNCTION public.update_customer_type_group()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public."group" SET "name" = new.name
  WHERE "id" = new.id AND "isCustomerTypeGroup" = TRUE;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE FUNCTION public.update_supplier_type_group()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public."group" SET "name" = new.name
  WHERE "id" = new.id AND "isSupplierTypeGroup" = TRUE;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE FUNCTION public.update_customer_to_customer_type_group()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public."membership" SET "groupId" = new."customerTypeId"
  WHERE "groupId" = old."customerTypeId" AND "memberGroupId" = new.id;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE FUNCTION public.update_supplier_to_supplier_type_group()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public."membership" SET "groupId" = new."supplierTypeId"
  WHERE "groupId" = old."supplierTypeId" AND "memberGroupId" = new.id;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_customer_type_created
  AFTER INSERT on public."customerType"
  FOR EACH ROW EXECUTE PROCEDURE public.create_customer_type_group();

CREATE TRIGGER on_supplier_type_created
  AFTER INSERT on public."supplierType"
  FOR EACH ROW EXECUTE PROCEDURE public.create_supplier_type_group();

CREATE TRIGGER on_customer_org_created
  AFTER INSERT on public.customer
  FOR EACH ROW EXECUTE PROCEDURE public.create_customer_org_group();

CREATE TRIGGER on_supplier_org_created
  AFTER INSERT on public.supplier
  FOR EACH ROW EXECUTE PROCEDURE public.create_supplier_org_group();

CREATE TRIGGER on_customer_created
  AFTER INSERT on public."customerAccount"
  FOR EACH ROW EXECUTE PROCEDURE public.add_customer_account_to_customer_group();

CREATE TRIGGER on_supplier_created
  AFTER INSERT on public."supplierAccount"
  FOR EACH ROW EXECUTE PROCEDURE public.add_supplier_account_to_supplier_group();

CREATE TRIGGER on_customer_updated
  AFTER UPDATE on public.customer
  FOR EACH ROW EXECUTE PROCEDURE public.update_customer_to_customer_type_group();

CREATE TRIGGER on_supplier_updated
  AFTER UPDATE on public.supplier
  FOR EACH ROW EXECUTE PROCEDURE public.update_supplier_to_supplier_type_group();

CREATE TRIGGER on_customer_type_updated
  AFTER UPDATE on public."customerType"
  FOR EACH ROW EXECUTE PROCEDURE public.update_customer_type_group();

CREATE TRIGGER on_supplier_type_updated
  AFTER UPDATE on public."supplierType"
  FOR EACH ROW EXECUTE PROCEDURE public.update_supplier_type_group();
