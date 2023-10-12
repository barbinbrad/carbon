import type {
  getPurchaseInvoices,
  purchaseInvoiceStatusType,
} from "./services";

export type PurchaseInvoice = NonNullable<
  Awaited<ReturnType<typeof getPurchaseInvoices>>["data"]
>[number];

export type PurchaseInvoiceStatus = (typeof purchaseInvoiceStatusType)[number];
