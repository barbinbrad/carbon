import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { TypeOfValidator } from "~/types/validators";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";
import { sanitize } from "~/utils/supabase";
import type { PartReplenishmentSystem } from "../types";
import type {
  partCostValidator,
  partGroupValidator,
  partInventoryValidator,
  partManufacturingValidator,
  partPlanningValidator,
  partPurchasingValidator,
  partSupplierValidator,
  partUnitSalePriceValidator,
  partValidator,
} from "./parts.form";

export async function deletePartGroup(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("partGroup").delete().eq("id", id);
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
  return client.from("partCost").select("*").eq("partId", id).single();
}

export async function getPartGroup(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("partGroup").select("*").eq("id", id).single();
}

export async function getPartGroups(
  client: SupabaseClient<Database>,
  args?: GenericQueryFilters & { name: string | null }
) {
  let query = client.from("partGroup").select("*", {
    count: "exact",
  });

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
  partId: string,
  locationId: string
) {
  return client
    .from("partInventory")
    .select("*")
    .eq("partId", partId)
    .eq("locationId", locationId)
    .maybeSingle();
}

export async function getPartManufacturing(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("partReplenishment").select("*").eq("partId", id).single();
}

export async function getPartPlanning(
  client: SupabaseClient<Database>,
  partId: string,
  locationId: string
) {
  return client
    .from("partPlanning")
    .select("*")
    .eq("partId", partId)
    .eq("locationId", locationId)
    .maybeSingle();
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
    supplierId: string | null;
  }
) {
  let query = client.from("parts_view").select("*", {
    count: "exact",
  });

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

  if (args.supplierId) {
    query = query.contains("supplierIds", [args.supplierId]);
  }

  query = setGenericQueryFilters(query, args, "id");
  return query;
}

