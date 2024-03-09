import type { Database, Json } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { z } from "zod";
import { SUPABASE_API_URL } from "~/config/env";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";
import { interpolateSequenceDate } from "~/utils/string";
import { sanitize } from "~/utils/supabase";
import type {
  companyValidator,
  sequenceValidator,
  themeValidator,
} from "./settings.models";

export async function getCompany(client: SupabaseClient<Database>) {
  const company = await client.from("company").select("*").single();
  if (company.error) {
    return company;
  }

  return {
    data: {
      ...company.data,
      logo: company.data.logo
        ? `${SUPABASE_API_URL}/storage/v1/object/public/public/${company.data.logo}`
        : null,
    },
    error: null,
  };
}

export async function getCurrentSequence(
  client: SupabaseClient<Database>,
  table: string
) {
  const sequence = await getSequence(client, table);
  if (sequence.error) {
    return sequence;
  }

  const { prefix, suffix, next, size } = sequence.data;

  const currentSequence = next.toString().padStart(size, "0");
  const derivedPrefix = interpolateSequenceDate(prefix);
  const derivedSuffix = interpolateSequenceDate(suffix);

  return {
    data: `${derivedPrefix}${currentSequence}${derivedSuffix}`,
    error: null,
  };
}

export async function getIntegration(
  client: SupabaseClient<Database>,
  id: string
) {
  return client
    .from("integration")
    .select("*")
    .eq("id", id)
    .eq("visible", true)
    .single();
}

export async function getIntegrations(client: SupabaseClient<Database>) {
  return client
    .from("integration")
    .select("*")
    .eq("visible", true)
    .order("title");
}

export async function getNextSequence(
  client: SupabaseClient<Database>,
  table: string,
  userId: string
) {
  const sequence = await getSequence(client, table);
  if (sequence.error) {
    return sequence;
  }

  const { prefix, suffix, next, size, step } = sequence.data;

  const nextValue = next + step;
  const nextSequence = nextValue.toString().padStart(size, "0");
  const derivedPrefix = interpolateSequenceDate(prefix);
  const derivedSuffix = interpolateSequenceDate(suffix);

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

  query = setGenericQueryFilters(query, args, [
    { column: "table", ascending: true },
  ]);
  return query;
}

export async function getSequencesList(
  client: SupabaseClient<Database>,
  table: string
) {
  return client.from("sequence").select("id").eq("table", table).order("table");
}

export async function getTheme(client: SupabaseClient<Database>) {
  return client.from("theme").select("*").single();
}

export async function insertCompany(
  client: SupabaseClient<Database>,
  company: z.infer<typeof companyValidator>
) {
  return client.from("company").insert(company);
}

export async function rollbackNextSequence(
  client: SupabaseClient<Database>,
  table: string,
  userId: string
) {
  const sequence = await getSequence(client, table);
  if (sequence.error) {
    return sequence;
  }

  const { next } = sequence.data;

  const nextValue = next - 1;

  return await updateSequence(client, table, {
    next: nextValue,
    updatedBy: userId,
  });
}

export async function updateCompany(
  client: SupabaseClient<Database>,
  company: Partial<z.infer<typeof companyValidator>> & {
    updatedBy: string;
  }
) {
  return client.from("company").update(sanitize(company)).eq("id", true);
}

export async function updateIntegration(
  client: SupabaseClient<Database>,
  update: {
    id: string;
    active: boolean;
    metadata: Json;
    updatedBy: string;
  }
) {
  const { id, ...data } = update;
  return client.from("integration").update(data).eq("id", id);
}

export async function updateLogo(
  client: SupabaseClient<Database>,
  logo: string | null
) {
  return client
    .from("company")
    .update(
      sanitize({
        logo,
      })
    )
    .eq("id", true);
}

export async function updateSequence(
  client: SupabaseClient<Database>,
  table: string,
  sequence: Partial<z.infer<typeof sequenceValidator>> & {
    updatedBy: string;
  }
) {
  return client.from("sequence").update(sanitize(sequence)).eq("table", table);
}

export async function updateTheme(
  client: SupabaseClient<Database>,
  theme: z.infer<typeof themeValidator> & { updatedBy: string }
) {
  return client.from("theme").update(theme).eq("id", true);
}
