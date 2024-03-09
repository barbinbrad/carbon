-- users

INSERT INTO "user" ("id", "email", "firstName", "lastName")
VALUES ('system', 'system@carbon.us.org', 'System', 'Operation');

-- theme

INSERT INTO "theme" (
  "theme",
  "updatedBy"
) VALUES (
  'zinc',
  'system'
);

-- currencies

INSERT INTO "currency" ("name", "code", "symbol", "exchangeRate", "decimalPlaces", "isBaseCurrency") 
VALUES ('US Dollar', 'USD', '$', 1, 2, TRUE),
	('Canadian Dollar', 'CAD', 'CA$', 1, 2, FALSE),
	('Euro', 'EUR', '€', 1, 2, FALSE),
	('United Arab Emirates Dirham', 'AED', 'AED', 1, 2, FALSE),
	('Afghan Afghani', 'AFN', 'Af', 1, 0, FALSE),
	('Albanian Lek', 'ALL', 'ALL', 1, 0, FALSE),
	('Armenian Dram', 'AMD', 'AMD', 1, 0, FALSE),
	('Argentine Peso', 'ARS', 'AR$', 1, 2, FALSE),
	('Australian Dollar', 'AUD', 'AU$', 1, 2, FALSE),
	('Azerbaijani Manat', 'AZN', 'man.', 1, 2, FALSE),
	('Bosnia-Herzegovina Convertible Mark', 'BAM', 'KM', 1, 2, FALSE),
	('Bangladeshi Taka', 'BDT', 'Tk', 1, 2, FALSE),
	('Bulgarian Lev', 'BGN', 'BGN', 1, 2, FALSE),
	('Bahraini Dinar', 'BHD', 'BD', 1, 3, FALSE),
	('Burundian Franc', 'BIF', 'FBu', 1, 0, FALSE),
	('Brunei Dollar', 'BND', 'BN$', 1, 2, FALSE),
	('Bolivian Boliviano', 'BOB', 'Bs', 1, 2, FALSE),
	('Brazilian Real', 'BRL', 'R$', 1, 2, FALSE),
	('Botswanan Pula', 'BWP', 'BWP', 1, 2, FALSE),
	('Belarusian Ruble', 'BYN', 'Br', 1, 2, FALSE),
	('Belize Dollar', 'BZD', 'BZ$', 1, 2, FALSE),
	('Congolese Franc', 'CDF', 'CDF', 1, 2, FALSE),
	('Swiss Franc', 'CHF', 'CHF', 1, 2, FALSE),
	('Chilean Peso', 'CLP', 'CL$', 1, 0, FALSE),
	('Chinese Yuan', 'CNY', 'CN¥', 1, 2, FALSE),
	('Colombian Peso', 'COP', 'CO$', 1, 0, FALSE),
	('Costa Rican Colón', 'CRC', '₡', 1, 0, FALSE),
	('Cape Verdean Escudo', 'CVE', 'CV$', 1, 2, FALSE),
	('Czech Republic Koruna', 'CZK', 'Kč', 1, 2, FALSE),
	('Djiboutian Franc', 'DJF', 'Fdj', 1, 0, FALSE),
	('Danish Krone', 'DKK', 'Dkr', 1, 2, FALSE),
	('Dominican Peso', 'DOP', 'RD$', 1, 2, FALSE),
	('Algerian Dinar', 'DZD', 'DA', 1, 2, FALSE),
	('Egyptian Pound', 'EGP', 'EGP', 1, 2, FALSE),
	('Eritrean Nakfa', 'ERN', 'Nfk', 1, 2, FALSE),
	('Ethiopian Birr', 'ETB', 'Br', 1, 2, FALSE),
	('British Pound Sterling', 'GBP', '£', 1, 2, FALSE),
	('Georgian Lari', 'GEL', 'GEL', 1, 2, FALSE),
	('Ghanaian Cedi', 'GHS', 'GH₵', 1, 2, FALSE),
	('Guinean Franc', 'GNF', 'FG', 1, 0, FALSE),
	('Guatemalan Quetzal', 'GTQ', 'GTQ', 1, 2, FALSE),
	('Hong Kong Dollar', 'HKD', 'HK$', 1, 2, FALSE),
	('Honduran Lempira', 'HNL', 'HNL', 1, 2, FALSE),
	('Croatian Kuna', 'HRK', 'kn', 1, 2, FALSE),
	('Hungarian Forint', 'HUF', 'Ft', 1, 0, FALSE),
	('Indonesian Rupiah', 'IDR', 'Rp', 1, 0, FALSE),
	('Israeli New Sheqel', 'ILS', '₪', 1, 2, FALSE),
	('Indian Rupee', 'INR', 'Rs', 1, 2, FALSE),
	('Iraqi Dinar', 'IQD', 'IQD', 1, 0, FALSE),
	('Iranian Rial', 'IRR', 'IRR', 1, 0, FALSE),
	('Icelandic Króna', 'ISK', 'Ikr', 1, 0, FALSE),
	('Jamaican Dollar', 'JMD', 'J$', 1, 2, FALSE),
	('Jordanian Dinar', 'JOD', 'JD', 1, 3, FALSE),
	('Japanese Yen', 'JPY', '¥', 1, 0, FALSE),
	('Kenyan Shilling', 'KES', 'Ksh', 1, 2, FALSE),
	('Cambodian Riel', 'KHR', 'KHR', 1, 2, FALSE),
	('Comorian Franc', 'KMF', 'CF', 1, 0, FALSE),
	('South Korean Won', 'KRW', '₩', 1, 0, FALSE),
	('Kuwaiti Dinar', 'KWD', 'KD', 1, 3, FALSE),
	('Kazakhstani Tenge', 'KZT', 'KZT', 1, 2, FALSE),
	('Lebanese Pound', 'LBP', 'L.L.', 1, 0, FALSE),
	('Sri Lankan Rupee', 'LKR', 'SLRs', 1, 2, FALSE),
	('Lithuanian Litas', 'LTL', 'Lt', 1, 2, FALSE),
	('Latvian Lats', 'LVL', 'Ls', 1, 2, FALSE),
	('Libyan Dinar', 'LYD', 'LD', 1, 3, FALSE),
	('Moroccan Dirham', 'MAD', 'MAD', 1, 2, FALSE),
	('Moldovan Leu', 'MDL', 'MDL', 1, 2, FALSE),
	('Malagasy Ariary', 'MGA', 'MGA', 1, 0, FALSE),
	('Macedonian Denar', 'MKD', 'MKD', 1, 2, FALSE),
	('Myanma Kyat', 'MMK', 'MMK', 1, 0, FALSE),
	('Macanese Pataca', 'MOP', 'MOP$', 1, 2, FALSE),
	('Mauritian Rupee', 'MUR', 'MURs', 1, 0, FALSE),
	('Mexican Peso', 'MXN', 'MX$', 1, 2, FALSE),
	('Malaysian Ringgit', 'MYR', 'RM', 1, 2, FALSE),
	('Mozambican Metical', 'MZN', 'MTn', 1, 2, FALSE),
	('Namibian Dollar', 'NAD', 'N$', 1, 2, FALSE),
	('Nigerian Naira', 'NGN', '₦', 1, 2, FALSE),
	('Nicaraguan Córdoba', 'NIO', 'C$', 1, 2, FALSE),
	('Norwegian Krone', 'NOK', 'Nkr', 1, 2, FALSE),
	('Nepalese Rupee', 'NPR', 'NPRs', 1, 2, FALSE),
	('New Zealand Dollar', 'NZD', 'NZ$', 1, 2, FALSE),
	('Omani Rial', 'OMR', 'OMR', 1, 3, FALSE),
	('Panamanian Balboa', 'PAB', 'B/.', 1, 2, FALSE),
	('Peruvian Nuevo Sol', 'PEN', 'S/.', 1, 2, FALSE),
	('Philippine Peso', 'PHP', '₱', 1, 2, FALSE),
	('Pakistani Rupee', 'PKR', 'PKRs', 1, 0, FALSE),
	('Polish Zloty', 'PLN', 'zł', 1, 2, FALSE),
	('Paraguayan Guarani', 'PYG', '₲', 1, 0, FALSE),
	('Qatari Rial', 'QAR', 'QR', 1, 2, FALSE),
	('Romanian Leu', 'RON', 'RON', 1, 2, FALSE),
	('Serbian Dinar', 'RSD', 'din.', 1, 0, FALSE),
	('Russian Ruble', 'RUB', 'RUB', 1, 2, FALSE),
	('Rwandan Franc', 'RWF', 'RWF', 1, 0, FALSE),
	('Saudi Riyal', 'SAR', 'SR', 1, 2, FALSE),
	('Sudanese Pound', 'SDG', 'SDG', 1, 2, FALSE),
	('Swedish Krona', 'SEK', 'Skr', 1, 2, FALSE),
	('Singapore Dollar', 'SGD', 'S$', 1, 2, FALSE),
	('Somali Shilling', 'SOS', 'Ssh', 1, 0, FALSE),
	('Syrian Pound', 'SYP', 'SY£', 1, 0, FALSE),
	('Thai Baht', 'THB', '฿', 1, 2, FALSE),
	('Tunisian Dinar', 'TND', 'DT', 1, 3, FALSE),
	('Tongan Paʻanga', 'TOP', 'T$', 1, 2, FALSE),
	('Turkish Lira', 'TRY', 'TL', 1, 2, FALSE),
	('Trinidad and Tobago Dollar', 'TTD', 'TT$', 1, 2, FALSE),
	('New Taiwan Dollar', 'TWD', 'NT$', 1, 2, FALSE),
	('Tanzanian Shilling', 'TZS', 'TSh', 1, 0, FALSE),
	('Ukrainian Hryvnia', 'UAH', '₴', 1, 2, FALSE),
	('Ugandan Shilling', 'UGX', 'USh', 1, 0, FALSE),
	('Uruguayan Peso', 'UYU', '$U', 1, 2, FALSE),
	('Uzbekistan Som', 'UZS', 'UZS', 1, 0, FALSE),
	('Venezuelan Bolívar', 'VEF', 'Bs.F.', 1, 2, FALSE),
	('Vietnamese Dong', 'VND', '₫', 1, 0, FALSE),
	('CFA Franc BEAC', 'XAF', 'FCFA', 1, 0, FALSE),
	('CFA Franc BCEAO', 'XOF', 'CFA', 1, 0, FALSE),
	('Yemeni Rial', 'YER', 'YR', 1, 0, FALSE),
	('South African Rand', 'ZAR', 'R', 1, 2, FALSE),
	('Zambian Kwacha', 'ZMK', 'ZK', 1, 0, FALSE),
	('Zimbabwean Dollar', 'ZWL', 'ZWL$', 1, 0, FALSE);

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
  ('purchaseInvoice', 'Purchase Invoice', 'AP', NULL, 0, 6, 1),
  ('receipt', 'Receipt', 'RE', NULL, 0, 6, 1),
  ('requestForQuote', 'Request For Quote', 'RFQ', NULL, 0, 6, 1),
  ('quote', 'Quote', 'QUO', NULL, 0, 6, 1);

