import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { TypeOfValidator } from "~/types/validators";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";
import { sanitize } from "~/utils/supabase";
import type {
  receiptValidator,
  shippingMethodValidator,
} from "./inventory.form";

export async function deleteReceipt(
  client: SupabaseClient<Database>,
  receiptId: string
) {
  return client.from("receipt").delete().eq("id", receiptId);
}

export async function deleteShippingMethod(
  client: SupabaseClient<Database>,
  shippingMethodId: string
) {
  return client
    .from("shippingMethod")
    .update({ active: false })
    .eq("id", shippingMethodId);
}

export async function getReceipts(
  client: SupabaseClient<Database>,
  args: GenericQueryFilters & {
    search: string | null;
    document: string | null;
    location: string | null;
  }
) {
  let query = client
    .from("receipt")
    .select("*, location(name), supplier(name)", {
      count: "exact",
    });

  if (args.search) {
    query = query.or(
      `receiptId.ilike.%${args.search}%,sourceDocumentReadableId.ilike.%${args.search}%`
    );
  }

  if (args.document) {
    query = query.eq("sourceDocument", args.document);
  }

  if (args.location) {
    query = query.eq("locationId", args.location);
  }

  query = setGenericQueryFilters(query, args, "receiptId", false);
  return query;
}

export async function getReceipt(
  client: SupabaseClient<Database>,
  receiptId: string
) {
  return client.from("receipt").select("*").eq("id", receiptId).single();
}

export async function getReceiptLines(
  client: SupabaseClient<Database>,
  receiptId: string
) {
  return client.from("receiptLine").select("*").eq("receiptId", receiptId);
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

export async function upsertReceipt(
  client: SupabaseClient<Database>,
  receipt:
    | (Omit<TypeOfValidator<typeof receiptValidator>, "id" | "receiptId"> & {
        receiptId: string;
        createdBy: string;
      })
    | (Omit<TypeOfValidator<typeof receiptValidator>, "id" | "receiptId"> & {
        id: string;
        receiptId: string;
        updatedBy: string;
      })
) {
  if ("createdBy" in receipt) {
    return client.from("receipt").insert([receipt]).select("id").single();
  }
  return client
    .from("receipt")
    .update(sanitize(receipt))
    .eq("id", receipt.id)
    .select("id")
    .single();
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
    return client
      .from("shippingMethod")
      .insert([shippingMethod])
      .select("id")
      .single();
  }
  return client
    .from("shippingMethod")
    .update(sanitize(shippingMethod))
    .eq("id", shippingMethod.id)
    .select("id")
    .single();
}
