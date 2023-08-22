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
    "depreciationExpenseAccount" TEXT NOT NULL,
    "gainsAndLossesAccount" TEXT NOT NULL,
    "serviceChargeAccount" TEXT NOT NULL,

    -- interest
    "interestAccount" TEXT NOT NULL,
    "supplierPaymentDiscountAccount" TEXT NOT NULL,
    "customerPaymentDiscountAccount" TEXT NOT NULL,
    "roundingAccount" TEXT NOT NULL,

  -- balance sheet
    -- assets
    "aquisitionCostAccount" TEXT NOT NULL,
    "aquisitionCostOnDisposalAccount" TEXT NOT NULL,
    "accumulatedDepreciationAccount" TEXT NOT NULL,
    "accumulatedDepreciationOnDisposalAccount" TEXT NOT NULL,

    -- current assets
    "inventoryAccount" TEXT NOT NULL,
    "inventoryInterimAccrualAccount" TEXT NOT NULL,
    "workInProgressAccount" TEXT NOT NULL,
    "receivablesAccount" TEXT NOT NULL,
    "bankCashAccount" TEXT NOT NULL,
    "bankLocalCurrencyAccount" TEXT NOT NULL,
    "bankForeignCurrencyAccount" TEXT NOT NULL,

    -- liabilities
    "prepaymentAccount" TEXT NOT NULL,
    "payablesAccount" TEXT NOT NULL,
    "salesTaxAccount" TEXT NOT NULL,
    "reverseChargeSalesTaxAccount" TEXT NOT NULL,
    "purchaseTaxAccount" TEXT NOT NULL,

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
  CONSTRAINT "accountDefault_depreciationExpenseAccount_fkey" FOREIGN KEY ("depreciationExpenseAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_gainsAndLossesAccount_fkey" FOREIGN KEY ("gainsAndLossesAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_serviceChargeAccount_fkey" FOREIGN KEY ("serviceChargeAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_interestAccount_fkey" FOREIGN KEY ("interestAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_supplierPaymentDiscountAccount_fkey" FOREIGN KEY ("supplierPaymentDiscountAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_customerPaymentDiscountAccount_fkey" FOREIGN KEY ("customerPaymentDiscountAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_roundingAccount_fkey" FOREIGN KEY ("roundingAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_aquisitionCostAccount_fkey" FOREIGN KEY ("aquisitionCostAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_aquisitionCostOnDisposalAccount_fkey" FOREIGN KEY ("aquisitionCostOnDisposalAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_accumulatedDepreciationAccount_fkey" FOREIGN KEY ("accumulatedDepreciationAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_accumulatedDepreciationOnDisposalAccount_fkey" FOREIGN KEY ("accumulatedDepreciationOnDisposalAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_inventoryAccount_fkey" FOREIGN KEY ("inventoryAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_inventoryInterimAccrualAccount_fkey" FOREIGN KEY ("inventoryInterimAccrualAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_workInProgressAccount_fkey" FOREIGN KEY ("workInProgressAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_receivablesAccount_fkey" FOREIGN KEY ("receivablesAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_bankCashAccount_fkey" FOREIGN KEY ("bankCashAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_bankLocalCurrencyAccount_fkey" FOREIGN KEY ("bankLocalCurrencyAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_bankForeignCurrencyAccount_fkey" FOREIGN KEY ("bankForeignCurrencyAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_prepaymentAccount_fkey" FOREIGN KEY ("prepaymentAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_payablesAccount_fkey" FOREIGN KEY ("payablesAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_salesTaxAccount_fkey" FOREIGN KEY ("salesTaxAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_reverseChargeSalesTaxAccount_fkey" FOREIGN KEY ("reverseChargeSalesTaxAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_purchaseTaxAccount_fkey" FOREIGN KEY ("purchaseTaxAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_retainedEarningsAccount_fkey" FOREIGN KEY ("retainedEarningsAccount") REFERENCES "account" ("number") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "accountDefault_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);