
CREATE TYPE "searchEntity" AS enum ('Resource', 'Person', 'Customer', 'Supplier', 'Job', 'Part', 'Purchase Order', 'Sales Order', 'Document');

CREATE TABLE search (
  id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  entity "searchEntity",
  uuid TEXT,
  link TEXT NOT NULL
);

ALTER TABLE
  public.search
ADD COLUMN
  fts tsvector GENERATED always as (to_tsvector('english', name || ' ' || description)) STORED;

CREATE INDEX index_search_uuid ON public.search (uuid);
CREATE INDEX index_search_fts ON public.search USING GIN (fts); 

CREATE FUNCTION public.create_employee_search_result()
RETURNS TRIGGER AS $$
DECLARE
  employee TEXT;
BEGIN
  employee := (SELECT u."fullName" FROM public.user u WHERE u.id = new.id);
  INSERT INTO public.search(name, entity, uuid, link)
  VALUES (employee, 'Person', new.id, '/x/resources/person/' || new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER create_employee_search_result
  AFTER INSERT on public.user
  FOR EACH ROW EXECUTE PROCEDURE public.create_employee_search_result();

CREATE FUNCTION public.update_employee_search_result()
RETURNS TRIGGER AS $$
BEGIN
  IF (new.active = false) THEN
    DELETE FROM public.search
    WHERE entity = 'Person' AND uuid = new.id;
    RETURN new;
  END IF;
  IF (old."fullName" <> new."fullName") THEN
    UPDATE public.search SET name = new."fullName"
    WHERE entity = 'Person' AND uuid = new.id;
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_employee_search_result
  AFTER UPDATE on public.user
  FOR EACH ROW EXECUTE PROCEDURE public.update_employee_search_result();

CREATE FUNCTION public.create_customer_search_result()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.search(name, entity, uuid, link)
  VALUES (new.name, 'Customer', new.id, '/x/sales/customers/' || new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER create_customer_search_result
  AFTER INSERT on public.customer
  FOR EACH ROW EXECUTE PROCEDURE public.create_customer_search_result();

CREATE FUNCTION public.update_customer_search_result()
RETURNS TRIGGER AS $$
BEGIN
  IF (old.name <> new.name) THEN
    UPDATE public.search SET name = new.name
    WHERE entity = 'Customer' AND uuid = new.id;
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_customer_search_result
  AFTER UPDATE on public.customer
  FOR EACH ROW EXECUTE PROCEDURE public.update_customer_search_result();

CREATE FUNCTION public.create_supplier_search_result()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.search(name, entity, uuid, link)
  VALUES (new.name, 'Supplier', new.id, '/x/purchasing/suppliers/' || new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER create_supplier_search_result
  AFTER INSERT on public.supplier
  FOR EACH ROW EXECUTE PROCEDURE public.create_supplier_search_result();

CREATE FUNCTION public.update_supplier_search_result()
RETURNS TRIGGER AS $$
BEGIN
  IF (old.name <> new.name) THEN
    UPDATE public.search SET name = new.name
    WHERE entity = 'Supplier' AND uuid = new.id;
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_supplier_search_result
  AFTER UPDATE on public.supplier
  FOR EACH ROW EXECUTE PROCEDURE public.update_supplier_search_result();

ALTER TABLE "search" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with sales_view can search for customers and sales orders" ON "search"
  FOR SELECT
  USING (coalesce(get_my_claim('sales_view')::boolean, false) = true AND entity IN ('Customer', 'Sales Order') AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

-- TODO: customers should be able to search for their own sales orders
-- CREATE POLICY "Customers with sales_view can search for their own sales orders" ON "search"
--   FOR SELECT
--   USING (
--     coalesce(get_my_claim('sales_view')::boolean, false) = true 
--     AND entity = 'Sales Order' 
--     AND (get_my_claim('role'::text)) = '"customer"'::jsonb
--     AND uuid IN (
--        SELECT id FROM "salesOrder" WHERE "customerId" IN (
--          SELECT "customerId" FROM "salesOrder" WHERE "customerId" IN (
--            SELECT "customerId" FROM "customerAccount" WHERE id::uuid = auth.uid()
--          )
--        )
--      )
--   )

CREATE POLICY "Employees with purchasing_view can search for suppliers and purchase orders" ON "search"
  FOR SELECT
  USING (coalesce(get_my_claim('purchasing_view')::boolean, false) = true AND entity IN ('Supplier', 'Purchase Order') AND (get_my_claim('role'::text)) = '"employee"'::jsonb);


CREATE POLICY "Employees with resources_view can search for resources" ON "search"
  FOR SELECT
  USING (coalesce(get_my_claim('resources_view')::boolean, false) = true AND entity = 'Resource');

CREATE POLICY "Employees with resources_view can search for people" ON "search"
  FOR SELECT
  USING (coalesce(get_my_claim('resources_view')::boolean, false) = true AND entity = 'Person');

-- TODO: documents should be filtered based on visibility
CREATE POLICY "Employees with document_view can search for documents" ON "search"
  FOR SELECT
  USING (coalesce(get_my_claim('document_view')::boolean, false) = true AND entity = 'Document' AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Employees with parts_view can search for parts" ON "search"
  FOR SELECT
  USING (coalesce(get_my_claim('parts_view')::boolean, false) = true AND entity = 'Part' AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

-- TODO: suppliers should be able to search for parts that they supply

CREATE POLICY "Employees with jobs_view can search for jobs" ON "search"
  FOR SELECT
  USING (coalesce(get_my_claim('jobs_view')::boolean, false) = true AND entity = 'Job' AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

-- TODO: customers should be able to search for their jobs