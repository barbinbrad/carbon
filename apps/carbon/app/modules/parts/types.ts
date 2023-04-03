import type { Database } from "@carbon/database";
import type { getPartGroups, getParts } from "./services";

export type PartGroup = NonNullable<
  Awaited<ReturnType<typeof getPartGroups>>["data"]
>[number];

export type PartReplenishmentSystem =
  Database["public"]["Enums"]["partReplenishmentSystem"];

export type PartManufacturingPolicy =
  Database["public"]["Enums"]["partManufacturingPolicy"];

export type PartsTableRow = NonNullable<
  Awaited<ReturnType<typeof getParts>>["data"]
>[number];

export type PartType = Database["public"]["Enums"]["partType"];
