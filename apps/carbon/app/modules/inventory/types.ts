import type { Database } from "@carbon/database";
import type { getReceipts, getShippingMethods } from "./services";

export type Receipt = NonNullable<
  Awaited<ReturnType<typeof getReceipts>>["data"]
>[number];

export type ReceiptSourceDocument =
  Database["public"]["Enums"]["receiptSourceDocument"];

export interface ReceiptListItem {
  partId: string;
  description?: string;
  quantity: number;
  unitCost: number;
  location?: string;
  shelfId?: string;
  unitOfMeasure: string;
}

export type ShippingCarrier = Database["public"]["Enums"]["shippingCarrier"];

export type ShippingMethod = NonNullable<
  Awaited<ReturnType<typeof getShippingMethods>>["data"]
>[number];
