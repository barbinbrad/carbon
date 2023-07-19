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

export type AccountConsolidatedRate =
  Database["public"]["Enums"]["glConsolidatedRate"];

export type AccountSubcategory = NonNullable<
  Awaited<ReturnType<typeof getAccountSubcategories>>["data"]
>[number];

export type AccountIncomeBalance =
  Database["public"]["Enums"]["glIncomeBalance"];

export type AccountNormalBalance =
  Database["public"]["Enums"]["glNormalBalance"];

export type AccountType = Database["public"]["Enums"]["glAccountType"];

export type Chart = Account &
  Transaction & {
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

export type Transaction = {
  number: string;
  netChange: number;
  balanceAtDate: number;
  balance: number;
};