-- account categories

INSERT INTO public."accountCategory" (id, category, class, "incomeBalance", "createdBy") 
VALUES 
  ('cjgo71si60lg1aoj5p40', 'Bank', 'Asset', 'Balance Sheet', 'system'),
  ('cjgo71si60lg1aoj5p4g', 'Accounts Receivable', 'Asset', 'Balance Sheet', 'system'),
  ('cjgo71si60lg1aoj5p50', 'Inventory', 'Asset', 'Balance Sheet', 'system'),
  ('cjgo71si60lg1aoj5p5g', 'Other Current Asset', 'Asset', 'Balance Sheet', 'system'),
  ('cjgo71si60lg1aoj5p60', 'Fixed Asset', 'Asset', 'Balance Sheet', 'system'),
  ('cjgo71si60lg1aoj5p6g', 'Accumulated Depreciation', 'Asset', 'Balance Sheet', 'system'),
  ('cjgo71si60lg1aoj5p70', 'Other Asset', 'Asset', 'Balance Sheet', 'system'),
  ('cjgo71si60lg1aoj5p7g', 'Accounts Payable', 'Liability', 'Balance Sheet', 'system'),
  ('cjgo71si60lg1aoj5p80', 'Other Current Liability', 'Liability', 'Balance Sheet', 'system'),
  ('cjgo71si60lg1aoj5p8g', 'Long Term Liability', 'Liability', 'Balance Sheet', 'system'),
  ('cjgo71si60lg1aoj5p90', 'Equity - No Close', 'Equity', 'Balance Sheet', 'system'),
  ('cjgo71si60lg1aoj5p9g', 'Equity - Close', 'Equity', 'Balance Sheet', 'system'),
  ('cjgo71si60lg1aoj5pa0', 'Retained Earnings', 'Equity', 'Balance Sheet', 'system'),
  ('cjgo71si60lg1aoj5pag', 'Income', 'Revenue', 'Income Statement', 'system'),
  ('cjgo71si60lg1aoj5pb0', 'Cost of Goods Sold', 'Expense', 'Income Statement', 'system'),
  ('cjgo71si60lg1aoj5pbg', 'Expense', 'Expense', 'Income Statement', 'system'),
  ('cjgo71si60lg1aoj5pc0', 'Other Income', 'Expense', 'Income Statement', 'system'),
  ('cjgo71si60lg1aoj5pcg', 'Other Expense', 'Expense', 'Income Statement', 'system');

