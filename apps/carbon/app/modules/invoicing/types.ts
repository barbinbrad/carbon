import type { getPurchaseInvoices } from "./services";

export type PurchaseInvoice = NonNullable<
  Awaited<ReturnType<typeof getPurchaseInvoices>>["data"]
>[number];
