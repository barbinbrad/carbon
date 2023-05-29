import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { TypeOfValidator } from "~/types/validators";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";
import { interpolateDate } from "~/utils/string";
import type { sequenceValidator } from "./settings.form";

export async function getNextSequence(
  client: SupabaseClient<Database>,
  table: string,
  userId: string
) {
  // TODO: add transaction through stored procedure: https://www.postgresql.org/docs/current/plpgsql-transactions.html
  const sequence = await getSequence(client, table);
  if (sequence.error) {
    return sequence;
  }

  const { prefix, suffix, next, size, step } = sequence.data;

  const nextValue = next + step;
  const nextSequence = nextValue.toString().padStart(size, "0");
  const derivedPrefix = interpolateDate(prefix);
  const derivedSuffix = interpolateDate(suffix);

  const update = await updateSequence(client, table, {
    next: nextValue,
    updatedBy: userId,
  });

  if (update.error) {
    return update;
  }

  return {
    data: `${derivedPrefix}${nextSequence}${derivedSuffix}`,
    error: null,
  };
}

export async function getSequence(
  client: SupabaseClient<Database>,
  table: string
) {
  return client.from("sequence").select("*").eq("table", table).single();
}

export async function getSequences(
  client: SupabaseClient<Database>,
  args: GenericQueryFilters & {
    name: string | null;
  }
) {
  let query = client.from("sequence").select("*");

  if (args.name) {
    query = query.ilike("name", `%${args.name}%`);
  }

  query = setGenericQueryFilters(query, args);
  return query;
}

export async function updateSequence(
  client: SupabaseClient<Database>,
  table: string,
  sequence: Partial<TypeOfValidator<typeof sequenceValidator>> & {
    updatedBy: string;
  }
) {
  return client.from("sequence").update(sequence).eq("table", table);
}
