-- users

INSERT INTO "user" ("id", "email", "firstName", "lastName")
VALUES ('system', 'system@carbon.us.org', 'System', 'Operation');

-- currencies

INSERT INTO "currency" ("name", "code", "symbol", "exchangeRate", "isBaseCurrency", "createdBy")
VALUES ('US Dollar', 'USD', '$', 1.0000, true, 'system');

-- attribute types


INSERT INTO "attributeDataType" ("label", "isBoolean", "isDate", "isList", "isNumeric", "isText", "isUser")
VALUES 
  ('Yes/No', true, false, false, false, false, false),
  ('Date', false, true, false, false, false, false),
  ('List', false, false, true, false, false, false),
  ('Numeric', false, false, false, true, false, false),
  ('Text', false, false, false, false, true, false),
  ('User', false, false, false, false, false, true);


-- supplier status

INSERT INTO "supplierStatus" ("name") VALUES ('Active'), ('Inactive'), ('Pending'), ('Rejected');

-- customer status

INSERT INTO "customerStatus" ("name") VALUES ('Active'), ('Inactive'), ('Prospect'), ('Lead'), ('On Hold'), ('Cancelled'), ('Archived');

-- unit of measure

INSERT INTO "unitOfMeasure" ("code", "name", "createdBy")
VALUES 
( 'EA', 'Each', 'system'),
( 'PCS', 'Pieces', 'system');

-- payment terms

INSERT INTO "paymentTerm" ("name", "daysDue", "calculationMethod", "daysDiscount", "discountPercentage", "createdBy") 
VALUES 
  ('Net 15', 15, 'Net', 0, 0, 'system'),
  ('Net 30', 30, 'Net', 0, 0, 'system'),
  ('Net 50', 50, 'Net', 0, 0, 'system'),
  ('Net 60', 60, 'Net', 0, 0, 'system'),
  ('Net 90', 90, 'Net', 0, 0, 'system'),
  ('1% 10 Net 30', 30, 'Net', 10, 1, 'system'),
  ('2% 10 Net 30', 30, 'Net', 10, 2, 'system'),
  ('Due on Receipt', 0, 'Net', 0, 0, 'system'),
  ('Net EOM 10', 10, 'End of Month', 0, 0, 'system');

-- sequences

INSERT INTO "sequence" ("table", "name", "prefix", "suffix", "next", "size", "step")
VALUES 
  ('purchaseOrder', 'Purchase Order', 'PO', NULL, 0, 6, 1),
  ('receipt', 'Receipt', 'RE', NULL, 0, 6, 1);

-- account categories

INSERT INTO public."accountCategory" (id, category, "incomeBalance", "normalBalance", "createdBy") 
VALUES 
  ('cjgo71si60lg1aoj5p40', 'Bank', 'Balance Sheet', 'Credit', 'system'),
  ('cjgo71si60lg1aoj5p4g', 'Accounts Receivable', 'Balance Sheet', 'Credit', 'system'),
  ('cjgo71si60lg1aoj5p50', 'Inventory', 'Balance Sheet', 'Debit', 'system'),
  ('cjgo71si60lg1aoj5p5g', 'Other Current Asset', 'Balance Sheet', 'Debit', 'system'),
  ('cjgo71si60lg1aoj5p60', 'Fixed Asset', 'Balance Sheet', 'Debit', 'system'),
  ('cjgo71si60lg1aoj5p6g', 'Accumulated Depreciation', 'Balance Sheet', 'Credit', 'system'),
  ('cjgo71si60lg1aoj5p70', 'Other Asset', 'Balance Sheet', 'Debit', 'system'),
  ('cjgo71si60lg1aoj5p7g', 'Accounts Payable', 'Balance Sheet', 'Debit', 'system'),
  ('cjgo71si60lg1aoj5p80', 'Other Current Liability', 'Balance Sheet', 'Debit', 'system'),
  ('cjgo71si60lg1aoj5p8g', 'Long Term Liability', 'Balance Sheet', 'Debit', 'system'),
  ('cjgo71si60lg1aoj5p90', 'Equity - No Close', 'Balance Sheet', 'Credit', 'system'),
  ('cjgo71si60lg1aoj5p9g', 'Equity - Close', 'Balance Sheet', 'Credit', 'system'),
  ('cjgo71si60lg1aoj5pa0', 'Retained Earnings', 'Balance Sheet', 'Credit', 'system'),
  ('cjgo71si60lg1aoj5pag', 'Income', 'Income Statement', 'Credit', 'system'),
  ('cjgo71si60lg1aoj5pb0', 'Cost of Goods Sold', 'Income Statement', 'Debit', 'system'),
  ('cjgo71si60lg1aoj5pbg', 'Expense', 'Income Statement', 'Debit', 'system'),
  ('cjgo71si60lg1aoj5pc0', 'Other Income', 'Income Statement', 'Credit', 'system'),
  ('cjgo71si60lg1aoj5pcg', 'Other Expense', 'Income Statement', 'Debit', 'system');

