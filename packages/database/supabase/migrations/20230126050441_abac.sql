-- contact

ALTER TABLE "contact" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with purchasing_view can view contacts that are suppliers" ON "contact"
  FOR SELECT
  USING (
    coalesce(get_my_claim('purchasing_view')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
    AND id IN (
      SELECT "contactId" FROM "supplierContact"
    )
  );

CREATE POLICY "Employees with sales_view can view contacts that are customer" ON "contact"
  FOR SELECT
  USING (
    coalesce(get_my_claim('sales_view')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
    AND id IN (
      SELECT "contactId" FROM "customerContact"
    )
  );

CREATE POLICY "Suppliers with purchasing_view can view contacts from their organization" ON "contact"
  FOR SELECT
  USING (
    coalesce(get_my_claim('purchasing_view')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"supplier"'::jsonb 
    AND (
      id IN (
        SELECT "contactId" FROM "supplierContact" WHERE "supplierId" IN (
          SELECT "supplierId" FROM "supplierAccount" WHERE id::uuid = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Customers with sales_view can view contacts from their organization" ON "contact"
  FOR SELECT
  USING (
    coalesce(get_my_claim('sales_view')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"customer"'::jsonb 
    AND (
      id IN (
        SELECT "contactId" FROM "customerContact" WHERE "customerId" IN (
          SELECT "customerId" FROM "customerAccount" WHERE id::uuid = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Many employees can create contact" ON "contact"
  FOR INSERT
  WITH CHECK (
    (
      coalesce(get_my_claim('purchasing_create')::boolean,false) OR
      coalesce(get_my_claim('sales_create')::boolean,false) OR
      coalesce(get_my_claim('users_create')::boolean,false)
    ) AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Suppliers with purchasing_update can create contacts from their organization" ON "contact"
  FOR INSERT
  WITH CHECK (
    coalesce(get_my_claim('purchasing_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"supplier"'::jsonb 
    AND (
      id IN (
        SELECT "contactId" FROM "supplierContact" WHERE "supplierId" IN (
          SELECT "supplierId" FROM "supplierAccount" WHERE id::uuid = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Customers with sales_update can create contacts from their organization" ON "contact"
  FOR INSERT
  WITH CHECK (
    coalesce(get_my_claim('sales_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"customer"'::jsonb 
    AND (
      id IN (
        SELECT "contactId" FROM "customerContact" WHERE "customerId" IN (
          SELECT "customerId" FROM "customerAccount" WHERE id::uuid = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Employees with purchasing_update can update supplier contacts" ON "contact"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('purchasing_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
    AND id IN (
      SELECT "contactId" FROM "supplierContact"
    )
  );

CREATE POLICY "Suppliers with purchasing_update can update contacts from their organization" ON "contact"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('purchasing_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"supplier"'::jsonb 
    AND (
      id IN (
        SELECT "contactId" FROM "supplierContact" WHERE "supplierId" IN (
          SELECT "supplierId" FROM "supplierAccount" WHERE id::uuid = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Employees with sales_update can update customer contacts" ON "contact"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('purchasing_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
    AND id IN (
      SELECT "contactId" FROM "customerContact"
    )
  );

CREATE POLICY "Customers with sales_update can update contacts from their organization" ON "contact"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('sales_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"customer"'::jsonb 
    AND (
      id IN (
        SELECT "contactId" FROM "customerContact" WHERE "customerId" IN (
          SELECT "customerId" FROM "customerAccount" WHERE id::uuid = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Employees with purchasing_delete can delete supplier contacts" ON "contact"
  FOR DELETE
  USING (
    coalesce(get_my_claim('purchasing_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
    AND id IN (
      SELECT "contactId" FROM "supplierContact"
    )
  );

CREATE POLICY "Suppliers with purchasing_delete can delete contacts from their organization" ON "contact"
  FOR DELETE
  USING (
    coalesce(get_my_claim('purchasing_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"supplier"'::jsonb 
    AND (
      id IN (
        SELECT "contactId" FROM "supplierContact" WHERE "supplierId" IN (
          SELECT "supplierId" FROM "supplierAccount" WHERE id::uuid = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Employees with sales_delete can delete customer contacts" ON "contact"
  FOR DELETE
  USING (
    coalesce(get_my_claim('sales_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
    AND id IN (
      SELECT "contactId" FROM "customerContact"
    )
  );

CREATE POLICY "Customers with sales_delete can delete contacts from their organization" ON "contact"
  FOR DELETE
  USING (
    coalesce(get_my_claim('sales_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"customer"'::jsonb 
    AND (
      id IN (
        SELECT "contactId" FROM "customerContact" WHERE "customerId" IN (
          SELECT "customerId" FROM "customerAccount" WHERE id::uuid = auth.uid()
        )
      )
    )
  );

-- customerType

ALTER TABLE "customerType" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with sales_view can view customer types" ON "customerType"
  FOR SELECT
  USING (coalesce(get_my_claim('sales_view')::boolean, false) = true AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Employees with sales_create can create customer types" ON "customerType"
  FOR INSERT
  WITH CHECK (coalesce(get_my_claim('sales_create')::boolean,false) AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Employees with sales_update can update customer types" ON "customerType"
  FOR UPDATE
  USING (coalesce(get_my_claim('sales_update')::boolean,false) AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Employees with sales_delete can delete customer types" ON "customerType"
  FOR DELETE
  USING (coalesce(get_my_claim('sales_delete')::boolean, false) = true AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

-- customer

ALTER TABLE "customer" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with sales_view can view customer" ON "customer"
  FOR SELECT
  USING (coalesce(get_my_claim('sales_view')::boolean, false) = true AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Customers with sales_view can their own organization" ON "customer"
  FOR SELECT
  USING (
    coalesce(get_my_claim('sales_view')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"customer"'::jsonb 
    AND id IN (
      SELECT "customerId" FROM "customerAccount" WHERE id::uuid = auth.uid()
    )
  );

CREATE POLICY "Employees with sales_create can create customers" ON "customer"
  FOR INSERT
  WITH CHECK (coalesce(get_my_claim('sales_create')::boolean,false) AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Employees with sales_update can update customers" ON "customer"
  FOR UPDATE
  USING (coalesce(get_my_claim('sales_update')::boolean,false) AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Customers with sales_update can their own organization" ON "customer"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('sales_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"customer"'::jsonb 
    AND id IN (
      SELECT "customerId" FROM "customerAccount" WHERE id::uuid = auth.uid()
    )
  );

CREATE POLICY "Employees with sales_delete can delete customers" ON "customer"
  FOR DELETE
  USING (coalesce(get_my_claim('sales_delete')::boolean, false) = true AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

-- customerContact

ALTER TABLE "customerContact" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with sales_view can view customer contact" ON "customerContact"
  FOR SELECT
  USING (coalesce(get_my_claim('sales_view')::boolean, false) = true AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Customers with sales_view can their own customer contacts" ON "customerContact"
  FOR SELECT
  USING (
    coalesce(get_my_claim('sales_view')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"customer"'::jsonb 
    AND "customerId" IN (
      SELECT "customerId" FROM "customerAccount" WHERE id::uuid = auth.uid()
    )
  );

CREATE POLICY "Employees with sales_create can create customer contacts" ON "customerContact"
  FOR INSERT
  WITH CHECK (coalesce(get_my_claim('sales_create')::boolean,false) AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Customers with sales_create can create customer contacts" ON "customerContact"
  FOR INSERT
  WITH CHECK (coalesce(get_my_claim('sales_create')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"customer"'::jsonb 
    AND "customerId" IN (
      SELECT "customerId" FROM "customerAccount" WHERE id::uuid = auth.uid()
    )
  );

CREATE POLICY "Employees with sales_update can update customer contacts" ON "customerContact"
  FOR UPDATE
  USING (coalesce(get_my_claim('sales_update')::boolean,false) AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Customers with sales_update can update their customer contacts" ON "customerContact"
  FOR UPDATE
  USING (coalesce(get_my_claim('sales_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"customer"'::jsonb 
    AND "customerId" IN (
      SELECT "customerId" FROM "customerAccount" WHERE id::uuid = auth.uid()
    )
  );

CREATE POLICY "Employees with sales_delete can delete customer contacts" ON "customerContact"
  FOR DELETE
  USING (coalesce(get_my_claim('sales_delete')::boolean, false) = true AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

-- supplierType

ALTER TABLE "supplierType" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with purchasing_view can view supplier types" ON "supplierType"
  FOR SELECT
  USING (coalesce(get_my_claim('purchasing_view')::boolean, false) = true AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Employees with purchasing_create can create supplier types" ON "supplierType"
  FOR INSERT
  WITH CHECK (coalesce(get_my_claim('purchasing_create')::boolean,false) AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Employees with purchasing_update can update supplier types" ON "supplierType"
  FOR UPDATE
  USING (coalesce(get_my_claim('purchasing_update')::boolean,false) AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Employees with purchasing_delete can delete supplier types" ON "supplierType"
  FOR DELETE
  USING (coalesce(get_my_claim('purchasing_delete')::boolean, false) = true AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

-- supplier

ALTER TABLE "supplier" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with purchasing_view can view supplier" ON "supplier"
  FOR SELECT
  USING (coalesce(get_my_claim('purchasing_view')::boolean, false) = true AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Suppliers with purchasing_view can their own organization" ON "supplier"
  FOR SELECT
  USING (
    coalesce(get_my_claim('purchasing_view')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"supplier"'::jsonb 
    AND id IN (
      SELECT "supplierId" FROM "supplierAccount" WHERE id::uuid = auth.uid()
    )
  );

CREATE POLICY "Employees with purchasing_create can create suppliers" ON "supplier"
  FOR INSERT
  WITH CHECK (coalesce(get_my_claim('purchasing_create')::boolean,false) AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Employees with purchasing_update can update suppliers" ON "supplier"
  FOR UPDATE
  USING (coalesce(get_my_claim('purchasing_update')::boolean,false) AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Suppliers with purchasing_update can their own organization" ON "supplier"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('purchasing_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"supplier"'::jsonb 
    AND id IN (
      SELECT "supplierId" FROM "supplierAccount" WHERE id::uuid = auth.uid()
    )
  );

CREATE POLICY "Employees with purchasing_delete can delete suppliers" ON "supplier"
  FOR DELETE
  USING (coalesce(get_my_claim('purchasing_delete')::boolean, false) = true AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

-- supplierContact

ALTER TABLE "supplierContact" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with purchasing_view can view supplier contact" ON "supplierContact"
  FOR SELECT
  USING (coalesce(get_my_claim('purchasing_view')::boolean, false) = true AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Suppliers with purchasing_view can their own supplier contacts" ON "supplierContact"
  FOR SELECT
  USING (
    coalesce(get_my_claim('purchasing_view')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"supplier"'::jsonb 
    AND "supplierId" IN (
      SELECT "supplierId" FROM "supplierAccount" WHERE id::uuid = auth.uid()
    )
  );

CREATE POLICY "Employees with purchasing_create can create supplier contacts" ON "supplierContact"
  FOR INSERT
  WITH CHECK (coalesce(get_my_claim('purchasing_create')::boolean,false) AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Suppliers with purchasing_create can create supplier contacts" ON "supplierContact"
  FOR INSERT
  WITH CHECK (coalesce(get_my_claim('purchasing_create')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"supplier"'::jsonb 
    AND "supplierId" IN (
      SELECT "supplierId" FROM "supplierAccount" WHERE id::uuid = auth.uid()
    )
  );

CREATE POLICY "Employees with purchasing_update can update supplier contacts" ON "supplierContact"
  FOR UPDATE
  USING (coalesce(get_my_claim('purchasing_update')::boolean,false) AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Suppliers with purchasing_update can update their supplier contacts" ON "supplierContact"
  FOR UPDATE
  USING (coalesce(get_my_claim('purchasing_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"supplier"'::jsonb 
    AND "supplierId" IN (
      SELECT "supplierId" FROM "supplierAccount" WHERE id::uuid = auth.uid()
    )
  );

CREATE POLICY "Employees with purchasing_delete can delete supplier contacts" ON "supplierContact"
  FOR DELETE
  USING (coalesce(get_my_claim('purchasing_delete')::boolean, false) = true AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

