import type { Database } from "@carbon/database";
import type { getShippingMethods } from "./services";

export type ShippingCarrier = Database["public"]["Enums"]["shippingCarrier"];

export type ShippingMethod = NonNullable<
  Awaited<ReturnType<typeof getShippingMethods>>["data"]
>[number];
