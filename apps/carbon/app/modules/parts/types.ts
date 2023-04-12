import type { Database } from "@carbon/database";
import type {
  getPartCost,
  getPartGroups,
  getPartGroupsList,
  getParts,
  getPartSummary,
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

export type PartReplenishmentSystem =
  Database["public"]["Enums"]["partReplenishmentSystem"];

export type PartSummary = NonNullable<
  Awaited<ReturnType<typeof getPartSummary>>
>["data"];

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
