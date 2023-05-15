import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { TypeOfValidator } from "~/types/validators";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";
import type { paymentTermValidator } from "./accounting.form";

export async function deletePaymentTerm(
  client: SupabaseClient<Database>,
  paymentTermId: string
) {
  return client
    .from("paymentTerm")
    .update({ active: false })
    .eq("id", paymentTermId);
}

export async function getAccountsList(client: SupabaseClient<Database>) {
  return client
    .from("account")
    .select("number, name")
    .eq("active", true)
    .order("name", { ascending: true });
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
    .update(paymentTerm)
    .eq("id", paymentTerm.id)
    .select("id");
}