-- accounts

INSERT INTO public.account 
  (number, name, type, "accountCategoryId", "accountSubcategoryId", "incomeBalance", "class", "consolidatedRate", "directPosting", active, "createdBy") 
VALUES 
  ('10000', 'Income Statement', 'Begin Total', 'cjgo71si60lg1aoj5pag', NULL, 'Income Statement', null, 'Average', false, true, 'system'),
  ('11000', 'Revenue', 'Begin Total', 'cjgo71si60lg1aoj5pag', NULL, 'Income Statement', 'Revenue', 'Average', false, true, 'system'),
  ('11210', 'Sales', 'Posting', 'cjgo71si60lg1aoj5pag', NULL, 'Income Statement', 'Revenue', 'Average', true, true, 'system'),
  ('11600', 'Sales Discounts', 'Posting', 'cjgo71si60lg1aoj5pag', NULL, 'Income Statement', 'Revenue', 'Average', true, true, 'system'),
  ('19999', 'Revenue, Total', 'End Total', 'cjgo71si60lg1aoj5pag', NULL, 'Income Statement', 'Revenue', 'Average', false, true, 'system'),
  ('20000', 'Costs of Goods Sold', 'Begin Total', 'cjgo71si60lg1aoj5pb0', NULL, 'Income Statement', 'Expense', 'Average', false, true, 'system'),
  ('21210', 'Cost of Goods Sold', 'Posting', 'cjgo71si60lg1aoj5pb0', NULL, 'Income Statement', 'Expense',  'Average', true, true, 'system'),
  ('21410', 'Purchases', 'Posting', 'cjgo71si60lg1aoj5pb0', NULL, 'Income Statement', 'Expense', 'Average', true, true, 'system'),
  ('21590', 'Direct Cost Applied', 'Posting', 'cjgo71si60lg1aoj5pb0', NULL, 'Income Statement', 'Expense', 'Average', true, true, 'system'),
  ('21600', 'Overhead Applied', 'Posting', 'cjgo71si60lg1aoj5pb0', NULL, 'Income Statement', 'Expense', 'Average', true, true, 'system'),
  ('21610', 'Purchase Variance', 'Posting', 'cjgo71si60lg1aoj5pb0', NULL, 'Income Statement', 'Expense', 'Average', true, true, 'system'),
  ('21700', 'Inventory Adjustment', 'Posting', 'cjgo71si60lg1aoj5pb0', NULL, 'Income Statement', 'Expense', 'Average', true, true, 'system'),
  ('24999', 'Costs of Goods Sold, Total', 'End Total', 'cjgo71si60lg1aoj5pbg', NULL, 'Income Statement', 'Expense', 'Average', false, true, 'system'),
  ('25000', 'Direct Capacity Cost', 'Begin Total', 'cjgo71si60lg1aoj5pbg', NULL, 'Income Statement', 'Expense', 'Average', false, true, 'system'),
  ('25705', 'Material Variance', 'Posting', 'cjgo71si60lg1aoj5pbg', NULL, 'Income Statement', 'Expense', 'Average', true, true, 'system'),
  ('25710', 'Capacity Variance', 'Posting', 'cjgo71si60lg1aoj5pbg', NULL, 'Income Statement', 'Expense', 'Average', true, true, 'system'),
  ('25720', 'Overhead Accounts', 'Posting', 'cjgo71si60lg1aoj5pbg', NULL, 'Income Statement', 'Expense', 'Average', true, true, 'system'),
  ('47045', 'Maintenance Expense', 'Posting', 'cjgo71si60lg1aoj5pbg', NULL, 'Income Statement', 'Expense', 'Average', true, true, 'system'),
  ('49999', 'Direct Capacity Cost, Total', 'End Total', 'cjgo71si60lg1aoj5pbg', NULL, 'Income Statement', 'Expense', 'Average', true, true, 'system'),
  ('50000', 'Depreciation of Fixed Assets', 'Begin Total', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Expense', 'Average', false, true, 'system'),
  ('50015', 'Depreciation Expense', 'Posting', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Expense', 'Average', true, true, 'system'),
  ('50040', 'Gains and Losses on Disposal', 'Posting', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Expense', 'Average', true, true, 'system'),
  ('50045', 'Service Charge Account', 'Posting', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Expense', 'Average', true, true, 'system'),
  ('50999', 'Depreciation of Fixed Assets, Total', 'End Total', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Expense', 'Average', false, true, 'system'),
  ('51000', 'Interest', 'Begin Total', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Expense', 'Average', false, true, 'system'),
  ('51110', 'Interest Account', 'Posting', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Expense', 'Average', true, true, 'system'),
  ('51115', 'Supplier Payment Discounts', 'Posting', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Expense', 'Average', true, true, 'system'),
  ('51120', 'Customer Payment Discounts', 'Posting', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Expense', 'Average', true, true, 'system'),
  ('51235', 'Rounding Account', 'Posting', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Expense', 'Average', true, true, 'system'),
  ('51999', 'Interest, Total', 'End Total', 'cjgo71si60lg1aoj5pcg', NULL, 'Income Statement', 'Expense', 'Average',  false, true, 'system'),
  ('79999', 'Income Statement, Total', 'Total', 'cjgo71si60lg1aoj5pag', NULL, 'Income Statement', null, 'Average', false, true, 'system'),
  ('80000', 'Balance Sheet', 'Begin Total', NULL, NULL, 'Balance Sheet', null, 'Average', false, true, 'system'),
  ('80001', 'Assets', 'Begin Total', NULL, NULL, 'Balance Sheet', 'Asset', 'Average', false, true, 'system'),
  ('81000', 'Fixed Assets', 'Begin Total', NULL, NULL, 'Balance Sheet', 'Asset', 'Average', false, true, 'system'),
  ('81010', 'Fixed Asset Acquisition Cost', 'Posting', 'cjgo71si60lg1aoj5p60', NULL, 'Balance Sheet', 'Asset', 'Average', true, true, 'system'),
  ('81015', 'Fixed Asset Acquisition Cost on Disposal', 'Posting', 'cjgo71si60lg1aoj5p60', NULL, 'Balance Sheet', 'Asset','Average', true, true, 'system'),
  ('81020', 'Accumulated Depreciation', 'Posting', 'cjgo71si60lg1aoj5p6g', NULL, 'Balance Sheet', 'Asset', 'Average', true, true, 'system'),
  ('81030', 'Fixed Asset Acquisition Depreciation on Disposal', 'Posting', 'cjgo71si60lg1aoj5p6g', NULL, 'Balance Sheet', 'Asset', 'Average', true, true, 'system'),
  ('81999', 'Fixed Assets, Total', 'End Total', NULL, NULL, 'Balance Sheet', 'Asset', 'Average', false, true, 'system'),
  ('83000', 'Current Assets', 'Begin Total', NULL, NULL, 'Balance Sheet', 'Asset', 'Average', false, true, 'system'),
  ('83105', 'Inventory', 'Posting', 'cjgo71si60lg1aoj5p50', NULL, 'Balance Sheet', 'Asset', 'Average', true, true, 'system'),
  ('83120', 'Inventory Interim', 'Posting', 'cjgo71si60lg1aoj5p50', NULL, 'Balance Sheet', 'Asset', 'Average', true, true, 'system'),
  ('83125', 'Work In Progress (WIP)', 'Posting', 'cjgo71si60lg1aoj5p50', NULL, 'Balance Sheet', 'Asset', 'Average', true, true, 'system'),
  ('85005', 'Receivables', 'Posting', 'cjgo71si60lg1aoj5p4g', NULL, 'Balance Sheet', 'Asset', 'Average', true, true, 'system'),
  ('85020', 'Inventory Invoiced Not Received', 'Posting', 'cjgo71si60lg1aoj5p4g', NULL, 'Balance Sheet', 'Asset', 'Average', true, true, 'system'),
  ('86005', 'Bank - Cash', 'Posting', 'cjgo71si60lg1aoj5p40', NULL, 'Balance Sheet', 'Asset', 'Average', true, true, 'system'),
  ('86010', 'Bank - Local Currency', 'Posting', 'cjgo71si60lg1aoj5p40', NULL, 'Balance Sheet', 'Asset', 'Average', false, true, 'system'),
  ('86015', 'Bank - Foreign Currency', 'Posting', 'cjgo71si60lg1aoj5p40', NULL, 'Balance Sheet', 'Asset', 'Average', false, true, 'system'),
  ('87999', 'Current Assets, Total', 'End Total', NULL, NULL, 'Balance Sheet', 'Asset', 'Average', false, true, 'system'),
  ('89999', 'Assets, Total', 'End Total', NULL, NULL, 'Balance Sheet', 'Asset', 'Average', false, true, 'system'),
  ('90000', 'Liabilities', 'Begin Total', NULL, NULL, 'Balance Sheet', 'Liability', 'Average',  false, true, 'system'),
  ('92210', 'Customer Prepayments', 'Posting', 'cjgo71si60lg1aoj5p80', NULL, 'Balance Sheet', 'Liability', 'Average', true, true, 'system'),
  ('93005', 'Payables', 'Posting', 'cjgo71si60lg1aoj5p7g', NULL, 'Balance Sheet', 'Liability', 'Average', true, true, 'system'),
  ('93010', 'Inventory Received Not Invoiced', 'Posting', 'cjgo71si60lg1aoj5p80', NULL, 'Balance Sheet', 'Liability', 'Average', true, true, 'system'),
  ('93110', 'Inventory Shipped Not Invoiced', 'Posting', 'cjgo71si60lg1aoj5p80', NULL, 'Balance Sheet', 'Liability', 'Average', true, true, 'system'),
  ('94100', 'Sales Tax Payable', 'Posting', 'cjgo71si60lg1aoj5p80', NULL, 'Balance Sheet', 'Liability', 'Average', true, true, 'system'),
  ('94110', 'Purchase Tax Payable', 'Posting', 'cjgo71si60lg1aoj5p80', NULL, 'Balance Sheet', 'Liability', 'Average', true, true, 'system'),
  ('94115', 'Reverse Charge Tax Payable', 'Posting', 'cjgo71si60lg1aoj5p80', NULL, 'Balance Sheet', 'Liability', 'Average', true, true, 'system'),
  ('94999', 'Liabilities, Total', 'End Total', NULL, NULL, 'Balance Sheet', 'Liability', 'Average', false, true, 'system'),
  ('95000', 'Equity', 'Begin Total', NULL, NULL, 'Balance Sheet', 'Equity', 'Average', false, true, 'system'),
  ('95010', 'Retained Earnings', 'Posting', 'cjgo71si60lg1aoj5pa0', NULL, 'Balance Sheet', 'Equity', 'Average', false, true, 'system'),
  ('96010', 'Owner Equity', 'Posting', 'cjgo71si60lg1aoj5p90', NULL, 'Balance Sheet', 'Equity', 'Average', true, true, 'system'),
  ('96999', 'Equity, Total', 'End Total', NULL, NULL, 'Balance Sheet', 'Equity', 'Average', false, true, 'system'),
  ('99999', 'Balance Sheet, Total', 'Total', NULL, NULL, 'Balance Sheet', null, 'Average', false, true, 'system');

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
    "inventoryInvoicedNotReceivedAccount",
    "bankCashAccount",
    "bankLocalCurrencyAccount",
    "bankForeignCurrencyAccount",
    "prepaymentAccount",
    "payablesAccount",
    "inventoryReceivedNotInvoicedAccount",
    "inventoryShippedNotInvoicedAccount",
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
    '85020',
    '86005',
    '86010',
    '86015',
    '92210',
    '93005',
    '93010',
    '93110',
    '94100',
    '94110',
    '94115',
    '95010',
    'system'
  );


INSERT INTO "postingGroupInventory" (
  "partGroupId",
  "costOfGoodsSoldAccount",
  "inventoryAccount",
  "inventoryInterimAccrualAccount",
  "inventoryReceivedNotInvoicedAccount",
  "inventoryInvoicedNotReceivedAccount",
  "inventoryShippedNotInvoicedAccount",
  "workInProgressAccount",
  "directCostAppliedAccount",
  "overheadCostAppliedAccount",
  "purchaseVarianceAccount",
  "inventoryAdjustmentVarianceAccount",
  "materialVarianceAccount",
  "capacityVarianceAccount",
  "overheadAccount"
) SELECT 
  NULL,
  "costOfGoodsSoldAccount",
  "inventoryAccount",
  "inventoryInterimAccrualAccount",
  "inventoryReceivedNotInvoicedAccount",
  "inventoryInvoicedNotReceivedAccount",
  "inventoryShippedNotInvoicedAccount",
  "workInProgressAccount",
  "directCostAppliedAccount",
  "overheadCostAppliedAccount",
  "purchaseVarianceAccount",
  "inventoryAdjustmentVarianceAccount",
  "materialVarianceAccount",
  "capacityVarianceAccount",
  "overheadAccount"
FROM "accountDefault" WHERE "id" = true;

INSERT INTO "postingGroupPurchasing" (
  "partGroupId",
  "supplierTypeId",
  "payablesAccount",
  "purchaseAccount",
  "purchaseDiscountAccount",
  "purchaseCreditAccount",
  "purchasePrepaymentAccount",
  "purchaseTaxPayableAccount",
  "updatedBy"
) SELECT 
  NULL,
  NULL,
  "payablesAccount",
  "purchaseAccount",
  "purchaseAccount",
  "purchaseAccount",
  "prepaymentAccount",
  "purchaseTaxPayableAccount",
  'system'
FROM "accountDefault" WHERE "id" = true;

INSERT INTO "postingGroupSales" (
  "partGroupId",
  "customerTypeId",
  "receivablesAccount",
  "salesAccount",
  "salesDiscountAccount",
  "salesCreditAccount",
  "salesPrepaymentAccount",
  "salesTaxPayableAccount",
  "updatedBy"
) SELECT 
  NULL,
  NULL,
  "receivablesAccount",
  "salesAccount",
  "salesDiscountAccount",
  "salesAccount",
  "prepaymentAccount",
  "salesTaxPayableAccount",
  'system'
FROM "accountDefault" WHERE "id" = true;

INSERT INTO "fiscalYearSettings" (
  "startMonth",
  "taxStartMonth",
  "updatedBy"
) VALUES (
  'January',
  'January',
  'system'
);