export async function getPartsList(
  client: SupabaseClient<Database>,
  replenishmentSystem: PartReplenishmentSystem | null
) {
  let query = client
    .from("part")
    .select("id, name")
    .eq("blocked", false)
    .eq("active", true);
  if (replenishmentSystem) {
    query = query.or(
      `replenishmentSystem.eq.${replenishmentSystem},replenishmentSystem.eq.Buy and Make`
    );
  }
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

export async function getPartSuppliers(
  client: SupabaseClient<Database>,
  id: string
) {
  return client
    .from("partSupplier")
    .select(
      `
      id, supplier(id, name),
      supplierPartId, supplierUnitOfMeasureCode,
      minimumOrderQuantity, conversionFactor
    `
    )
    .eq("active", true)
    .eq("partId", id);
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

export async function getShelvesList(
  client: SupabaseClient<Database>,
  locationId: string
) {
  return client
    .from("shelf")
    .select("id")
    .eq("active", true)
    .eq("locationId", locationId);
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
  locationId: string,
  userId: string
) {
  const shelfLookup = await client
    .from("shelf")
    .select("id")
    .eq("id", shelfId)
    .eq("locationId", locationId)
    .maybeSingle();
  if (shelfLookup.error) return shelfLookup;

  // the shelf is inactive, so we can just reactivate it
  if (shelfLookup.data) {
    return client.from("shelf").update({ active: true }).eq("id", shelfId);
  }

  // otherwise we'll create a new shelf
  return client
    .from("shelf")
    .insert([
      {
        id: shelfId,
        locationId,
        createdBy: userId,
      },
    ])
    .select("id")
    .single();
}

export async function upsertPart(
  client: SupabaseClient<Database>,
  part:
    | (TypeOfValidator<typeof partValidator> & { createdBy: string })
    | (TypeOfValidator<typeof partValidator> & { updatedBy: string })
) {
  if ("createdBy" in part) {
    return client.from("part").insert(part).select("id").single();
  }
  return client.from("part").update(sanitize(part)).eq("id", part.id);
}

export async function upsertPartCost(
  client: SupabaseClient<Database>,
  partCost: TypeOfValidator<typeof partCostValidator> & { updatedBy: string }
) {
  return client
    .from("partCost")
    .update(sanitize(partCost))
    .eq("partId", partCost.partId);
}

export async function upsertPartInventory(
  client: SupabaseClient<Database>,
  partInventory:
    | {
        partId: string;
        locationId: string;
        createdBy: string;
      }
    | (Omit<TypeOfValidator<typeof partInventoryValidator>, "hasNewShelf"> & {
        updatedBy: string;
      })
) {
  if ("createdBy" in partInventory) {
    return client.from("partInventory").insert(partInventory);
  }

  return client
    .from("partInventory")
    .update(sanitize(partInventory))
    .eq("partId", partInventory.partId)
    .eq("locationId", partInventory.locationId);
}

export async function upsertPartManufacturing(
  client: SupabaseClient<Database>,
  partManufacturing: TypeOfValidator<typeof partManufacturingValidator> & {
    updatedBy: string;
  }
) {
  return client
    .from("partReplenishment")
    .update(sanitize(partManufacturing))
    .eq("partId", partManufacturing.partId);
}

export async function upsertPartPlanning(
  client: SupabaseClient<Database>,
  partPlanning:
    | {
        partId: string;
        locationId: string;
        createdBy: string;
      }
    | (TypeOfValidator<typeof partPlanningValidator> & {
        updatedBy: string;
      })
) {
  if ("createdBy" in partPlanning) {
    return client.from("partPlanning").insert(partPlanning);
  }
  return client
    .from("partPlanning")
    .update(sanitize(partPlanning))
    .eq("partId", partPlanning.partId)
    .eq("locationId", partPlanning.locationId);
}

export async function upsertPartPurchasing(
  client: SupabaseClient<Database>,
  partPurchasing: TypeOfValidator<typeof partPurchasingValidator> & {
    updatedBy: string;
  }
) {
  return client
    .from("partReplenishment")
    .update(sanitize(partPurchasing))
    .eq("partId", partPurchasing.partId);
}

export async function upsertPartGroup(
  client: SupabaseClient<Database>,
  partGroup:
    | (Omit<TypeOfValidator<typeof partGroupValidator>, "id"> & {
        createdBy: string;
      })
    | (Omit<TypeOfValidator<typeof partGroupValidator>, "id"> & {
        id: string;
        updatedBy: string;
      })
) {
  if ("createdBy" in partGroup) {
    return client.from("partGroup").insert([partGroup]).select("id").single();
  }
  return (
    client
      .from("partGroup")
      .update(sanitize(partGroup))
      // @ts-ignore
      .eq("id", partGroup.id)
      .select("id")
      .single()
  );
}

export async function upsertPartSupplier(
  client: SupabaseClient<Database>,
  partSupplier:
    | (Omit<TypeOfValidator<typeof partSupplierValidator>, "id"> & {
        createdBy: string;
      })
    | (Omit<TypeOfValidator<typeof partSupplierValidator>, "id"> & {
        id: string;
        updatedBy: string;
      })
) {
  if ("createdBy" in partSupplier) {
    return client
      .from("partSupplier")
      .insert([partSupplier])
      .select("id")
      .single();
  }
  return client
    .from("partSupplier")
    .update(sanitize(partSupplier))
    .eq("id", partSupplier.id)
    .select("id")
    .single();
}

export async function upsertPartUnitSalePrice(
  client: SupabaseClient<Database>,
  partUnitSalePrice: TypeOfValidator<typeof partUnitSalePriceValidator> & {
    updatedBy: string;
  }
) {
  return client
    .from("partUnitSalePrice")
    .update(sanitize(partUnitSalePrice))
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
      .update(sanitize(unitOfMeasure))
      .eq("id", unitOfMeasure.id)
      .select("id")
      .single();
  }

  return client
    .from("unitOfMeasure")
    .insert([unitOfMeasure])
    .select("id")
    .single();
}
