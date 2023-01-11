import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";

export async function deleteCustomerType(
  client: SupabaseClient<Database>,
  customerTypeId: number
) {
  return client.from("customerType").delete().eq("id", customerTypeId);
}

export async function getCustomerType(
  client: SupabaseClient<Database>,
  customerTypeId: number
) {
  return client
    .from("customerType")
    .select("id, name, color, protected")
    .eq("id", customerTypeId)
    .single();
}

export async function getCustomerTypes(
  client: SupabaseClient<Database>,
  args?: GenericQueryFilters & { name: string | null }
) {
  let query = client
    .from("customerType")
    .select("id, name, color, protected", { count: "exact" });

  if (args?.name) {
    query = query.ilike("name", `%${args.name}%`);
  }

  if (args) {
    query = setGenericQueryFilters(query, args, "name");
  }

  return query;
}

export async function upsertCustomerType(
  client: SupabaseClient<Database>,
  customerType: { id?: number; name: string; color: string | null }
) {
  return client.from("customerType").upsert([customerType]).select("id");
}
