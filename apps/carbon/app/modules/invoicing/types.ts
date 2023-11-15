import type { purchaseInvoiceStatusType } from "./invoicing.models";
import type {
  getPurchaseInvoiceLines,
  getPurchaseInvoices,
} from "./invoicing.service";

export type PurchaseInvoice = NonNullable<
  Awaited<ReturnType<typeof getPurchaseInvoices>>["data"]
>[number];

export type PurchaseInvoiceLine = NonNullable<
  Awaited<ReturnType<typeof getPurchaseInvoiceLines>>["data"]
>[number];

export type PurchaseInvoiceStatus = (typeof purchaseInvoiceStatusType)[number];
