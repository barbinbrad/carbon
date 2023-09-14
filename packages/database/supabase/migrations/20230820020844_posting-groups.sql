CREATE TABLE "accountDefault" (
  "id" BOOLEAN NOT NULL DEFAULT TRUE,
  -- income statement
    -- revenue
    "salesAccount" TEXT NOT NULL,
    "salesDiscountAccount" TEXT NOT NULL,

    -- part cost
    "costOfGoodsSoldAccount" TEXT NOT NULL,
    "purchaseAccount" TEXT NOT NULL,
    "directCostAppliedAccount" TEXT NOT NULL,
    "overheadCostAppliedAccount" TEXT NOT NULL,
    "purchaseVarianceAccount" TEXT NOT NULL,
    "inventoryAdjustmentVarianceAccount" TEXT NOT NULL,

    -- direct costs
    "materialVarianceAccount" TEXT NOT NULL,
    "capacityVarianceAccount" TEXT NOT NULL,
    "overheadAccount" TEXT NOT NULL,
    "maintenanceAccount" TEXT NOT NULL,

    -- depreciaition of fixed assets
    "assetDepreciationExpenseAccount" TEXT NOT NULL,
    "assetGainsAndLossesAccount" TEXT NOT NULL,
    "serviceChargeAccount" TEXT NOT NULL,

    -- interest
    "interestAccount" TEXT NOT NULL,
    "supplierPaymentDiscountAccount" TEXT NOT NULL,
    "customerPaymentDiscountAccount" TEXT NOT NULL,
    "roundingAccount" TEXT NOT NULL,

  -- balance sheet
    -- assets
    "assetAquisitionCostAccount" TEXT NOT NULL,
    "assetAquisitionCostOnDisposalAccount" TEXT NOT NULL,
    "accumulatedDepreciationAccount" TEXT NOT NULL,
    "accumulatedDepreciationOnDisposalAccount" TEXT NOT NULL,

    -- current assets
    "inventoryAccount" TEXT NOT NULL,
    "inventoryInterimAccrualAccount" TEXT NOT NULL,
    "workInProgressAccount" TEXT NOT NULL,
    "receivablesAccount" TEXT NOT NULL,
    "inventoryShippedNotInvoicedAccount" TEXT NOT NULL,
    "bankCashAccount" TEXT NOT NULL,
    "bankLocalCurrencyAccount" TEXT NOT NULL,
    "bankForeignCurrencyAccount" TEXT NOT NULL,

    -- liabilities
    "prepaymentAccount" TEXT NOT NULL,
    "payablesAccount" TEXT NOT NULL,
    "inventoryReceivedNotInvoicedAccount" TEXT NOT NULL,
    "salesTaxPayableAccount" TEXT NOT NULL,
    "purchaseTaxPayableAccount" TEXT NOT NULL,
    "reverseChargeSalesTaxPayableAccount" TEXT NOT NULL,

    -- retained earnings
    "retainedEarningsAccount" TEXT NOT NULL,

    "updatedBy" TEXT,



  CONSTRAINT "accountDefault_pkey" PRIMARY KEY ("id"),
  -- this is a hack to make sure that this table only ever has one row
  CONSTRAINT "accountDefault_id_check" CHECK ("id" = TRUE),
  CONSTRAINT "accountDefault_id_unique" UNIQUE ("id"),
  CONSTRAINT "accountDefault_salesAccount_fkey" FOREIGN KEY ("salesAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_salesDiscountAccount_fkey" FOREIGN KEY ("salesDiscountAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_costOfGoodsSoldAccount_fkey" FOREIGN KEY ("costOfGoodsSoldAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_purchaseAccount_fkey" FOREIGN KEY ("purchaseAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_directCostAppliedAccount_fkey" FOREIGN KEY ("directCostAppliedAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_overheadCostAppliedAccount_fkey" FOREIGN KEY ("overheadCostAppliedAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_purchaseVarianceAccount_fkey" FOREIGN KEY ("purchaseVarianceAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_inventoryAdjustmentVarianceAccount_fkey" FOREIGN KEY ("inventoryAdjustmentVarianceAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_materialVarianceAccount_fkey" FOREIGN KEY ("materialVarianceAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_capacityVarianceAccount_fkey" FOREIGN KEY ("capacityVarianceAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_overheadAccount_fkey" FOREIGN KEY ("overheadAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_maintenanceAccount_fkey" FOREIGN KEY ("maintenanceAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_assetDepreciationExpenseAccount_fkey" FOREIGN KEY ("assetDepreciationExpenseAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_assetGainsAndLossesAccount_fkey" FOREIGN KEY ("assetGainsAndLossesAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_serviceChargeAccount_fkey" FOREIGN KEY ("serviceChargeAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_interestAccount_fkey" FOREIGN KEY ("interestAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_supplierPaymentDiscountAccount_fkey" FOREIGN KEY ("supplierPaymentDiscountAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_customerPaymentDiscountAccount_fkey" FOREIGN KEY ("customerPaymentDiscountAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_roundingAccount_fkey" FOREIGN KEY ("roundingAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_aquisitionCostAccount_fkey" FOREIGN KEY ("assetAquisitionCostAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_aquisitionCostOnDisposalAccount_fkey" FOREIGN KEY ("assetAquisitionCostOnDisposalAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_accumulatedDepreciationAccount_fkey" FOREIGN KEY ("accumulatedDepreciationAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_accumulatedDepreciationOnDisposalAccount_fkey" FOREIGN KEY ("accumulatedDepreciationOnDisposalAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_inventoryAccount_fkey" FOREIGN KEY ("inventoryAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_inventoryInterimAccrualAccount_fkey" FOREIGN KEY ("inventoryInterimAccrualAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_workInProgressAccount_fkey" FOREIGN KEY ("workInProgressAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_receivablesAccount_fkey" FOREIGN KEY ("receivablesAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_inventoryShippedNotInvoicedAccount_fkey" FOREIGN KEY ("inventoryShippedNotInvoicedAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_bankCashAccount_fkey" FOREIGN KEY ("bankCashAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_bankLocalCurrencyAccount_fkey" FOREIGN KEY ("bankLocalCurrencyAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_bankForeignCurrencyAccount_fkey" FOREIGN KEY ("bankForeignCurrencyAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_prepaymentAccount_fkey" FOREIGN KEY ("prepaymentAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_payablesAccount_fkey" FOREIGN KEY ("payablesAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_inventoryReceivedNotInvoicedAccount_fkey" FOREIGN KEY ("inventoryReceivedNotInvoicedAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_salesTaxPayableAccount_fkey" FOREIGN KEY ("salesTaxPayableAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_reverseChargeSalesTaxPayableAccount_fkey" FOREIGN KEY ("reverseChargeSalesTaxPayableAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_purchaseTaxPayableAccount_fkey" FOREIGN KEY ("purchaseTaxPayableAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_retainedEarningsAccount_fkey" FOREIGN KEY ("retainedEarningsAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

ALTER TABLE "accountDefault" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Employees with accounting_view can view account defaults" ON "accountDefault"
  FOR SELECT
  USING (
    coalesce(get_my_claim('accounting_view')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with accounting_update can update account defaults" ON "accountDefault"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('accounting_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );



CREATE TABLE "postingGroupInventory" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "partGroupId" TEXT,
  "locationId" TEXT,
  "costOfGoodsSoldAccount" TEXT NOT NULL,
  "inventoryAccount" TEXT NOT NULL,
  "inventoryInterimAccrualAccount" TEXT NOT NULL,
  "inventoryReceivedNotInvoicedAccount" TEXT NOT NULL,
  "inventoryShippedNotInvoicedAccount" TEXT NOT NULL,
  "workInProgressAccount" TEXT NOT NULL,
  "directCostAppliedAccount" TEXT NOT NULL,
  "overheadCostAppliedAccount" TEXT NOT NULL,
  "purchaseVarianceAccount" TEXT NOT NULL,
  "inventoryAdjustmentVarianceAccount" TEXT NOT NULL,
  "materialVarianceAccount" TEXT NOT NULL,
  "capacityVarianceAccount" TEXT NOT NULL,
  "overheadAccount" TEXT NOT NULL,
  "updatedBy" TEXT,

  CONSTRAINT "postingGroupInventory_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "postingGroupInventory_id_partGroupId_locationId_key" UNIQUE ("partGroupId", "locationId"),
  CONSTRAINT "postingGroupInventory_partGroupId_fkey" FOREIGN KEY ("partGroupId") REFERENCES "partGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "postingGroupInventory_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "postingGroupInventory_costOfGoodsSoldAccount_fkey" FOREIGN KEY ("costOfGoodsSoldAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "postingGroupInventory_inventoryAccount_fkey" FOREIGN KEY ("inventoryAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "postingGroupInventory_inventoryInterimAccrualAccount_fkey" FOREIGN KEY ("inventoryInterimAccrualAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "postingGroupInventory_inventoryReceivedNotInvoicedAccount_fkey" FOREIGN KEY ("inventoryReceivedNotInvoicedAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "postingGroupInventory_inventoryShippedNotInvoicedAccount_fkey" FOREIGN KEY ("inventoryShippedNotInvoicedAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "postingGroupInventory_workInProgressAccount_fkey" FOREIGN KEY ("workInProgressAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "postingGroupInventory_directCostAppliedAccount_fkey" FOREIGN KEY ("directCostAppliedAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "postingGroupInventory_overheadCostAppliedAccount_fkey" FOREIGN KEY ("overheadCostAppliedAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "postingGroupInventory_purchaseVarianceAccount_fkey" FOREIGN KEY ("purchaseVarianceAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "postingGroupInventory_inventoryAdjustmentVarianceAccount_fkey" FOREIGN KEY ("inventoryAdjustmentVarianceAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "postingGroupInventory_materialVarianceAccount_fkey" FOREIGN KEY ("materialVarianceAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "postingGroupInventory_capacityVarianceAccount_fkey" FOREIGN KEY ("capacityVarianceAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "postingGroupInventory_overheadAccount_fkey" FOREIGN KEY ("overheadAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "postingGroupInventory_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "postingGroupInventory_partGroupId_locationId_idx" ON "postingGroupInventory" ("partGroupId", "locationId");

ALTER TABLE "postingGroupInventory" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with accounting_view can view inventory posting groups" ON "postingGroupInventory"
  FOR SELECT
  USING (
    coalesce(get_my_claim('accounting_view')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with accounting_update can update inventory posting groups" ON "postingGroupInventory"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('accounting_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );


CREATE TABLE "postingGroupPurchasing" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "supplierTypeId" TEXT,
  "partGroupId" TEXT,
  "purchaseAccount" TEXT NOT NULL,
  "purchaseDiscountAccount" TEXT NOT NULL,
  "purchaseCreditAccount" TEXT NOT NULL,
  "purchasePrepaymentAccount" TEXT NOT NULL,
  "purchaseTaxPayableAccount" TEXT NOT NULL,
  "updatedBy" TEXT,

  CONSTRAINT "postingGroupPurchasing_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "postingGroupPurchasing_id_supplierTypeId_partGroupId_key" UNIQUE ("supplierTypeId", "partGroupId"),
  CONSTRAINT "postingGroupPurchasing_partGroupId_fkey" FOREIGN KEY ("partGroupId") REFERENCES "partGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "postingGroupPurchasing_supplierTypeId_fkey" FOREIGN KEY ("supplierTypeId") REFERENCES "supplierType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "postingGroupPurchasing_purchaseAccount_fkey" FOREIGN KEY ("purchaseAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "postingGroupPurchasing_purchaseDiscountAccount_fkey" FOREIGN KEY ("purchaseDiscountAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "postingGroupPurchasing_purchaseCreditAccount_fkey" FOREIGN KEY ("purchaseCreditAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "postingGroupPurchasing_purchasePrepaymentAccount_fkey" FOREIGN KEY ("purchasePrepaymentAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "postingGroupPurchasing_purchaseTaxPayableAccount_fkey" FOREIGN KEY ("purchaseTaxPayableAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "postingGroupPurchasing_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "postingGroupPurchasing_partGroupId_supplierTypeId_idx" ON "postingGroupPurchasing" ("partGroupId", "supplierTypeId");

ALTER TABLE "postingGroupPurchasing" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with accounting_view can view purchasing posting groups" ON "postingGroupPurchasing"
  FOR SELECT
  USING (
    coalesce(get_my_claim('accounting_view')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with accounting_update can update purchasing posting groups" ON "postingGroupPurchasing"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('accounting_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE TABLE "postingGroupSales" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "customerTypeId" TEXT,
  "partGroupId" TEXT,
  "salesAccount" TEXT NOT NULL,
  "salesDiscountAccount" TEXT NOT NULL,
  "salesCreditAccount" TEXT NOT NULL,
  "salesPrepaymentAccount" TEXT NOT NULL,
  "salesTaxPayableAccount" TEXT NOT NULL,
  "updatedBy" TEXT,

  CONSTRAINT "postingGroupSales_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "postingGroupSales_id_customerTypeId_partGroupId_key" UNIQUE ("customerTypeId", "partGroupId"),
  CONSTRAINT "postingGroupSales_partGroupId_fkey" FOREIGN KEY ("partGroupId") REFERENCES "partGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "postingGroupSales_customerTypeId_fkey" FOREIGN KEY ("customerTypeId") REFERENCES "customerType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "postingGroupSales_salesAccount_fkey" FOREIGN KEY ("salesAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "postingGroupSales_salesDiscountAccount_fkey" FOREIGN KEY ("salesDiscountAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "postingGroupSales_salesCreditAccount_fkey" FOREIGN KEY ("salesCreditAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "postingGroupSales_salesPrepaymentAccount_fkey" FOREIGN KEY ("salesPrepaymentAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "postingGroupSales_salesTaxPayableAccount_fkey" FOREIGN KEY ("salesTaxPayableAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "postingGroupSales_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "postingGroupSales_partGroupId_customerTypeId_idx" ON "postingGroupSales" ("partGroupId", "customerTypeId");

CREATE POLICY "Employees with accounting_view can view sales posting groups" ON "postingGroupSales"
  FOR SELECT
  USING (
    coalesce(get_my_claim('accounting_view')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with accounting_update can update sales posting groups" ON "postingGroupSales"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('accounting_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE FUNCTION public.create_posting_groups_for_location()
RETURNS TRIGGER AS $$
DECLARE
  part_group RECORD;
  account_defaults RECORD;
BEGIN
  SELECT * INTO account_defaults FROM "accountDefault" WHERE "id" = TRUE;

  FOR part_group IN SELECT "id" FROM "partGroup"
  LOOP
    INSERT INTO "postingGroupInventory" (
      "partGroupId",
      "locationId",
      "costOfGoodsSoldAccount",
      "inventoryAccount",
      "inventoryInterimAccrualAccount",
      "inventoryReceivedNotInvoicedAccount",
      "inventoryShippedNotInvoicedAccount",
      "workInProgressAccount",
      "directCostAppliedAccount",
      "overheadCostAppliedAccount",
      "purchaseVarianceAccount",
      "inventoryAdjustmentVarianceAccount",
      "materialVarianceAccount",
      "capacityVarianceAccount",
      "overheadAccount",
      "updatedBy"
    ) VALUES (
      part_group."id",
      new."id",
      account_defaults."costOfGoodsSoldAccount",
      account_defaults."inventoryAccount",
      account_defaults."inventoryInterimAccrualAccount",
      account_defaults."inventoryReceivedNotInvoicedAccount",
      account_defaults."inventoryShippedNotInvoicedAccount",
      account_defaults."workInProgressAccount",
      account_defaults."directCostAppliedAccount",
      account_defaults."overheadCostAppliedAccount",
      account_defaults."purchaseVarianceAccount",
      account_defaults."inventoryAdjustmentVarianceAccount",
      account_defaults."materialVarianceAccount",
      account_defaults."capacityVarianceAccount",
      account_defaults."overheadAccount",
      new."createdBy"
    );
  END LOOP;

  -- insert the null part group
  INSERT INTO "postingGroupInventory" (
    "partGroupId",
    "locationId",
    "costOfGoodsSoldAccount",
    "inventoryAccount",
    "inventoryInterimAccrualAccount",
    "inventoryReceivedNotInvoicedAccount",
    "inventoryShippedNotInvoicedAccount",
    "workInProgressAccount",
    "directCostAppliedAccount",
    "overheadCostAppliedAccount",
    "purchaseVarianceAccount",
    "inventoryAdjustmentVarianceAccount",
    "materialVarianceAccount",
    "capacityVarianceAccount",
    "overheadAccount",
    "updatedBy"
  ) VALUES (
    NULL,
    new."id",
    account_defaults."costOfGoodsSoldAccount",
    account_defaults."inventoryAccount",
    account_defaults."inventoryInterimAccrualAccount",
    account_defaults."inventoryReceivedNotInvoicedAccount",
    account_defaults."inventoryShippedNotInvoicedAccount",
    account_defaults."workInProgressAccount",
    account_defaults."directCostAppliedAccount",
    account_defaults."overheadCostAppliedAccount",
    account_defaults."purchaseVarianceAccount",
    account_defaults."inventoryAdjustmentVarianceAccount",
    account_defaults."materialVarianceAccount",
    account_defaults."capacityVarianceAccount",
    account_defaults."overheadAccount",
    new."createdBy"
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER create_location
  AFTER INSERT on public."location"
  FOR EACH ROW EXECUTE PROCEDURE public.create_posting_groups_for_location();


CREATE FUNCTION public.create_posting_groups_for_part_group()
RETURNS TRIGGER AS $$
DECLARE
  rec RECORD;
  account_defaults RECORD;
BEGIN
  SELECT * INTO account_defaults FROM "accountDefault" WHERE "id" = TRUE;

  FOR rec IN SELECT "id" FROM "customerType"
  LOOP
    INSERT INTO "postingGroupSales" (
      "partGroupId",
      "customerTypeId",
      "salesAccount",
      "salesDiscountAccount",
      "salesCreditAccount",
      "salesPrepaymentAccount",
      "salesTaxPayableAccount",
      "updatedBy"
    ) VALUES (
      new."id",
      rec."id",
      account_defaults."salesAccount",
      account_defaults."salesDiscountAccount",
      account_defaults."receivablesAccount",
      account_defaults."prepaymentAccount",
      account_defaults."salesTaxPayableAccount",
      new."createdBy"
    );
  END LOOP;

  -- insert the null customer type
  INSERT INTO "postingGroupSales" (
    "partGroupId",
    "customerTypeId",
    "salesAccount",
    "salesDiscountAccount",
    "salesCreditAccount",
    "salesPrepaymentAccount",
    "salesTaxPayableAccount",
    "updatedBy"
  ) VALUES (
    new."id",
    NULL,
    account_defaults."salesAccount",
    account_defaults."salesDiscountAccount",
    account_defaults."receivablesAccount",
    account_defaults."prepaymentAccount",
    account_defaults."salesTaxPayableAccount",
    new."createdBy"
  );

  FOR rec IN SELECT "id" FROM "supplierType"
  LOOP
    INSERT INTO "postingGroupPurchasing" (
      "partGroupId",
      "supplierTypeId",
      "purchaseAccount",
      "purchaseDiscountAccount",
      "purchaseCreditAccount",
      "purchasePrepaymentAccount",
      "purchaseTaxPayableAccount",
      "updatedBy"
    ) VALUES (
      new."id",
      rec."id",
      account_defaults."purchaseAccount",
      account_defaults."purchaseAccount",
      account_defaults."payablesAccount",
      account_defaults."prepaymentAccount",
      account_defaults."purchaseTaxPayableAccount",
      new."createdBy"
    );
  END LOOP;

  -- insert the null supplier type
  INSERT INTO "postingGroupPurchasing" (
    "partGroupId",
    "supplierTypeId",
    "purchaseAccount",
    "purchaseDiscountAccount",
    "purchaseCreditAccount",
    "purchasePrepaymentAccount",
    "purchaseTaxPayableAccount",
    "updatedBy"
  ) VALUES (
    new."id",
    NULL,
    account_defaults."purchaseAccount",
    account_defaults."purchaseAccount",
    account_defaults."payablesAccount",
    account_defaults."prepaymentAccount",
    account_defaults."purchaseTaxPayableAccount",
    new."createdBy"
  );

  FOR rec IN SELECT "id" FROM "location"
  LOOP
    INSERT INTO "postingGroupInventory" (
      "partGroupId",
      "locationId",
      "costOfGoodsSoldAccount",
      "inventoryAccount",
      "inventoryInterimAccrualAccount",
      "inventoryReceivedNotInvoicedAccount",
      "inventoryShippedNotInvoicedAccount",
      "workInProgressAccount",
      "directCostAppliedAccount",
      "overheadCostAppliedAccount",
      "purchaseVarianceAccount",
      "inventoryAdjustmentVarianceAccount",
      "materialVarianceAccount",
      "capacityVarianceAccount",
      "overheadAccount",
      "updatedBy"
    ) VALUES (
      new."id",
      rec."id",
      account_defaults."costOfGoodsSoldAccount",
      account_defaults."inventoryAccount",
      account_defaults."inventoryInterimAccrualAccount",
      account_defaults."inventoryReceivedNotInvoicedAccount",
      account_defaults."inventoryShippedNotInvoicedAccount",
      account_defaults."workInProgressAccount",
      account_defaults."directCostAppliedAccount",
      account_defaults."overheadCostAppliedAccount",
      account_defaults."purchaseVarianceAccount",
      account_defaults."inventoryAdjustmentVarianceAccount",
      account_defaults."materialVarianceAccount",
      account_defaults."capacityVarianceAccount",
      account_defaults."overheadAccount",
      new."createdBy"
    );
  END LOOP;

  -- insert the null location
  INSERT INTO "postingGroupInventory" (
    "partGroupId",
    "locationId",
    "costOfGoodsSoldAccount",
    "inventoryAccount",
    "inventoryInterimAccrualAccount",
    "inventoryReceivedNotInvoicedAccount",
    "inventoryShippedNotInvoicedAccount",
    "workInProgressAccount",
    "directCostAppliedAccount",
    "overheadCostAppliedAccount",
    "purchaseVarianceAccount",
    "inventoryAdjustmentVarianceAccount",
    "materialVarianceAccount",
    "capacityVarianceAccount",
    "overheadAccount",
    "updatedBy"
  ) VALUES (
    new."id",
    NULL,
    account_defaults."costOfGoodsSoldAccount",
    account_defaults."inventoryAccount",
    account_defaults."inventoryInterimAccrualAccount",
    account_defaults."inventoryReceivedNotInvoicedAccount",
    account_defaults."inventoryShippedNotInvoicedAccount",
    account_defaults."workInProgressAccount",
    account_defaults."directCostAppliedAccount",
    account_defaults."overheadCostAppliedAccount",
    account_defaults."purchaseVarianceAccount",
    account_defaults."inventoryAdjustmentVarianceAccount",
    account_defaults."materialVarianceAccount",
    account_defaults."capacityVarianceAccount",
    account_defaults."overheadAccount",
    new."createdBy"
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE TRIGGER create_part_group
  AFTER INSERT on public."partGroup"
  FOR EACH ROW EXECUTE PROCEDURE public.create_posting_groups_for_part_group();

CREATE FUNCTION public.create_posting_groups_for_customer_type()
RETURNS TRIGGER AS $$
DECLARE
  rec RECORD;
  account_defaults RECORD;
BEGIN
  SELECT * INTO account_defaults FROM "accountDefault" WHERE "id" = TRUE;

  FOR rec IN SELECT "id" FROM "partGroup"
  LOOP
    INSERT INTO "postingGroupSales" (
      "customerTypeId",
      "partGroupId",
      "salesAccount",
      "salesDiscountAccount",
      "salesCreditAccount",
      "salesPrepaymentAccount",
      "salesTaxPayableAccount",
      "updatedBy"
    ) VALUES (
      new."id",
      rec."id",
      account_defaults."salesAccount",
      account_defaults."salesDiscountAccount",
      account_defaults."salesAccount",
      account_defaults."prepaymentAccount",
      account_defaults."salesTaxPayableAccount",
      new."createdBy"
    );
  END LOOP;

  -- insert the null part group
  INSERT INTO "postingGroupSales" (
    "customerTypeId",
    "partGroupId",
    "salesAccount",
    "salesDiscountAccount",
    "salesCreditAccount",
    "salesPrepaymentAccount",
    "salesTaxPayableAccount",
    "updatedBy"
  ) VALUES (
    new."id",
    NULL,
    account_defaults."salesAccount",
    account_defaults."salesDiscountAccount",
    account_defaults."salesAccount",
    account_defaults."prepaymentAccount",
    account_defaults."salesTaxPayableAccount",
    new."createdBy"
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER create_posting_groups_for_customer_type
  AFTER INSERT on public."customerType"
  FOR EACH ROW EXECUTE PROCEDURE public.create_posting_groups_for_customer_type();


CREATE FUNCTION public.create_posting_groups_for_supplier_type()
RETURNS TRIGGER AS $$
DECLARE
  rec RECORD;
  account_defaults RECORD;
BEGIN
  SELECT * INTO account_defaults FROM "accountDefault" WHERE "id" = TRUE;

  FOR rec IN SELECT "id" FROM "partGroup"
  LOOP
    INSERT INTO "postingGroupPurchasing" (
      "supplierTypeId",
      "partGroupId",
      "purchaseAccount",
      "purchaseDiscountAccount",
      "purchaseCreditAccount",
      "purchasePrepaymentAccount",
      "purchaseTaxPayableAccount",
      "updatedBy"
    ) VALUES (
      new."id",
      rec."id",
      account_defaults."purchaseAccount",
      account_defaults."purchaseAccount",
      account_defaults."purchaseAccount",
      account_defaults."prepaymentAccount",
      account_defaults."purchaseTaxPayableAccount",
      new."createdBy"
    );
  END LOOP;

  -- insert the null part group
  INSERT INTO "postingGroupPurchasing" (
    "supplierTypeId",
    "partGroupId",
    "purchaseAccount",
    "purchaseDiscountAccount",
    "purchaseCreditAccount",
    "purchasePrepaymentAccount",
    "purchaseTaxPayableAccount",
    "updatedBy"
  ) VALUES (
    new."id",
    NULL,
    account_defaults."purchaseAccount",
    account_defaults."purchaseAccount",
    account_defaults."purchaseAccount",
    account_defaults."prepaymentAccount",
    account_defaults."purchaseTaxPayableAccount",
    new."createdBy"
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER create_posting_groups_for_supplier_type
  AFTER INSERT on public."supplierType"
  FOR EACH ROW EXECUTE PROCEDURE public.create_posting_groups_for_supplier_type();
