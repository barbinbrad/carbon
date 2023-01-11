import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";

export async function deleteSupplierType(
  client: SupabaseClient<Database>,
  supplierTypeId: number
) {
  return client.from("supplierType").delete().eq("id", supplierTypeId);
}

export async function getSupplierType(
  client: SupabaseClient<Database>,
  supplierTypeId: number
) {
  return client
    .from("supplierType")
    .select("id, name, color, protected")
    .eq("id", supplierTypeId)
    .single();
}

export async function getSupplierTypes(
  client: SupabaseClient<Database>,
  args?: GenericQueryFilters & { name: string | null }
) {
  let query = client
    .from("supplierType")
    .select("id, name, color, protected", { count: "exact" });

  if (args?.name) {
    query = query.ilike("name", `%${args.name}%`);
  }

  if (args) {
    query = setGenericQueryFilters(query, args, "name");
  }

  return query;
}

export async function upsertSupplierType(
  client: SupabaseClient<Database>,
  supplierType: { id?: number; name: string; color: string | null }
) {
  return client.from("supplierType").upsert([supplierType]).select("id");
}
