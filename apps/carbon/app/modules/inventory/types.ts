import type { Database } from "@carbon/database";
import type { getShippingMethod } from "./services";

export type ShippingCarrier = Database["public"]["Enums"]["shippingCarrier"];

export type ShippingMethod = NonNullable<
  Awaited<ReturnType<typeof getShippingMethod>>["data"]
>[number];
