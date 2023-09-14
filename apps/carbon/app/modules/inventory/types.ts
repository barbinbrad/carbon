import type { Database } from "@carbon/database";
import type {
  getReceiptLines,
  getReceipts,
  getShippingMethods,
} from "./services";

export type Receipt = NonNullable<
  Awaited<ReturnType<typeof getReceipts>>["data"]
>[number];

export type ReceiptSourceDocument =
  Database["public"]["Enums"]["receiptSourceDocument"];

export type ReceiptLine = NonNullable<
  Awaited<ReturnType<typeof getReceiptLines>>["data"]
>[number];

export type ReceiptLineItem = Omit<
  ReceiptLine,
  "id" | "updatedBy" | "createdAt" | "updatedAt"
>;

export type ShippingCarrier = Database["public"]["Enums"]["shippingCarrier"];

export type ShippingMethod = NonNullable<
  Awaited<ReturnType<typeof getShippingMethods>>["data"]
>[number];
