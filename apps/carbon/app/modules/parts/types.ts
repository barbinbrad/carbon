import type { Database } from "@carbon/database";
import type {
  getPartGroups,
  getPartGroupsList,
  getParts,
  getUnitOfMeasure,
  getUnitOfMeasuresList,
} from "./services";

export type PartGroup = NonNullable<
  Awaited<ReturnType<typeof getPartGroups>>["data"]
>[number];

export type PartGroupListItem = NonNullable<
  Awaited<ReturnType<typeof getPartGroupsList>>["data"]
>[number];

export type PartReplenishmentSystem =
  Database["public"]["Enums"]["partReplenishmentSystem"];

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
