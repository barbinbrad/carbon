import type { Database } from "@carbon/database";
import type { getReceipts, getShippingMethods } from "./services";

export type Receipt = NonNullable<
  Awaited<ReturnType<typeof getReceipts>>["data"]
>[number];

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
