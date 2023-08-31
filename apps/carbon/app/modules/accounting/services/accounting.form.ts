import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const accountDocumentLedgerType = [
  "Quote",
  "Order",
  "Invoice",
  "Credit Memo",
  "Blanket Order",
  "Return Order",
] as const;

export const accountTypes = [
  "Posting",
  "Heading",
  // "Total",
  "Begin Total",
  "End Total",
] as const;

export const consolidatedRateTypes = [
  "Average",
  "Current",
  "Historical",
] as const;

const costLedgerTypes = [
  "Direct Cost",
  "Revaluation",
  "Rounding",
  "Indirect Cost",
  "Variance",
  "Total",
] as const;

const partLedgerTypes = [
  "Purchase",
  "Sale",
  "Positive Adjmt.",
  "Negative Adjmt.",
  "Transfer",
  "Consumption",
  "Output",
  "Assembly Consumption",
  "Assembly Output",
] as const;

const partLedgerDocumentTypes = [
  "Sales Shipment",
  "Sales Invoice",
  "Sales Return Receipt",
  "Sales Credit Memo",
  "Purchase Receipt",
  "Purchase Invoice",
  "Purchase Return Shipment",
  "Purchase Credit Memo",
  "Transfer Shipment",
  "Transfer Receipt",
  "Service Shipment",
  "Service Invoice",
  "Service Credit Memo",
  "Posted Assembly",
  "Inventory Receipt",
  "Inventory Shipment",
  "Direct Transfer",
] as const;

export const incomeBalanceTypes = [
  "Balance Sheet",
  "Income Statement",
] as const;
export const normalBalanceTypes = ["Debit", "Credit", "Both"] as const;

export const accountValidator = withZod(
  z
    .object({
      id: zfd.text(z.string().optional()),
      number: z.string().min(1, { message: "Number is required" }),
      name: z.string().min(1, { message: "Name is required" }),
      type: z.enum(accountTypes, {
        errorMap: (issue, ctx) => ({
          message: "Type is required",
        }),
      }),
      accountCategoryId: zfd.text(z.string().optional()),
      accountSubcategoryId: zfd.text(z.string().optional()),
      incomeBalance: z.enum(incomeBalanceTypes, {
        errorMap: (issue, ctx) => ({
          message: "Income balance is required",
        }),
      }),
      normalBalance: z.enum(normalBalanceTypes, {
        errorMap: (issue, ctx) => ({
          message: "Normal balance is required",
        }),
      }),
      consolidatedRate: z.enum(consolidatedRateTypes),
      directPosting: zfd.checkbox(),
    })
    .refine(
      (data) => {
        if (!["Heading", "Begin Total", "End Total"].includes(data.type)) {
          return !!data.accountCategoryId;
        }
        return true;
      },
      { message: "Account category is required", path: ["accountCategoryId"] }
    )
);

export const accountCategoryValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    category: z.string().min(1, { message: "Category is required" }),
    incomeBalance: z.enum(incomeBalanceTypes, {
      errorMap: (issue, ctx) => ({
        message: "Income balance is required",
      }),
    }),
    normalBalance: z.enum(normalBalanceTypes, {
      errorMap: (issue, ctx) => ({
        message: "Normal balance is required",
      }),
    }),
  })
);

export const accountLedgerValidator = withZod(
  z.object({
    postingDate: z.string().min(1, { message: "Posting date is required" }),
    accountNumber: z.string().min(1, { message: "Account is required" }),
    description: z.string().optional(),
    amount: z.number(),
    documentType: z.union([z.enum(accountDocumentLedgerType), z.undefined()]),
    documentNumber: z.string().optional(),
    externalDocumentNumber: z.string().optional(),
  })
);

export const accountSubcategoryValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    name: z.string().min(1, { message: "Name is required" }),
    accountCategoryId: z.string().min(20, { message: "Category is required" }),
  })
);

export const currencyValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    name: z.string().min(1, { message: "Name is required" }),
    code: z.string().min(1, { message: "Code is required" }),
    symbol: zfd.text(
      z
        .string()
        .max(1, { message: "Symbol can only be one character" })
        .optional()
    ),
    exchangeRate: zfd.numeric(),
    isBaseCurrency: zfd.checkbox(),
  })
);

