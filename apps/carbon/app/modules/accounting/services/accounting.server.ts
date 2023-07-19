import type { Database } from "@carbon/database";
import { getDateNYearsAgo } from "@carbon/utils";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { TypeOfValidator } from "~/types/validators";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";
import { sanitize } from "~/utils/supabase";
import type { Account, Transaction } from "../types";
import type {
  accountCategoryValidator,
  accountLedgerValidator,
  accountSubcategoryValidator,
  accountValidator,
  currencyValidator,
  partLedgerValidator,
  paymentTermValidator,
  valueLedgerValidator,
} from "./accounting.form";
import { incomeBalanceType, normalBalanceType } from "./accounting.form";

type AccountWithTotals = Account & { level: number; totaling: string };

function addLevelsAndTotalsToAccounts(
  accounts: Account[]
): AccountWithTotals[] {
  let result: AccountWithTotals[] = [];
  let beginTotalAccounts: string[] = [];
  let endTotalAccounts: string[] = [];

  accounts.forEach((account) => {
    if (account.type === "End Total") {
      endTotalAccounts.push(account.number);
    }

    let level = beginTotalAccounts.length - endTotalAccounts.length;

    if (account.type === "Begin Total") {
      beginTotalAccounts.push(account.number);
    }

    if (account.type === "Heading") {
      level = 0;
    }

    let totaling = "";

    if (account.type === "End Total") {
      let startAccount = beginTotalAccounts.pop();
      let endAccount = endTotalAccounts.pop();

      totaling = `${startAccount}..${endAccount}`;
    }

    result.push({
      ...account,
      level,
      totaling,
    });
  });

  return result;
}

export async function deleteAccountCategory(
  client: SupabaseClient<Database>,
  accountSubcategoryId: string
) {
  return client.from("accountCategory").delete().eq("id", accountSubcategoryId);
}

export async function deleteAccountSubcategory(
  client: SupabaseClient<Database>,
  accountSubcategoryId: string
) {
  return client
    .from("accountSubcategory")
    .update({ active: false })
    .eq("id", accountSubcategoryId);
}

export async function deleteCurrency(
  client: SupabaseClient<Database>,
  currencyId: string
) {
  return client.from("currency").update({ active: false }).eq("id", currencyId);
}

export async function deletePaymentTerm(
  client: SupabaseClient<Database>,
  paymentTermId: string
) {
  return client
    .from("paymentTerm")
    .update({ active: false })
    .eq("id", paymentTermId);
}

export async function getAccount(
  client: SupabaseClient<Database>,
  number: string
) {
  return client.from("account").select("*").eq("number", number).single();
}

export async function getAccounts(
  client: SupabaseClient<Database>,
  args: GenericQueryFilters & {
    search: string | null;
  }
) {
  let query = client
    .from("account")
    .select("*", {
      count: "exact",
    })
    .eq("active", true);

  if (args.search) {
    query = query.ilike("name", `%${args.search}%`);
  }

  query = setGenericQueryFilters(query, args, "name");
  return query;
}

export async function getAccountsList(client: SupabaseClient<Database>) {
  return client
    .from("account")
    .select("number, name")
    .eq("active", true)
    .order("name", { ascending: true });
}

export async function getAccountCategories(
  client: SupabaseClient<Database>,
  args: GenericQueryFilters & {
    name: string | null;
    normalBalance: string | null;
    incomeBalance: string | null;
  }
) {
  let query = client.from("account_categories_view").select("*", {
    count: "exact",
  });

  if (args.name) {
    query = query.ilike("category", `%${args.name}%`);
  }

  if (args.normalBalance) {
    query = query.eq("normalBalance", args.normalBalance);
  }

  if (args.incomeBalance) {
    query = query.eq("incomeBalance", args.incomeBalance);
  }

  query = setGenericQueryFilters(query, args, "category");
  return query;
}

export async function getAccountCategoriesList(
  client: SupabaseClient<Database>
) {
  return client
    .from("accountCategory")
    .select("*")
    .order("category", { ascending: true });
}

export async function getAccountCategory(
  client: SupabaseClient<Database>,
  accountCategoryId: string
) {
  return client
    .from("accountCategory")
    .select("*")
    .eq("id", accountCategoryId)
    .single();
}

export function getAccountCategoryEnum(): Database["public"]["Enums"]["glAccountCategory"][] {
  return [
    "Bank",
    "Accounts Receivable",
    "Inventory",
    "Other Current Asset",
    "Fixed Asset",
    "Accumulated Depreciation",
    "Other Asset",
    "Accounts Payable",
    "Other Current Liability",
    "Long Term Liability",
    "Equity - No Close",
    "Equity - Close",
    "Retained Earnings",
    "Income",
    "Cost of Goods Sold",
    "Expense",
    "Other Income",
    "Other Expense",
  ];
}

export async function getAccountSubcategories(
  client: SupabaseClient<Database>,
  args: GenericQueryFilters & {
    name: string | null;
  }
) {
  let query = client
    .from("accountSubcategory")
    .select("*", {
      count: "exact",
    })
    .eq("active", true);

  if (args.name) {
    query = query.ilike("name", `%${args.name}%`);
  }

  query = setGenericQueryFilters(query, args, "name");
  return query;
}

