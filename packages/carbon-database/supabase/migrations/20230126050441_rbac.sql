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
