import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { TypeOfValidator } from "~/types/validators";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";
import { sanitize } from "~/utils/supabase";
import type { shippingMethodValidator } from "./inventory.form";

export async function deleteShippingMethod(
  client: SupabaseClient<Database>,
  shippingMethodId: string
) {
  return client
    .from("shippingMethod")
    .update({ active: false })
    .eq("id", shippingMethodId);
}

export async function getShippingMethod(
  client: SupabaseClient<Database>,
  shippingMethodId: string
) {
  return client
    .from("shippingMethod")
    .select("*")
    .eq("id", shippingMethodId)
    .single();
}

export async function getShippingMethods(
  client: SupabaseClient<Database>,
  args: GenericQueryFilters & {
    name: string | null;
  }
) {
  let query = client
    .from("shippingMethod")
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

export async function getShippingMethodsList(client: SupabaseClient<Database>) {
  return client
    .from("shippingMethod")
    .select("id, name")
    .eq("active", true)
    .order("name", { ascending: true });
}

export async function getShippingTermsList(client: SupabaseClient<Database>) {
  return client
    .from("shippingTerm")
    .select("id, name")
    .eq("active", true)
    .order("name", { ascending: true });
}

export async function upsertShippingMethod(
  client: SupabaseClient<Database>,
  shippingMethod:
    | (Omit<TypeOfValidator<typeof shippingMethodValidator>, "id"> & {
        createdBy: string;
      })
    | (Omit<TypeOfValidator<typeof shippingMethodValidator>, "id"> & {
        id: string;
        updatedBy: string;
      })
) {
  if ("createdBy" in shippingMethod) {
    return client.from("shippingMethod").insert([shippingMethod]).select("id");
  }
  return client
    .from("shippingMethod")
    .update(sanitize(shippingMethod))
    .eq("id", shippingMethod.id)
    .select("id");
}
