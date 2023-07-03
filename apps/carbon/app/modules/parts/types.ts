import type { Database } from "@carbon/database";
import type {
  getPartCost,
  getPartGroups,
  getPartGroupsList,
  getParts,
  getPartSummary,
  getPartSuppliers,
  getUnitOfMeasure,
  getUnitOfMeasuresList,
} from "./services";

export type PartCost = NonNullable<
  Awaited<ReturnType<typeof getPartCost>>
>["data"];

export type PartCostingMethod =
  Database["public"]["Enums"]["partCostingMethod"];

export type PartGroup = NonNullable<
  Awaited<ReturnType<typeof getPartGroups>>["data"]
>[number];

export type PartGroupListItem = NonNullable<
  Awaited<ReturnType<typeof getPartGroupsList>>["data"]
>[number];

export type PartReorderingPolicy =
  Database["public"]["Enums"]["partReorderingPolicy"];

export type PartReplenishmentSystem =
  Database["public"]["Enums"]["partReplenishmentSystem"];

export type PartSummary = NonNullable<
  Awaited<ReturnType<typeof getPartSummary>>
>["data"];

export type PartSupplier = NonNullable<
  Awaited<ReturnType<typeof getPartSuppliers>>["data"]
>[number];

export type PartManufacturingPolicy =
  Database["public"]["Enums"]["partManufacturingPolicy"];

export type PartsTableRow = NonNullable<
  Awaited<ReturnType<typeof getParts>>["data"]
>[number];

export type PartType = Database["public"]["Enums"]["partType"];

export type UnitOfMeasure = NonNullable<
  Awaited<ReturnType<typeof getUnitOfMeasure>>["data"]
>;

export type UnitOfMeasureListItem = NonNullable<
  Awaited<ReturnType<typeof getUnitOfMeasuresList>>["data"]
>[number];
