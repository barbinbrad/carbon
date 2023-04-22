import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { TypeOfValidator } from "~/types/validators";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";
import type {
  partCostValidator,
  partInventoryValidator,
  partManufacturingValidator,
  partPlanningValidator,
  partPurchasingValidator,
  partUnitSalePriceValidator,
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

export async function getPartInventory(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("partInventory").select("*").eq("partId", id).single();
}

export async function getPartManufacturing(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("partReplenishment").select("*").eq("partId", id).single();
}

export async function getPartPlanning(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("partPlanning").select("*").eq("partId", id).single();
}

export async function getPartPurchasing(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("partReplenishment").select("*").eq("partId", id).single();
}

export async function getParts(
  client: SupabaseClient<Database>,
  args: GenericQueryFilters & {
    search: string | null;
    type: string | null;
    group: string | null;
  }
) {
  let query = client
    .from("part")
    .select(
      "id, name, description, partType, partGroup(name), replenishmentSystem",
      {
        count: "exact",
      }
    );

  if (args.search) {
    query = query.or(
      `id.ilike.%${args.search}%,name.ilike.%${args.search}%,description.ilike.%${args.search}%`
    );
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

export async function getPartUnitSalePrice(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("partUnitSalePrice").select("*").eq("partId", id).single();
}

export function getPartTypes(): Database["public"]["Enums"]["partType"][] {
  return ["Inventory", "Non-Inventory", "Service"];
}

export function getPartRorderdingPolicies(): Database["public"]["Enums"]["partReorderingPolicy"][] {
  return [
    "Manual Reorder",
    "Demand-Based Reorder",
    "Fixed Reorder Quantity",
    "Maximum Quantity",
  ];
}

export function getPartReplenishmentSystems(): Database["public"]["Enums"]["partReplenishmentSystem"][] {
  return ["Buy", "Make", "Buy and Make"];
}

export function getPartManufacturingPolicies(): Database["public"]["Enums"]["partManufacturingPolicy"][] {
  return ["Make to Order", "Make to Stock"];
}

export function getPartCostingMethods(): Database["public"]["Enums"]["partCostingMethod"][] {
  return ["Standard", "Average", "FIFO", "LIFO"];
}

export async function getShelvesList(client: SupabaseClient<Database>) {
  return client.from("shelf").select("id").eq("active", true);
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

export async function insertShelf(
  client: SupabaseClient<Database>,
  shelfId: string,
  userId: string
) {
  const shelfLookup = await client.from("shelf").select("id").eq("id", shelfId);
  if (shelfLookup.error) return shelfLookup;

  // the shelf is inactive, so we can just reactivate it
  if (shelfLookup.data?.length) {
    return client.from("shelf").update({ active: true }).eq("id", shelfId);
  }

  // otherwise we'll create a new shelf
  return client
    .from("shelf")
    .insert([
      {
        id: shelfId,
        createdBy: userId,
      },
    ])
    .select("id");
}

export async function upsertPart(
  client: SupabaseClient<Database>,
  part:
    | (TypeOfValidator<typeof partValidator> & { createdBy: string })
    | (TypeOfValidator<typeof partValidator> & { updatedBy: string })
) {
  if ("createdBy" in part) {
    return client.from("part").insert(part).select("id");
  }
  return client.from("part").update(part).eq("id", part.id);
}

export async function upsertPartCost(
  client: SupabaseClient<Database>,
  partCost: TypeOfValidator<typeof partCostValidator> & { updatedBy: string }
) {
  return client.from("partCost").update(partCost).eq("partId", partCost.partId);
}

export async function upsertPartInventory(
  client: SupabaseClient<Database>,
  partInventory: Omit<
    TypeOfValidator<typeof partInventoryValidator>,
    "hasNewShelf"
  > & {
    updatedBy: string;
  }
) {
  return client
    .from("partInventory")
    .update({
      ...partInventory,
      shelfId: partInventory.shelfId || null,
    })
    .eq("partId", partInventory.partId);
}

export async function upsertPartManufacturing(
  client: SupabaseClient<Database>,
  partManufacturing: TypeOfValidator<typeof partManufacturingValidator> & {
    updatedBy: string;
  }
) {
  return client
    .from("partReplenishment")
    .update(partManufacturing)
    .eq("partId", partManufacturing.partId);
}

export async function upsertPartPlanning(
  client: SupabaseClient<Database>,
  partPlanning: TypeOfValidator<typeof partPlanningValidator> & {
    updatedBy: string;
  }
) {
  return client
    .from("partPlanning")
    .update(partPlanning)
    .eq("partId", partPlanning.partId);
}

export async function upsertPartPurchasing(
  client: SupabaseClient<Database>,
  partPurchasing: TypeOfValidator<typeof partPurchasingValidator> & {
    updatedBy: string;
  }
) {
  return client
    .from("partReplenishment")
    .update(partPurchasing)
    .eq("partId", partPurchasing.partId);
}

export async function upsertPartGroup(
  client: SupabaseClient<Database>,
  partGroup:
    | {
        name: string;
        description?: string;
        salesAccountId?: string | null;
        inventoryAccountId?: string | null;
        discountAccountId?: string | null;
        createdBy: string;
      }
    | {
        id: string;
        name: string;
        description?: string;
        salesAccountId?: string | null;
        inventoryAccountId?: string | null;
        discountAccountId?: string | null;
        updatedBy: string;
      }
) {
  if ("createdBy" in partGroup) {
    return client.from("partGroup").insert([partGroup]).select("id");
  }
  return (
    client
      .from("partGroup")
      .update(partGroup)
      // @ts-ignore
      .eq("id", partGroup.id)
      .select("id")
  );
}

export async function upsertPartUnitSalePrice(
  client: SupabaseClient<Database>,
  partUnitSalePrice: TypeOfValidator<typeof partUnitSalePriceValidator> & {
    updatedBy: string;
  }
) {
  return client
    .from("partUnitSalePrice")
    .update(partUnitSalePrice)
    .eq("partId", partUnitSalePrice.partId);
}

export async function upsertUnitOfMeasure(
  client: SupabaseClient<Database>,
  unitOfMeasure:
    | { name: string; code: string; createdBy: string }
    | { id: string; name: string; code: string; updatedBy: string }
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
