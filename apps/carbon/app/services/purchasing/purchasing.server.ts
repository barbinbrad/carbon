import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";

export async function deleteSupplierType(
  client: SupabaseClient<Database>,
  supplierTypeId: string
) {
  return client.from("supplierType").delete().eq("id", supplierTypeId);
}

export async function getSupplierType(
  client: SupabaseClient<Database>,
  supplierTypeId: string
) {
  return client
    .from("supplierType")
    .select("id, name, color, protected")
    .eq("id", supplierTypeId)
    .single();
}

export async function getSuppliers(
  client: SupabaseClient<Database>,
  args: GenericQueryFilters & {
    name: string | null;
    type: string | null;
    active: boolean | null;
  }
) {
  let query = client
    .from("supplier")
    .select("*, supplierType!inner(name), supplierStatus!inner(name)", {
      count: "exact",
    });

  if (args.name) {
    query = query.ilike("name", `%${args.name}%`);
  }

  if (args.type) {
    query = query.eq("supplierTypeId", args.type);
  }

  query = setGenericQueryFilters(query, args, "user(lastName)");
  return query;
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
  supplierType: { id?: string; name: string; color: string | null }
) {
  return client.from("supplierType").upsert([supplierType]).select("id");
}
