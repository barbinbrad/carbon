import type { Database } from "@carbon/database";
import type {
  getAccount,
  getAccountCategories,
  getAccountSubcategories,
  getCurrencies,
  getPaymentTerms,
} from "./services";

export type Account = NonNullable<
  Awaited<ReturnType<typeof getAccount>>["data"]
>;

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

export type Chart = {
  number: string;
  name: string;
  netChange?: number;
  balanceAtDate?: number;
  balance?: number;
  accountCategory: string;
  accountCategoryId: string | null;
  accountSubcategory: string;
  accountSubcategoryId: string | null;
  type: string;
  incomeBalance: AccountIncomeBalance;
  normalBalance: AccountNormalBalance;
  level: number;
  totaling: string;
};

export type Currency = NonNullable<
  Awaited<ReturnType<typeof getCurrencies>>["data"]
>[number];

export type PaymentTermCalculationMethod =
  Database["public"]["Enums"]["paymentTermCalculationMethod"];

export type PaymentTerm = NonNullable<
  Awaited<ReturnType<typeof getPaymentTerms>>["data"]
>[number];
