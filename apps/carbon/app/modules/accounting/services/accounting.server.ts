import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { TypeOfValidator } from "~/types/validators";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";
import { sanitize } from "~/utils/supabase";
import type {
  accountEntryValidator,
  accountSubcategoryValidator,
  accountValidator,
  currencyValidator,
  partEntryValidator,
  paymentTermValidator,
  valueEntryValidator,
} from "./accounting.form";

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

export async function getAccountCategories(client: SupabaseClient<Database>) {
  return client.from("accountCategory").select("*");
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
    .eq("accountCategoryId", accountCategoryId);
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

export function getAccountTypeEnum(): Database["public"]["Enums"]["glAccountType"][] {
  return ["Posting", "Heading", "Total", "Begin Total", "End Total"];
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
    search: string | null;
  }
) {
  let query = client
    .from("currency")
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

export function getConsolidatedRateEnum(): Database["public"]["Enums"]["glConsolidatedRate"][] {
  return ["Average", "Current", "Historical"];
}

export function getIncomeBalanceEnum(): Database["public"]["Enums"]["glIncomeBalance"][] {
  return ["Balance Sheet", "Income Statement"];
}

export function getNormalBalanceEnum(): Database["public"]["Enums"]["glNormalBalance"][] {
  return ["Debit", "Credit", "Both"];
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
  accountEntries: TypeOfValidator<typeof accountEntryValidator>[]
) {
  return client.from("accountEntry").insert(accountEntries).select("id");
}

export async function insertAccountEntry(
  client: SupabaseClient<Database>,
  accountEntry: TypeOfValidator<typeof accountEntryValidator>
) {
  return client.from("accountEntry").insert([accountEntry]).select("id");
}

export async function insertPartEntries(
  client: SupabaseClient<Database>,
  partEntries: TypeOfValidator<typeof partEntryValidator>[]
) {
  return client.from("partEntry").insert(partEntries).select("id");
}

export async function insertPartEntry(
  client: SupabaseClient<Database>,
  partEntry: TypeOfValidator<typeof partEntryValidator>
) {
  return client.from("partEntry").insert([partEntry]).select("id");
}

export async function insertValueEntries(
  client: SupabaseClient<Database>,
  valueEntries: TypeOfValidator<typeof valueEntryValidator>[]
) {
  return client.from("valueEntry").insert(valueEntries).select("id");
}

export async function insertValueEntry(
  client: SupabaseClient<Database>,
  valueEntry: TypeOfValidator<typeof valueEntryValidator>
) {
  return client.from("valueEntry").insert([valueEntry]).select("id");
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
