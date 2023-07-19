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

const partLedgerDocumentType = [
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

export const incomeBalanceType = ["Balance Sheet", "Income Statement"] as const;
export const normalBalanceType = ["Debit", "Credit", "Both"] as const;

export const accountValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    number: z.string().min(1, { message: "Number is required" }),
    name: z.string().min(1, { message: "Name is required" }),
    type: z.enum(accountTypes, {
      errorMap: (issue, ctx) => ({
        message: "Type is required",
      }),
    }),
    accountCategoryId: z.string().min(20, { message: "Category is required" }),
    accountSubcategoryId: zfd.text(z.string().optional()),
    incomeBalance: z.enum(incomeBalanceType, {
      errorMap: (issue, ctx) => ({
        message: "Income balance is required",
      }),
    }),
    normalBalance: z.enum(normalBalanceType, {
      errorMap: (issue, ctx) => ({
        message: "Normal balance is required",
      }),
    }),
    consolidatedRate: z.enum(["Average", "Current", "Historical"]),
    currencyCode: zfd.text(z.string().optional()),
  })
);

export const accountCategoryValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    category: z.string().min(1, { message: "Category is required" }),
    incomeBalance: z.enum(incomeBalanceType, {
      errorMap: (issue, ctx) => ({
        message: "Income balance is required",
      }),
    }),
    normalBalance: z.enum(normalBalanceType, {
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

export const partLedgerValidator = withZod(
  z.object({
    postingDate: z.string().min(1, { message: "Posting date is required" }),
    entryType: z.enum(partLedgerTypes),
    documentType: z.union([z.enum(partLedgerDocumentType), z.undefined()]),
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
    documentType: z.union([z.enum(partLedgerDocumentType), z.undefined()]),
    documentNumber: z.string().optional(),
    costAmountActual: z.number(),
    costAmountExpected: z.number(),
    actualCostPostedToGl: z.number(),
    expectedCostPostedToGl: z.number(),
  })
);
