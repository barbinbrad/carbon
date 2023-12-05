import type { Database } from "@carbon/database";
import type {
  getAccount,
  getAccountCategories,
  getAccountsList,
  getAccountSubcategories,
  getCurrencies,
  getInventoryPostingGroups,
  getPaymentTerms,
  getPurchasingPostingGroups,
  getSalesPostingGroups,
} from "./accounting.service";

export type Account = NonNullable<
  Awaited<ReturnType<typeof getAccount>>["data"]
>;

export type AccountCategory = NonNullable<
  Awaited<ReturnType<typeof getAccountCategories>>["data"]
>[number];

export type AccountConsolidatedRate =
  Database["public"]["Enums"]["glConsolidatedRate"];

export type AccountListItem = NonNullable<
  NonNullable<Awaited<ReturnType<typeof getAccountsList>>>["data"]
>[number];

export type AccountSubcategory = NonNullable<
  Awaited<ReturnType<typeof getAccountSubcategories>>["data"]
>[number];

export type AccountIncomeBalance =
  Database["public"]["Enums"]["glIncomeBalance"];

export type AccountClass = Database["public"]["Enums"]["glAccountClass"];

export type AccountType = Database["public"]["Enums"]["glAccountType"];

export type Chart = Account &
  Transaction & {
    level: number;
    totaling: string;
  };

export type Currency = NonNullable<
  Awaited<ReturnType<typeof getCurrencies>>["data"]
>[number];

export type InventoryPostingGroup = NonNullable<
  Awaited<ReturnType<typeof getInventoryPostingGroups>>["data"]
>[number];

export type PaymentTermCalculationMethod =
  Database["public"]["Enums"]["paymentTermCalculationMethod"];

export type PaymentTerm = NonNullable<
  Awaited<ReturnType<typeof getPaymentTerms>>["data"]
>[number];

export type PurchasingPostingGroup = NonNullable<
  Awaited<ReturnType<typeof getPurchasingPostingGroups>>["data"]
>[number];

export type Transaction = {
  number: string;
  netChange: number;
  balanceAtDate: number;
  balance: number;
};

export type SalesPostingGroup = NonNullable<
  Awaited<ReturnType<typeof getSalesPostingGroups>>["data"]
>[number];
