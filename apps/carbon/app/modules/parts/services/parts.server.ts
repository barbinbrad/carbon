import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { TypeOfValidator } from "~/types/validators";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";
import type {
  partCostValidator,
  partGroupValidator,
  partValidator,
} from "./parts.form";

export async function deletePartGroup(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("partGroup").update({ active: false }).eq("id", id);
}

export async function deleteUnitOfMeasure(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("unitOfMeasure").delete().eq("id", id);
}

export async function getPartCost(
  client: SupabaseClient<Database>,
  id: string
) {
  return client
    .from("partCost")
    .select(
      "partId, costingMethod, standardCost, unitCost, salesAccountId, discountAccountId, inventoryAccountId, costIsAdjusted"
    )
    .eq("partId", id)
    .single();
}

export async function getPartGroup(
  client: SupabaseClient<Database>,
  id: string
) {
  return client
    .from("partGroup")
    .select(
      "id, name, description, salesAccountId, discountAccountId, inventoryAccountId"
    )
    .eq("id", id)
    .single();
}

export async function getPartGroups(
  client: SupabaseClient<Database>,
  args?: GenericQueryFilters & { name: string | null }
) {
  let query = client
    .from("partGroup")
    .select(
      "id, name, description, salesAccountId, discountAccountId, inventoryAccountId",
      {
        count: "exact",
      }
    );

  if (args?.name) {
    query = query.ilike("name", `%${args.name}%`);
  }

  if (args) {
    query = setGenericQueryFilters(query, args, "name");
  }

  return query;
}

export async function getPartGroupsList(
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

export async function getPartSummary(
  client: SupabaseClient<Database>,
  id: string
) {
  return client
    .from("part")
    .select(
      "id, name, description, partType, replenishmentSystem, partType, unitOfMeasureCode, partGroupId, blocked, active"
    )
    .eq("id", id)
    .single();
}

export function getPartTypes(): Database["public"]["Enums"]["partType"][] {
  return ["Inventory", "Non-Inventory", "Service"];
}

export function getPartReplenishmentSystems(): Database["public"]["Enums"]["partReplenishmentSystem"][] {
  return ["Purchased", "Manufactured", "Purchased and Manufactured"];
}

export function getPartManufacturingPolicies(): Database["public"]["Enums"]["partManufacturingPolicy"][] {
  return ["Make to Order", "Make to Stock"];
}

export function getPartCostingMethods(): Database["public"]["Enums"]["partCostingMethod"][] {
  return ["Standard", "Average", "FIFO", "LIFO"];
}

export async function getUnitOfMeasure(
  client: SupabaseClient<Database>,
  id: string
) {
  return client
    .from("unitOfMeasure")
    .select("id, name, code")
    .eq("id", id)
    .single();
}

export async function getUnitOfMeasures(
  client: SupabaseClient<Database>,
  args: GenericQueryFilters & { name: string | null }
) {
  let query = client.from("unitOfMeasure").select("id, name, code", {
    count: "exact",
  });

  if (args.name) {
    query = query.ilike("name", `%${args.name}%`);
  }

  query = setGenericQueryFilters(query, args, "name");
  return query;
}

export async function getUnitOfMeasuresList(client: SupabaseClient<Database>) {
  return client.from("unitOfMeasure").select("name, code");
}

export async function upsertPart(
  client: SupabaseClient<Database>,
  part:
    | (TypeOfValidator<typeof partValidator> & { createdBy: string })
    | (TypeOfValidator<typeof partValidator> & { updatedBy: string })
) {
  if ("createdBy" in part) {
    console.log("inserting part");
    return client.from("part").insert(part).select("id");
  }
  console.log("updating part");
  return client.from("part").update(part).eq("id", part.id);
}

export async function upsertPartCost(
  client: SupabaseClient<Database>,
  partCost: TypeOfValidator<typeof partCostValidator> & { updatedBy: string }
) {
  return client.from("partCost").update(partCost).eq("partId", partCost.partId);
}

export async function upsertPartGroup(
  client: SupabaseClient<Database>,
  partGroup:
    | (Omit<TypeOfValidator<typeof partGroupValidator>, "id"> & {
        createdBy: string;
      })
    | (TypeOfValidator<typeof partGroupValidator> & { updatedBy: string })
) {
  if ("createdBy" in partGroup) {
    return client.from("partGroup").insert([partGroup]).select("id");
  }
  return client
    .from("partGroup")
    .update(partGroup)
    .eq("id", partGroup.id)
    .select("id");
}

export async function upsertUnitOfMeasure(
  client: SupabaseClient<Database>,
  unitOfMeasure: { id?: string; name: string; code: string }
) {
  if ("id" in unitOfMeasure) {
    return client
      .from("unitOfMeasure")
      .update(unitOfMeasure)
      .eq("id", unitOfMeasure.id)
      .select("id");
  }

  return client.from("unitOfMeasure").insert([unitOfMeasure]).select("id");
}
