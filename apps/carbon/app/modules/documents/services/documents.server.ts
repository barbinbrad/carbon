import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { TypeOfValidator } from "~/types/validators";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";
import type { documentValidator } from "./documents.form";

export async function deleteDocument(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("document").update({ active: false }).eq("id", id);
}

export async function getDocuments(
  client: SupabaseClient<Database>,
  args: GenericQueryFilters & { search: string | null }
) {
  let query = client
    .from("document")
    .select(
      "id, name, description, size, url, createdBy, updatedBy, createdAt, updatedAt"
    )
    .eq("active", true);

  if (args?.search) {
    query = query.ilike("name", args.search);
  }

  query = setGenericQueryFilters(query, args);
  return query;
}

export async function upsertDocument(
  client: SupabaseClient<Database>,
  document:
    | (Omit<TypeOfValidator<typeof documentValidator>, "id"> & {
        createdBy: string;
      })
    | (TypeOfValidator<typeof documentValidator> & {
        updatedBy: string;
      })
) {
  if ("createdBy" in document) {
    return client.from("document").insert(document).select("id");
  }
  return client.from("document").update(document).eq("id", document.id);
}