-- accounts

INSERT INTO public.account 
  (number, name, type, "accountCategoryId", "accountSubcategoryId", "incomeBalance", "normalBalance", "consolidatedRate", "directPosting", active, "createdBy") 
VALUES 
  ('10000', 'Income Statement', 'Begin Total', 'cjgo71si60lg1aoj5pag', NULL, 'Income Statement', 'Both', 'Average', false, true, 'system'),
  ('11000', 'Revenue', 'Begin Total', 'cjgo71si60lg1aoj5pag', NULL, 'Income Statement', 'Credit', 'Average', false, true, 'system'),
  ('11210', 'Sales', 'Posting', 'cjgo71si60lg1aoj5pag', NULL, 'Income Statement', 'Credit', 'Average', true, true, 'system'),
  ('11600', 'Sales Discounts', 'Posting', 'cjgo71si60lg1aoj5pag', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('19999', 'Revenue, Total', 'End Total', 'cjgo71si60lg1aoj5pag', NULL, 'Income Statement', 'Credit', 'Average', false, true, 'system'),
  ('20000', 'Costs of Goods Sold', 'Begin Total', 'cjgo71si60lg1aoj5pb0', NULL, 'Income Statement', 'Debit', 'Average', false, true, 'system'),
  ('21210', 'Cost of Goods Sold', 'Posting', 'cjgo71si60lg1aoj5pb0', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('21410', 'Purchases', 'Posting', 'cjgo71si60lg1aoj5pb0', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('21590', 'Direct Cost Applied', 'Posting', 'cjgo71si60lg1aoj5pb0', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('21600', 'Overhead Applied', 'Posting', 'cjgo71si60lg1aoj5pb0', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('21610', 'Purchase Variance', 'Posting', 'cjgo71si60lg1aoj5pb0', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('21700', 'Inventory Adjustment', 'Posting', 'cjgo71si60lg1aoj5pb0', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('24999', 'Costs of Goods Sold, Total', 'End Total', 'cjgo71si60lg1aoj5pbg', NULL, 'Income Statement', 'Debit', 'Average', false, true, 'system'),
  ('25000', 'Direct Capacity Cost', 'Begin Total', 'cjgo71si60lg1aoj5pbg', NULL, 'Income Statement', 'Debit', 'Average', false, true, 'system'),
  ('25705', 'Material Variance', 'Posting', 'cjgo71si60lg1aoj5pbg', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('25710', 'Capacity Variance', 'Posting', 'cjgo71si60lg1aoj5pbg', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('25720', 'Overhead Accounts', 'Posting', 'cjgo71si60lg1aoj5pbg', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('47045', 'Maintenance Expense', 'Posting', 'cjgo71si60lg1aoj5pbg', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('49999', 'Direct Capacity Cost, Total', 'End Total', 'cjgo71si60lg1aoj5pbg', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('50000', 'Depreciation of Fixed Assets', 'Begin Total', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Debit', 'Average', false, true, 'system'),
  ('50015', 'Depreciation Expense', 'Posting', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('50040', 'Gains and Losses on Disposal', 'Posting', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('50045', 'Service Charge Account', 'Posting', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('50999', 'Depreciation of Fixed Assets, Total', 'End Total', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Debit', 'Average', false, true, 'system'),
  ('51000', 'Interest', 'Begin Total', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Debit', 'Average', false, true, 'system'),
  ('51110', 'Interest Account', 'Posting', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('51115', 'Supplier Payment Discounts', 'Posting', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('51120', 'Customer Payment Discounts', 'Posting', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('51235', 'Rounding Account', 'Posting', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('51999', 'Interest, Total', 'End Total', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Debit', 'Average', false, true, 'system'),
  ('79999', 'Income Statement, Total', 'End Total', 'cjgo71si60lg1aoj5pag', NULL, 'Income Statement', 'Both', 'Average', true, true, 'system'),
  ('80000', 'Balance Sheet', 'Begin Total', NULL, NULL, 'Balance Sheet', 'Both', 'Average', false, true, 'system'),
  ('80001', 'Assets', 'Begin Total', NULL, NULL, 'Balance Sheet', 'Debit', 'Average', false, true, 'system'),
  ('81000', 'Fixed Assets', 'Begin Total', NULL, NULL, 'Balance Sheet', 'Debit', 'Average', false, true, 'system'),
  ('81010', 'Fixed Asset Acquisition Cost', 'Posting', 'cjgo71si60lg1aoj5p60', NULL, 'Balance Sheet', 'Debit', 'Average', true, true, 'system'),
  ('81015', 'Fixed Asset Acquisition Cost on Disposal', 'Posting', 'cjgo71si60lg1aoj5p60', NULL, 'Balance Sheet', 'Debit', 'Average', true, true, 'system'),
  ('81020', 'Accumulated Depreciation', 'Posting', 'cjgo71si60lg1aoj5p6g', NULL, 'Balance Sheet', 'Credit', 'Average', true, true, 'system'),
  ('81030', 'Fixed Asset Acquisition Depreciation on Disposal', 'Posting', 'cjgo71si60lg1aoj5p6g', NULL, 'Balance Sheet', 'Credit', 'Average', true, true, 'system'),
  ('81999', 'Fixed Assets, Total', 'End Total', NULL, NULL, 'Balance Sheet', 'Debit', 'Average', false, true, 'system'),
  ('83000', 'Current Assets', 'Begin Total', NULL, NULL, 'Balance Sheet', 'Both', 'Average', false, true, 'system'),
  ('83105', 'Inventory', 'Posting', 'cjgo71si60lg1aoj5p50', NULL, 'Balance Sheet', 'Debit', 'Average', true, true, 'system'),
  ('83120', 'Inventory Interim', 'Posting', 'cjgo71si60lg1aoj5p50', NULL, 'Balance Sheet', 'Debit', 'Average', true, true, 'system'),
  ('83125', 'Work In Progress (WIP)', 'Posting', 'cjgo71si60lg1aoj5p50', NULL, 'Balance Sheet', 'Debit', 'Average', true, true, 'system'),
  ('85005', 'Receivables', 'Posting', 'cjgo71si60lg1aoj5p4g', NULL, 'Balance Sheet', 'Credit', 'Average', true, true, 'system'),
  ('86005', 'Bank - Cash', 'Posting', 'cjgo71si60lg1aoj5p40', NULL, 'Balance Sheet', 'Credit', 'Average', true, true, 'system'),
  ('86010', 'Bank - Local Currency', 'Posting', 'cjgo71si60lg1aoj5p40', NULL, 'Balance Sheet', 'Credit', 'Average', false, true, 'system'),
  ('86015', 'Bank - Foreign Currency', 'Posting', 'cjgo71si60lg1aoj5p40', NULL, 'Balance Sheet', 'Credit', 'Average', false, true, 'system'),
  ('87999', 'Current Assets, Total', 'End Total', NULL, NULL, 'Balance Sheet', 'Both', 'Average', false, true, 'system'),
  ('89999', 'Assets, Total', 'End Total', NULL, NULL, 'Balance Sheet', 'Debit', 'Average', false, true, 'system'),
  ('90000', 'Liabilities', 'Begin Total', NULL, NULL, 'Balance Sheet', 'Debit', 'Average', false, true, 'system'),
  ('92210', 'Prepayments', 'Posting', 'cjgo71si60lg1aoj5p80', NULL, 'Balance Sheet', 'Debit', 'Average', true, true, 'system'),
  ('93005', 'Payables', 'Posting', 'cjgo71si60lg1aoj5p7g', NULL, 'Balance Sheet', 'Debit', 'Average', true, true, 'system'),
  ('94100', 'Sales Tax Payable', 'Posting', 'cjgo71si60lg1aoj5p80', NULL, 'Balance Sheet', 'Debit', 'Average', true, true, 'system'),
  ('94110', 'Purchase Tax Payable', 'Posting', 'cjgo71si60lg1aoj5p80', NULL, 'Balance Sheet', 'Debit', 'Average', true, true, 'system'),
  ('94115', 'Reverse Charge Tax Payable', 'Posting', 'cjgo71si60lg1aoj5p80', NULL, 'Balance Sheet', 'Debit', 'Average', true, true, 'system'),
  ('94999', 'Liabilities, Total', 'End Total', NULL, NULL, 'Balance Sheet', 'Debit', 'Average', false, true, 'system'),
  ('95000', 'Equity', 'Begin Total', NULL, NULL, 'Balance Sheet', 'Debit', 'Average', false, true, 'system'),
  ('95010', 'Retained Earnings', 'Posting', 'cjgo71si60lg1aoj5pa0', NULL, 'Balance Sheet', 'Credit', 'Average', false, true, 'system'),
  ('96010', 'Owner Equity', 'Posting', 'cjgo71si60lg1aoj5p90', NULL, 'Balance Sheet', 'Both', 'Average', true, true, 'system'),
  ('96999', 'Equity, Total', 'End Total', NULL, NULL, 'Balance Sheet', 'Debit', 'Average', false, true, 'system'),
  ('99999', 'Balance Sheet, Total', 'End Total', NULL, NULL, 'Balance Sheet', 'Both', 'Average', false, true, 'system');

  INSERT INTO public."accountDefault" (
    "id",
    "salesAccount",
    "salesDiscountAccount",
    "costOfGoodsSoldAccount",
    "purchaseAccount",
    "directCostAppliedAccount",
    "overheadCostAppliedAccount",
    "purchaseVarianceAccount",
    "inventoryAdjustmentVarianceAccount",
    "materialVarianceAccount",
    "capacityVarianceAccount",
    "overheadAccount",
    "maintenanceAccount",
    "assetDepreciationExpenseAccount",
    "assetGainsAndLossesAccount",
    "serviceChargeAccount",
    "interestAccount",
    "supplierPaymentDiscountAccount",
    "customerPaymentDiscountAccount",
    "roundingAccount",
    "assetAquisitionCostAccount",
    "assetAquisitionCostOnDisposalAccount",
    "accumulatedDepreciationAccount",
    "accumulatedDepreciationOnDisposalAccount",
    "inventoryAccount",
    "inventoryInterimAccrualAccount",
    "workInProgressAccount",
    "receivablesAccount",
    "bankCashAccount",
    "bankLocalCurrencyAccount",
    "bankForeignCurrencyAccount",
    "prepaymentAccount",
    "payablesAccount",
    "salesTaxPayableAccount",
    "purchaseTaxPayableAccount",
    "reverseChargeSalesTaxPayableAccount",
    "retainedEarningsAccount",
    "updatedBy"
  ) VALUES (
    true,
    '11210',
    '11600',
    '21210',
    '21410',
    '21590',
    '21600',
    '21610',
    '21700',
    '25705',
    '25710',
    '25720',
    '47045',
    '50015',
    '50040',
    '50045',
    '51110',
    '51115',
    '51120',
    '51235',
    '81010',
    '81015',
    '81020',
    '81030',
    '83105',
    '83120',
    '83125',
    '85005',
    '86005',
    '86010',
    '86015',
    '92210',
    '93005',
    '94100',
    '94110',
    '94115',
    '95010',
    'system'
  )