export async function getAccountSubcategoriesByCategory(
  client: SupabaseClient<Database>,
  accountCategoryId: string
) {
  return client
    .from("accountSubcategory")
    .select("*")
    .eq("accountCategoryId", accountCategoryId)
    .eq("active", true);
}

export async function getAccountSubcategory(
  client: SupabaseClient<Database>,
  accountSubcategoryId: string
) {
  return client
    .from("accountSubcategory")
    .select("*")
    .eq("id", accountSubcategoryId)
    .single();
}

function getAccountTotal(
  accounts: Account[],
  account: AccountWithTotals,
  type: "netChange" | "balance" | "balanceAtDate",
  transactionsByAccount: Record<string, Transaction>
) {
  if (!account.totaling)
    return transactionsByAccount[account.number][type] ?? 0;

  let total = 0;
  const [start, end] = account.totaling.split("..");
  if (!start || !end) throw new Error("Invalid totaling");

  accounts.forEach((account) => {
    if (account.number >= start && account.number <= end) {
      total += transactionsByAccount[account.number][type] ?? 0;
    }
  });

  return total;
}

export function getAccountTypeEnum(): Database["public"]["Enums"]["glAccountType"][] {
  return ["Posting", "Heading", "Total", "Begin Total", "End Total"];
}

export async function getBaseCurrency(client: SupabaseClient<Database>) {
  return client
    .from("currency")
    .select("*")
    .eq("isBaseCurrency", true)
    .single();
}

export async function getChartOfAccounts(
  client: SupabaseClient<Database>,
  args: Omit<GenericQueryFilters, "limit" | "offset"> & {
    name: string | null;
    incomeBalance: string | null;
    startDate: string | null;
    endDate: string | null;
  }
) {
  let accountsQuery = client.from("account").select("*").eq("active", true);

  if (args.incomeBalance) {
    accountsQuery = accountsQuery.eq("incomeBalance", args.incomeBalance);
  }

  accountsQuery = setGenericQueryFilters(accountsQuery, args, "number");

  let transactionsQuery = client.rpc("gl_transactions_by_account_number", {
    from_date:
      args.startDate ?? getDateNYearsAgo(50).toISOString().split("T")[0],
    to_date: args.endDate ?? new Date().toISOString().split("T")[0],
  });

  const [accountsResponse, transactionsResponse] = await Promise.all([
    accountsQuery,
    transactionsQuery,
  ]);

  if (transactionsResponse.error) return transactionsResponse;
  if (accountsResponse.error) return accountsResponse;

  const transactionsByAccount = (
    transactionsResponse.data as unknown as Transaction[]
  ).reduce<Record<string, Transaction>>((acc, transaction: Transaction) => {
    acc[transaction.number] = transaction;
    return acc;
  }, {});

  const accounts: Account[] = accountsResponse.data;

  return {
    data: addLevelsAndTotalsToAccounts(accounts).map((account) => ({
      ...account,
      netChange: getAccountTotal(
        accounts,
        account,
        "netChange",
        transactionsByAccount
      ),

      balance: getAccountTotal(
        accounts,
        account,
        "balance",
        transactionsByAccount
      ),

      balanceAtDate: getAccountTotal(
        accounts,
        account,
        "balanceAtDate",
        transactionsByAccount
      ),
      accountCategory: "",
      accountSubcategory: "",
    })),
    error: null,
  };
}

export async function getCurrency(
  client: SupabaseClient<Database>,
  currencyId: string
) {
  return client.from("currency").select("*").eq("id", currencyId).single();
}

export async function getCurrencies(
  client: SupabaseClient<Database>,
  args: GenericQueryFilters & {
    name: string | null;
  }
) {
  let query = client
    .from("currency")
    .select("*", {
      count: "exact",
    })
    .eq("active", true);

  if (args.name) {
    query = query.ilike("name", `%${args.name}%`);
  }

  query = setGenericQueryFilters(query, args, "name");
  return query;
}

export function getConsolidatedRateEnum(): Database["public"]["Enums"]["glConsolidatedRate"][] {
  return ["Average", "Current", "Historical"];
}

export function getIncomeBalanceEnum(): readonly Database["public"]["Enums"]["glIncomeBalance"][] {
  return incomeBalanceType;
}

export function getNormalBalanceEnum(): readonly Database["public"]["Enums"]["glNormalBalance"][] {
  return normalBalanceType;
}

export async function getCurrenciesList(client: SupabaseClient<Database>) {
  return client
    .from("currency")
    .select("code, name")
    .order("name", { ascending: true });
}

export async function getPaymentTerm(
  client: SupabaseClient<Database>,
  paymentTermId: string
) {
  return client
    .from("paymentTerm")
    .select("*")
    .eq("id", paymentTermId)
    .single();
}

