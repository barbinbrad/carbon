import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";

export async function getPartGroups(
  client: SupabaseClient<Database>,
  args?: GenericQueryFilters & { name: string | null }
) {
  let query = client.from("partGroup").select("id, name", { count: "exact" });

  if (args?.name) {
    query = query.ilike("name", `%${args.name}%`);
  }

  if (args) {
    query = setGenericQueryFilters(query, args, "name");
  }

  return query;
}

export async function getParts(
  client: SupabaseClient<Database>,
  args: GenericQueryFilters & {
    id: string | null;
    type: string | null;
    group: string | null;
  }
) {
  let query = client
    .from("part")
    .select("id, name, description, partType, partGroup(name)", {
      count: "exact",
    });

  if (args.id) {
    query = query.ilike("id", `%${args.id}%`);
  }

  if (args.type) {
    query = query.eq("partType", args.type);
  }

  if (args.group) {
    query = query.eq("partGroupId", args.group);
  }

  query = setGenericQueryFilters(query, args, "id");
  return query;
}

export function getPartTypes(): Database["public"]["Enums"]["partType"][] {
  return ["Inventory", "Non-Inventory", "Service"];
}

export function getPartReplenishmentSystems(): Database["public"]["Enums"]["partReplenishmentSystem"][] {
  return ["Purchased", "Manufactured", "Purchased and Manufactured"];
}

export function getPartManufacturingPolicy(): Database["public"]["Enums"]["partManufacturingPolicy"][] {
  return ["Make to Order", "Make to Stock"];
}

export function getPartCostingMethod(): Database["public"]["Enums"]["partCostingMethod"][] {
  return ["Standard", "Average", "FIFO", "LIFO"];
}
