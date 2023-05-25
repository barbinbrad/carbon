import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { TypeOfValidator } from "~/types/validators";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";
import type { sequenceValidator } from "./settings.form";

export async function getSequence(
  client: SupabaseClient<Database>,
  table: string
) {
  return client.from("sequences").select("*").eq("table", table).single();
}

export async function getSequences(
  client: SupabaseClient<Database>,
  args: GenericQueryFilters & {
    search: string | null;
  }
) {
  let query = client.from("sequences").select("*");

  if (args.search) {
    query = query.ilike("name", `%${args.search}%`);
  }

  query = setGenericQueryFilters(query, args);
  return query;
}

export async function updateSequence(
  client: SupabaseClient<Database>,
  sequence: TypeOfValidator<typeof sequenceValidator> & {
    updatedBy: string;
  }
) {
  return client.from("sequences").update(sequence).eq("table", sequence.table);
}
