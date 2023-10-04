ALTER TABLE "purchaseOrder" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with purchasing_view can view purchase orders" ON "purchaseOrder"
  FOR SELECT
  USING (coalesce(get_my_claim('purchasing_view')::boolean, false) = true AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Suppliers with purchasing_view can their own purchase orders" ON "purchaseOrder"
  FOR SELECT
  USING (
    coalesce(get_my_claim('purchasing_view')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"supplier"'::jsonb 
    AND "supplierId" IN (
      SELECT "supplierId" FROM "supplierAccount" WHERE id::uuid = auth.uid()
    )
  );

CREATE POLICY "Employees with purchasing_create can create purchase orders" ON "purchaseOrder"
  FOR INSERT
  WITH CHECK (coalesce(get_my_claim('purchasing_create')::boolean,false) AND (get_my_claim('role'::text)) = '"employee"'::jsonb);


CREATE POLICY "Employees with purchasing_update can update purchase orders" ON "purchaseOrder"
  FOR UPDATE
  USING (coalesce(get_my_claim('purchasing_update')::boolean,false) AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Suppliers with purchasing_update can their own purchase orders" ON "purchaseOrder"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('purchasing_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"supplier"'::jsonb 
    AND "supplierId" IN (
      SELECT "supplierId" FROM "supplierAccount" WHERE id::uuid = auth.uid()
    )
  );

CREATE POLICY "Employees with purchasing_delete can delete purchase orders" ON "purchaseOrder"
  FOR DELETE
  USING (coalesce(get_my_claim('purchasing_delete')::boolean, false) = true AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

-- Search

CREATE FUNCTION public.create_purchase_order_search_result()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.search(name, entity, uuid, link)
  VALUES (new."purchaseOrderId", 'Purchase Order', new.id, '/x/purchase-order/' || new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER create_purchase_order_search_result
  AFTER INSERT on public."purchaseOrder"
  FOR EACH ROW EXECUTE PROCEDURE public.create_purchase_order_search_result();

CREATE FUNCTION public.update_purchase_order_search_result()
RETURNS TRIGGER AS $$
BEGIN
  IF (old."purchaseOrderId" <> new."purchaseOrderId") THEN
    UPDATE public.search SET name = new."purchaseOrderId"
    WHERE entity = 'Purchase Order' AND uuid = new.id;
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_purchase_order_search_result
  AFTER UPDATE on public."purchaseOrder"
  FOR EACH ROW EXECUTE PROCEDURE public.update_purchase_order_search_result();


CREATE POLICY "Suppliers with purchasing_view can search for their own purchase orders" ON "search"
  FOR SELECT
  USING (
    coalesce(get_my_claim('purchasing_view')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"supplier"'::jsonb
    AND entity = 'Purchase Order' 
    AND uuid IN (
        SELECT id FROM "purchaseOrder" WHERE "supplierId" IN (
          SELECT "supplierId" FROM "purchaseOrder" WHERE "supplierId" IN (
            SELECT "supplierId" FROM "supplierAccount" WHERE id::uuid = auth.uid()
          )
        )
      )
  );

-- Purchase Order Status History

ALTER TABLE "purchaseOrderStatusHistory" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone with purchasing_view can view purchase order status history" ON "purchaseOrderStatusHistory"
  FOR SELECT
  USING (coalesce(get_my_claim('purchasing_view')::boolean, false) = true);

-- Purchase Order Lines

ALTER TABLE "purchaseOrderLine" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with purchasing_view can view purchase order lines" ON "purchaseOrderLine"
  FOR SELECT
  USING (coalesce(get_my_claim('purchasing_view')::boolean, false) = true AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Suppliers with purchasing_view can their own purchase order lines" ON "purchaseOrderLine"
  FOR SELECT
  USING (
    coalesce(get_my_claim('purchasing_view')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"supplier"'::jsonb 
    AND "purchaseOrderId" IN (
      SELECT id FROM "purchaseOrder" WHERE "supplierId" IN (
        SELECT "supplierId" FROM "purchaseOrder" WHERE "supplierId" IN (
          SELECT "supplierId" FROM "supplierAccount" WHERE id::uuid = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Employees with purchasing_create can create purchase order lines" ON "purchaseOrderLine"
  FOR INSERT
  WITH CHECK (coalesce(get_my_claim('purchasing_create')::boolean,false) AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Suppliers with purchasing_create can create lines on their own purchase order" ON "purchaseOrderLine"
  FOR INSERT
  WITH CHECK (
    coalesce(get_my_claim('purchasing_create')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"supplier"'::jsonb 
    AND "purchaseOrderId" IN (
      SELECT id FROM "purchaseOrder" WHERE "supplierId" IN (
        SELECT "supplierId" FROM "purchaseOrder" WHERE "supplierId" IN (
          SELECT "supplierId" FROM "supplierAccount" WHERE id::uuid = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Employees with purchasing_update can update purchase order lines" ON "purchaseOrderLine"
  FOR UPDATE
  USING (coalesce(get_my_claim('purchasing_update')::boolean,false) AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Suppliers with purchasing_update can their own purchase order lines" ON "purchaseOrderLine"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('purchasing_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"supplier"'::jsonb 
    AND "purchaseOrderId" IN (
      SELECT id FROM "purchaseOrder" WHERE "supplierId" IN (
        SELECT "supplierId" FROM "purchaseOrder" WHERE "supplierId" IN (
          SELECT "supplierId" FROM "supplierAccount" WHERE id::uuid = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Employees with purchasing_delete can delete purchase order lines" ON "purchaseOrderLine"
  FOR DELETE
  USING (coalesce(get_my_claim('purchasing_delete')::boolean, false) = true AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Suppliers with purchasing_delete can delete lines on their own purchase order" ON "purchaseOrderLine"
  FOR DELETE
  USING (
    coalesce(get_my_claim('purchasing_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"supplier"'::jsonb 
    AND "purchaseOrderId" IN (
      SELECT id FROM "purchaseOrder" WHERE "supplierId" IN (
        SELECT "supplierId" FROM "purchaseOrder" WHERE "supplierId" IN (
          SELECT "supplierId" FROM "supplierAccount" WHERE id::uuid = auth.uid()
        )
      )
    )
  );


-- Purchase Order Deliveries

ALTER TABLE "purchaseOrderDelivery" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with purchasing_view can view purchase order deliveries" ON "purchaseOrderDelivery"
  FOR SELECT
  USING (coalesce(get_my_claim('purchasing_view')::boolean, false) = true AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Suppliers with purchasing_view can their own purchase order deliveries" ON "purchaseOrderDelivery"
  FOR SELECT
  USING (
    coalesce(get_my_claim('purchasing_view')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"supplier"'::jsonb 
    AND id IN (
      SELECT id FROM "purchaseOrder" WHERE "supplierId" IN (
        SELECT "supplierId" FROM "purchaseOrder" WHERE "supplierId" IN (
          SELECT "supplierId" FROM "supplierAccount" WHERE id::uuid = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Employees with purchasing_create can create purchase order deliveries" ON "purchaseOrderDelivery"
  FOR INSERT
  WITH CHECK (coalesce(get_my_claim('purchasing_create')::boolean,false) AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Employees with purchasing_update can update purchase order deliveries" ON "purchaseOrderDelivery"
  FOR UPDATE
  USING (coalesce(get_my_claim('purchasing_update')::boolean,false) AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Suppliers with purchasing_update can their own purchase order deliveries" ON "purchaseOrderDelivery"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('purchasing_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"supplier"'::jsonb 
    AND id IN (
      SELECT id FROM "purchaseOrder" WHERE "supplierId" IN (
        SELECT "supplierId" FROM "purchaseOrder" WHERE "supplierId" IN (
          SELECT "supplierId" FROM "supplierAccount" WHERE id::uuid = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Employees with purchasing_delete can delete purchase order deliveries" ON "purchaseOrderDelivery"
  FOR DELETE
  USING (coalesce(get_my_claim('purchasing_delete')::boolean, false) = true AND (get_my_claim('role'::text)) = '"employee"'::jsonb);


-- Purchase Order Payments

ALTER TABLE "purchaseOrderPayment" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with purchasing_view can view purchase order payments" ON "purchaseOrderPayment"
  FOR SELECT
  USING (coalesce(get_my_claim('purchasing_view')::boolean, false) = true AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Employees with purchasing_create can create purchase order payments" ON "purchaseOrderPayment"
  FOR INSERT
  WITH CHECK (coalesce(get_my_claim('purchasing_create')::boolean,false) AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Employees with purchasing_update can update purchase order payments" ON "purchaseOrderPayment"
  FOR UPDATE
  USING (coalesce(get_my_claim('purchasing_update')::boolean,false) AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Employees with purchasing_delete can delete purchase order payments" ON "purchaseOrderPayment"
  FOR DELETE
  USING (coalesce(get_my_claim('purchasing_delete')::boolean, false) = true AND (get_my_claim('role'::text)) = '"employee"'::jsonb);
