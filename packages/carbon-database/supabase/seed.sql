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
  (id, number, name, type, "accountCategoryId", "accountSubcategoryId", "incomeBalance", "normalBalance", "consolidatedRate", "directPosting", active, "createdBy") 
VALUES 
  ('cjgodvci60lgpa0j5pjg', '10000', 'Income Statement', 'Begin Total', 'cjgo71si60lg1aoj5pag', NULL, 'Income Statement', 'Both', 'Average', false, true, 'system'),
  ('cjgodfki60lgnk8j5pj0', '11600', 'Line Discounts and Invoice Discounts', 'Posting', 'cjgo71si60lg1aoj5pag', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('cjgoecci60lgql0j5pk0', '11000', 'Revenue', 'Begin Total', 'cjgo71si60lg1aoj5pag', NULL, 'Income Statement', 'Credit', 'Average', false, true, 'system'),
  ('cjgoeq4i60lgs10j5pkg', '19999', 'Revenue, Total', 'End Total', 'cjgo71si60lg1aoj5pag', NULL, 'Income Statement', 'Credit', 'Average', false, true, 'system'),
  ('cjgocmki60lgkuoj5pig', '11210', 'Sales', 'Posting', 'cjgo71si60lg1aoj5pag', NULL, 'Income Statement', 'Credit', 'Average', true, true, 'system'),
  ('cjgojrki60lhd40j5pn0', '25705', 'Material Variance', 'Posting', 'cjgo71si60lg1aoj5pbg', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('cjgoifki60lh6bgj5pm0', '21210', 'Cost of Goods Sold', 'Posting', 'cjgo71si60lg1aoj5pb0', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('cjgoiqci60lh8j0j5pmg', '21410', 'Purchases', 'Posting', 'cjgo71si60lg1aoj5pb0', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('cjgokrsi60lhfvoj5po0', '21600', 'Overhead Applied', 'Posting', 'cjgo71si60lg1aoj5pb0', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('cjgokm4i60lhd7gj5png', '21590', 'Direct Cost Applied', 'Posting', 'cjgo71si60lg1aoj5pb0', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('cjgoldki60lhd7gj5pog', '25710', 'Capacity Variance', 'Posting', 'cjgo71si60lg1aoj5pbg', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('cjgolq4i60lhd7gj5pp0', '25720', 'Overhead Accounts', 'Posting', 'cjgo71si60lg1aoj5pbg', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('cjgohqci60lh6bgj5pl0', '20000', 'Costs of Goods Sold', 'Begin Total', 'cjgo71si60lg1aoj5pb0', NULL, 'Income Statement', 'Debit', 'Average', false, true, 'system'),
  ('cjgoi2ci60lh6bgj5plg', '24999', 'Costs of Goods Sold, Total', 'End Total', 'cjgo71si60lg1aoj5pbg', NULL, 'Income Statement', 'Debit', 'Average', false, true, 'system'),
  ('cjgomg4i60lhd7gj5ppg', '25000', 'Direct Capacity Cost', 'Begin Total', 'cjgo71si60lg1aoj5pbg', NULL, 'Income Statement', 'Debit', 'Average', false, true, 'system'),
  ('cjgomoki60lhm68j5pq0', '49999', 'Direct Capacity Cost, Total', 'End Total', 'cjgo71si60lg1aoj5pbg', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('cjgonbki60lhp00j5pqg', '47045', 'Maintenance Expense', 'Posting', 'cjgo71si60lg1aoj5pbg', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('cjgoo84i60lhq1oj5pr0', '50000', 'Depreciation of Fixed Assets', 'Begin Total', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Debit', 'Average', false, true, 'system'),
  ('cjgooeci60lhs50j5prg', '50999', 'Depreciation of Fixed Assets, Total', 'End Total', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Debit', 'Average', false, true, 'system'),
  ('cjgootki60lhs4oj5ps0', '50015', 'Depreciation Expense', 'Posting', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('cjgopfsi60li04gj5psg', '50040', 'Gains and Losses on Disposal', 'Posting', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('cjgopn4i60li0a8j5pt0', '50045', 'Service Charge Account', 'Posting', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('cjgoqlsi60li2kgj5ptg', '51000', 'Interest', 'Begin Total', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Debit', 'Average', false, true, 'system'),
  ('cjgoqrsi60li4boj5pu0', '51999', 'Interest, Total', 'End Total', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Debit', 'Average', false, true, 'system'),
  ('cjgor4si60li2kgj5pug', '51110', 'Interest Account', 'Posting', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('cjgoshki60li990j5pv0', '51115', 'Supplier Payment Discounts', 'Posting', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('cjgosoki60liamoj5pvg', '51120', 'Customer Payment Discounts', 'Posting', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('cjgot9si60licg8j5q00', '51235', 'Rounding Account', 'Posting', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Debit', 'Average', true, true, 'system'),
  ('cjgou7ki60lif0oj5q0g', '79999', 'Income Statement, Total', 'End Total', 'cjgo71si60lg1aoj5pag', NULL, 'Income Statement', 'Both', 'Average', true, true, 'system'),
  ('cjgoveci60lijugj5q10', '80000', 'Balance Sheet', 'Begin Total', NULL, NULL, 'Balance Sheet', 'Both', 'Average', false, true, 'system'),
  ('cjgp15ci60lipq8j5q2g', '89999', 'Assets, Total', 'End Total', NULL, NULL, 'Balance Sheet', 'Debit', 'Average', false, true, 'system'),
  ('cjgp0vsi60lipq0j5q20', '80001', 'Assets', 'Begin Total', NULL, NULL, 'Balance Sheet', 'Debit', 'Average', false, true, 'system'),
  ('cjgp1vci60lisg8j5q30', '81000', 'Fixed Assets', 'Begin Total', NULL, NULL, 'Balance Sheet', 'Debit', 'Average', false, true, 'system'),
  ('cjgp25ci60lisggj5q3g', '81999', 'Fixed Assets, Total', 'End Total', NULL, NULL, 'Balance Sheet', 'Debit', 'Average', false, true, 'system'),
  ('cjgp2l4i60livagj5q40', '81010', 'Fixed Asset Acquisition Cost', 'Posting', 'cjgo71si60lg1aoj5p60', NULL, 'Balance Sheet', 'Debit', 'Average', true, true, 'system'),
  ('cjh6nr4i60lnmbgj5q6g', '83000', 'Current Assets', 'Begin Total', NULL, NULL, 'Balance Sheet', 'Both', 'Average', false, true, 'system'),
  ('cjh6o3ci60lnmbgj5q70', '87999', 'Current Assets, Total', 'End Total', NULL, NULL, 'Balance Sheet', 'Both', 'Average', false, true, 'system'),
  ('cjh6o94i60lnn80j5q7g', '83105', 'Inventory', 'Posting', 'cjgo71si60lg1aoj5p50', NULL, 'Balance Sheet', 'Debit', 'Average', true, true, 'system'),
  ('cjh6ofsi60lnmbgj5q80', '83120', 'Inventory Interim', 'Posting', 'cjgo71si60lg1aoj5p50', NULL, 'Balance Sheet', 'Debit', 'Average', true, true, 'system'),
  ('cjgp2ski60livg0j5q4g', '81015', 'Fixed Asset Acquisition Cost on Disposal', 'Posting', 'cjgo71si60lg1aoj5p60', NULL, 'Balance Sheet', 'Debit', 'Average', true, true, 'system'),
  ('cjgp32ci60livg8j5q50', '81020', 'Accumulated Depreciation', 'Posting', 'cjgo71si60lg1aoj5p6g', NULL, 'Balance Sheet', 'Credit', 'Average', true, true, 'system'),
  ('cjgp4c4i60lj5aoj5q60', '81030', 'Fixed Asset Acquisition Depreciation on Disposal', 'Posting', 'cjgo71si60lg1aoj5p6g', NULL, 'Balance Sheet', 'Credit', 'Average', true, true, 'system'),
  ('cjh6oski60lnpo8j5q8g', '83125', 'Work In Progress (WIP)', 'Posting', 'cjgo71si60lg1aoj5p50', NULL, 'Balance Sheet', 'Debit', 'Average', true, true, 'system'),
  ('cjh6pp4i60lnse8j5q9g', '86005', 'Bank - Cash', 'Posting', 'cjgo71si60lg1aoj5p40', NULL, 'Balance Sheet', 'Credit', 'Average', true, true, 'system'),
  ('cjh6q84i60lntpoj5qag', '86015', 'Bank - Foreign Currency', 'Posting', 'cjgo71si60lg1aoj5p40', NULL, 'Balance Sheet', 'Credit', 'Average', false, true, 'system'),
  ('cjgp0kki60linooj5q1g', '99999', 'Balance Sheet, Total', 'End Total', NULL, NULL, 'Balance Sheet', 'Both', 'Average', false, true, 'system'),
  ('cjh8omki60lp5f0j5qb0', '90000', 'Liabilities', 'Begin Total', NULL, NULL, 'Balance Sheet', 'Debit', 'Average', false, true, 'system'),
  ('cjh8orci60lp5fgj5qbg', '94999', 'Liabilities, Total', 'End Total', NULL, NULL, 'Balance Sheet', 'Debit', 'Average', false, true, 'system'),
  ('cjh8p9ki60lp6pgj5qc0', '95000', 'Equity', 'Begin Total', NULL, NULL, 'Balance Sheet', 'Debit', 'Average', false, true, 'system'),
  ('cjh8phki60lp7goj5qcg', '96999', 'Equity, Total', 'End Total', NULL, NULL, 'Balance Sheet', 'Debit', 'Average', false, true, 'system'),
  ('cjh8poki60lp7goj5qd0', '95010', 'Retained Earnings', 'Posting', 'cjgo71si60lg1aoj5pa0', NULL, 'Balance Sheet', 'Credit', 'Average', false, true, 'system'),
  ('cjh97nci60lqlvoj5qg0', '94110', 'Purchase Tax Payable', 'Posting', 'cjgo71si60lg1aoj5p80', NULL, 'Balance Sheet', 'Debit', 'Average', true, true, 'system'),
  ('cjh95h4i60lqg2gj5qeg', '92210', 'Prepayments', 'Posting', 'cjgo71si60lg1aoj5p80', NULL, 'Balance Sheet', 'Debit', 'Average', true, true, 'system'),
  ('cjh9684i60lqitgj5qf0', '93005', 'Payables', 'Posting', 'cjgo71si60lg1aoj5p7g', NULL, 'Balance Sheet', 'Debit', 'Average', true, true, 'system'),
  ('cjh97e4i60lqlvoj5qfg', '94100', 'Sales Tax Payable', 'Posting', 'cjgo71si60lg1aoj5p80', NULL, 'Balance Sheet', 'Debit', 'Average', true, true, 'system'),
  ('cjh6p9si60lnpo8j5q90', '85005', 'Receivables', 'Posting', 'cjgo71si60lg1aoj5p4g', NULL, 'Balance Sheet', 'Credit', 'Average', true, true, 'system'),
  ('cjh6q0ki60lntpoj5qa0', '86010', 'Bank - Local Currency', 'Posting', 'cjgo71si60lg1aoj5p40', NULL, 'Balance Sheet', 'Credit', 'Average', false, true, 'system'),
  ('cjh91asi60lq258j5qdg', '96010', 'Owner Equity', 'Posting', 'cjgo71si60lg1aoj5p90', NULL, 'Balance Sheet', 'Credit', 'Average', true, true, 'system');