export async function getPaymentTerms(
  client: SupabaseClient<Database>,
  args: GenericQueryFilters & {
    name: string | null;
  }
) {
  let query = client
    .from("paymentTerm")
    .select("*", {
      count: "exact",
    })
    .eq("active", true);

  if (args.name) {
    query = query.ilike("name", `%${args.name}%`);
  }

  query = setGenericQueryFilters(query, args, "name");
  return query;
}

export async function getPaymentTermsList(client: SupabaseClient<Database>) {
  return client
    .from("paymentTerm")
    .select("id, name")
    .eq("active", true)
    .order("name", { ascending: true });
}

export async function insertAccountEntries(
  client: SupabaseClient<Database>,
  accountEntries: TypeOfValidator<typeof accountLedgerValidator>[]
) {
  return client.from("accountLedger").insert(accountEntries).select("id");
}

export async function insertAccountLedger(
  client: SupabaseClient<Database>,
  accountEntry: TypeOfValidator<typeof accountLedgerValidator>
) {
  return client.from("accountLedger").insert([accountEntry]).select("id");
}

export async function insertPartEntries(
  client: SupabaseClient<Database>,
  partEntries: TypeOfValidator<typeof partLedgerValidator>[]
) {
  return client.from("partLedger").insert(partEntries).select("id");
}

export async function insertPartLedger(
  client: SupabaseClient<Database>,
  partEntry: TypeOfValidator<typeof partLedgerValidator>
) {
  return client.from("partLedger").insert([partEntry]).select("id");
}

export async function insertValueEntries(
  client: SupabaseClient<Database>,
  valueEntries: TypeOfValidator<typeof valueLedgerValidator>[]
) {
  return client.from("valueLedger").insert(valueEntries).select("id");
}

export async function insertValueLedger(
  client: SupabaseClient<Database>,
  valueEntry: TypeOfValidator<typeof valueLedgerValidator>
) {
  return client.from("valueLedger").insert([valueEntry]).select("id");
}

export async function upsertAccount(
  client: SupabaseClient<Database>,
  account:
    | (Omit<TypeOfValidator<typeof accountValidator>, "id"> & {
        createdBy: string;
      })
    | (Omit<TypeOfValidator<typeof accountValidator>, "id"> & {
        id: string;
        updatedBy: string;
      })
) {
  if ("createdBy" in account) {
    return client.from("account").insert([account]).select("id");
  }
  return client
    .from("account")
    .update(sanitize(account))
    .eq("id", account.id)
    .select("id");
}

export async function upsertAccountCategory(
  client: SupabaseClient<Database>,
  accountCategory:
    | (Omit<TypeOfValidator<typeof accountCategoryValidator>, "id"> & {
        createdBy: string;
      })
    | (Omit<TypeOfValidator<typeof accountCategoryValidator>, "id"> & {
        id: string;
        updatedBy: string;
      })
) {
  if ("createdBy" in accountCategory) {
    return client
      .from("accountCategory")
      .insert([accountCategory])
      .select("id");
  }
  return client
    .from("accountCategory")
    .update(sanitize(accountCategory))
    .eq("id", accountCategory.id)
    .select("id");
}

export async function upsertAccountSubcategory(
  client: SupabaseClient<Database>,
  accountSubcategory:
    | (Omit<TypeOfValidator<typeof accountSubcategoryValidator>, "id"> & {
        createdBy: string;
      })
    | (Omit<TypeOfValidator<typeof accountSubcategoryValidator>, "id"> & {
        id: string;
        updatedBy: string;
      })
) {
  if ("createdBy" in accountSubcategory) {
    return client
      .from("accountSubcategory")
      .insert([accountSubcategory])
      .select("id");
  }
  return client
    .from("accountSubcategory")
    .update(sanitize(accountSubcategory))
    .eq("id", accountSubcategory.id)
    .select("id");
}

export async function upsertCurrency(
  client: SupabaseClient<Database>,
  currency:
    | (Omit<TypeOfValidator<typeof currencyValidator>, "id"> & {
        createdBy: string;
      })
    | (Omit<TypeOfValidator<typeof currencyValidator>, "id"> & {
        id: string;
        updatedBy: string;
      })
) {
  if (currency.isBaseCurrency) {
    await client.from("currency").update({ isBaseCurrency: false });
  }

  if ("createdBy" in currency) {
    return client.from("currency").insert([currency]).select("id");
  }
  return client
    .from("currency")
    .update(sanitize(currency))
    .eq("id", currency.id)
    .select("id");
}

export async function upsertPaymentTerm(
  client: SupabaseClient<Database>,
  paymentTerm:
    | (Omit<TypeOfValidator<typeof paymentTermValidator>, "id"> & {
        createdBy: string;
      })
    | (Omit<TypeOfValidator<typeof paymentTermValidator>, "id"> & {
        id: string;
        updatedBy: string;
      })
) {
  if ("createdBy" in paymentTerm) {
    return client.from("paymentTerm").insert([paymentTerm]).select("id");
  }
  return client
    .from("paymentTerm")
    .update(sanitize(paymentTerm))
    .eq("id", paymentTerm.id)
    .select("id");
}
