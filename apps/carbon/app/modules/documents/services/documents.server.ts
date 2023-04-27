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

export async function deleteDocumentFavorite(
  client: SupabaseClient<Database>,
  id: string,
  userId: string
) {
  return client
    .from("documentFavorite")
    .delete()
    .eq("documentId", id)
    .eq("userId", userId);
}

export async function deleteDocumentLabel(
  client: SupabaseClient<Database>,
  id: string,
  label: string
) {
  return client
    .from("documentLabel")
    .delete()
    .eq("documentId", id)
    .eq("label", label);
}

export async function getDocuments(
  client: SupabaseClient<Database>,
  args: GenericQueryFilters & {
    search: string | null;
    type: string | null;
    label: string | string[] | null;
  }
) {
  let query = client
    .from("document")
    .select(
      "id, name, description, size, createdBy!inner(fullName, avatarUrl), createdAt, updatedAt"
    )
    .eq("active", true);

  if (args?.search) {
    query = query.or(
      `name.ilike.%${args.search}%,description.ilike.%${args.search}%`
    );
  }

  if (args?.type && args.type !== "all") {
    if (args.type === "image") {
      query = query.or("type.eq.png,type.eq.jpg,type.eq.jpeg,type.eq.gif");
    }

    if (args.type === "document") {
      query = query.or(
        "type.eq.pdf,type.eq.doc,type.eq.docx,type.eq.txt,type.eq.rtf,type.eq.ppt,type.eq.pptx"
      );
    }

    if (args.type === "spreadsheet") {
      query = query.or("type.eq.xls,type.eq.xlsx");
    }

    if (args.type === "video") {
      query = query.or(
        "type.eq.mp4,type.eq.mov,type.eq.avi,type.eq.wmv,type.eq.flv,type.eq.mkv"
      );
    }

    if (args.label) {
      console.log(args.label);
    }
  }

  query = setGenericQueryFilters(query, args);
  return query;
}

export async function insertDocumentFavorite(
  client: SupabaseClient<Database>,
  id: string,
  userId: string
) {
  return client.from("documentFavorite").insert({ documentId: id, userId });
}

export async function insertDocumentLabel(
  client: SupabaseClient<Database>,
  id: string,
  label: string,
  userId: string
) {
  return client.from("documentLabel").insert({ documentId: id, label, userId });
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
