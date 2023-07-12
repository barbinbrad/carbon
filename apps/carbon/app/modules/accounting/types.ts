import type { Database } from "@carbon/database";
import type {
  getAccountCategories,
  getAccountSubcategories,
  getCurrencies,
  getPaymentTerms,
} from "./services";

export type AccountCategory = NonNullable<
  Awaited<ReturnType<typeof getAccountCategories>>["data"]
>[number];

export type AccountSubcategory = NonNullable<
  Awaited<ReturnType<typeof getAccountSubcategories>>["data"]
>[number];

export type AccountIncomeBalance =
  Database["public"]["Enums"]["glIncomeBalance"];

export type AccountNormalBalance =
  Database["public"]["Enums"]["glNormalBalance"];

export type Currency = NonNullable<
  Awaited<ReturnType<typeof getCurrencies>>["data"]
>[number];

export type PaymentTermCalculationMethod =
  Database["public"]["Enums"]["paymentTermCalculationMethod"];

export type PaymentTerm = NonNullable<
  Awaited<ReturnType<typeof getPaymentTerms>>["data"]
>[number];