export const defaultAcountValidator = withZod(
  z.object({
    salesAccount: z.string().min(1, { message: "Sales account is required" }),
    salesDiscountAccount: z.string().min(1, {
      message: "Sales discount account is required",
    }),
    costOfGoodsSoldAccount: z.string().min(1, {
      message: "Cost of goods sold account is required",
    }),
    purchaseAccount: z.string().min(1, {
      message: "Purchase account is required",
    }),
    directCostAppliedAccount: z.string().min(1, {
      message: "Direct cost applied account is required",
    }),
    overheadCostAppliedAccount: z.string().min(1, {
      message: "Overhead cost applied account is required",
    }),
    purchaseVarianceAccount: z.string().min(1, {
      message: "Purchase variance account is required",
    }),
    inventoryAdjustmentVarianceAccount: z.string().min(1, {
      message: "Inventory adjustment variance account is required",
    }),
    materialVarianceAccount: z.string().min(1, {
      message: "Material variance account is required",
    }),
    capacityVarianceAccount: z.string().min(1, {
      message: "Capacity variance account is required",
    }),
    overheadAccount: z.string().min(1, {
      message: "Overhead account is required",
    }),
    maintenanceAccount: z.string().min(1, {
      message: "Maintenance account is required",
    }),
    assetDepreciationExpenseAccount: z.string().min(1, {
      message: "Depreciation expense account is required",
    }),
    assetGainsAndLossesAccount: z.string().min(1, {
      message: "Gains and losses account is required",
    }),
    serviceChargeAccount: z.string().min(1, {
      message: "Service charge account is required",
    }),
    interestAccount: z.string().min(1, {
      message: "Interest account is required",
    }),
    supplierPaymentDiscountAccount: z.string().min(1, {
      message: "Supplier payment discount account is required",
    }),
    customerPaymentDiscountAccount: z.string().min(1, {
      message: "Customer payment discount account is required",
    }),
    roundingAccount: z.string().min(1, {
      message: "Rounding account is required",
    }),
    assetAquisitionCostAccount: z.string().min(1, {
      message: "Aquisition cost account is required",
    }),
    assetAquisitionCostOnDisposalAccount: z.string().min(1, {
      message: "Aquisition cost on disposal account is required",
    }),
    accumulatedDepreciationAccount: z.string().min(1, {
      message: "Accumulated depreciation account is required",
    }),
    accumulatedDepreciationOnDisposalAccount: z.string().min(1, {
      message: "Accumulated depreciation on disposal account is required",
    }),
    inventoryAccount: z.string().min(1, {
      message: "Inventory account is required",
    }),
    inventoryInterimAccrualAccount: z.string().min(1, {
      message: "Inventory interim accrual account is required",
    }),
    inventoryReceivedNotInvoicedAccount: z.string().min(1, {
      message: "Inventory received not invoiced account is required",
    }),
    inventoryShippedNotInvoicedAccount: z.string().min(1, {
      message: "Inventory shipped not invoiced account is required",
    }),
    workInProgressAccount: z.string().min(1, {
      message: "Work in progress account is required",
    }),
    receivablesAccount: z.string().min(1, {
      message: "Receivables account is required",
    }),
    bankCashAccount: z.string().min(1, {
      message: "Bank cash account is required",
    }),
    bankLocalCurrencyAccount: z.string().min(1, {
      message: "Bank local currency account is required",
    }),
    bankForeignCurrencyAccount: z.string().min(1, {
      message: "Bank foreign currency account is required",
    }),
    prepaymentAccount: z.string().min(1, {
      message: "Prepayment account is required",
    }),
    payablesAccount: z.string().min(1, {
      message: "Payables account is required",
    }),
    salesTaxPayableAccount: z.string().min(1, {
      message: "Sales tax payable account is required",
    }),
    purchaseTaxPayableAccount: z.string().min(1, {
      message: "Purchase tax payable account is required",
    }),
    reverseChargeSalesTaxPayableAccount: z.string().min(1, {
      message: "Reverse charge sales tax payable account is required",
    }),
    retainedEarningsAccount: z.string().min(1, {
      message: "Retained earnings account is required",
    }),
  })
);

export const partLedgerValidator = withZod(
  z.object({
    postingDate: z.string().min(1, { message: "Posting date is required" }),
    entryType: z.enum(partLedgerTypes),
    documentType: z.union([z.enum(partLedgerDocumentTypes), z.undefined()]),
    documentNumber: z.string().optional(),
    partId: z.string().min(1, { message: "Part is required" }),
    locationId: z.string().optional(),
    shelfId: z.string().optional(),
    quantity: z.number(),
    invoicedQuantity: z.number(),
    remainingQuantity: z.number(),
    salesAmount: z.number(),
    costAmount: z.number(),
    open: z.boolean(),
  })
);

export const paymentTermValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    name: z.string().min(1, { message: "Name is required" }),
    daysDue: zfd.numeric(
      z
        .number()
        .min(0, { message: "Days due must be greater than or equal to 0" })
    ),
    daysDiscount: zfd.numeric(
      z
        .number()
        .min(0, { message: "Days discount must be greater than or equal to 0" })
    ),
    discountPercentage: zfd.numeric(
      z
        .number()
        .min(0, {
          message: "Discount percent must be greater than or equal to 0",
        })
        .max(100, {
          message: "Discount percent must be less than or equal to 100",
        })
    ),
    calculationMethod: z.enum(["Net", "End of Month", "Day of Month"], {
      errorMap: (issue, ctx) => ({
        message: "Calculation method is required",
      }),
    }),
  })
);

export const valueLedgerValidator = withZod(
  z.object({
    postingDate: z.string(),
    partLedgerType: z.enum(partLedgerTypes),
    costLedgerType: z.enum(costLedgerTypes),
    adjustment: z.boolean(),
    documentType: z.union([z.enum(partLedgerDocumentTypes), z.undefined()]),
    documentNumber: z.string().optional(),
    costAmountActual: z.number(),
    costAmountExpected: z.number(),
    actualCostPostedToGl: z.number(),
    expectedCostPostedToGl: z.number(),
  })
);
