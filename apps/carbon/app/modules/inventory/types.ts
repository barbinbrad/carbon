import type { Database } from "@carbon/database";
import type { getShippingMethods } from "./services";

export interface ReceiptListItem {
  partId: string;
  vendorPartId?: string;
  description: string;
  quantity: number;
  unitCost: number;
  location: string;
  shelfId: string | null;
  unitOfMeasure: string;
}

export type ShippingCarrier = Database["public"]["Enums"]["shippingCarrier"];

export type ShippingMethod = NonNullable<
  Awaited<ReturnType<typeof getShippingMethods>>["data"]
>[number];
