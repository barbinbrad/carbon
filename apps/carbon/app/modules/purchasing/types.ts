import type { Database } from "@carbon/database";
import type {
  getPurchaseOrders,
  getSupplierContacts,
  getSupplierLocations,
  getSuppliers,
  getSupplierStatuses,
  getSupplierTypes,
} from "./services";

export type PurchaseOrder = NonNullable<
  Awaited<ReturnType<typeof getPurchaseOrders>>["data"]
>[number];

export type PurchaseOrderApprovalStatus =
  Database["public"]["Enums"]["purchaseOrderApprovalStatus"];

export type PurchaseOrderType =
  Database["public"]["Enums"]["purchaseOrderType"];

export type PurchaseOrderTransactionType =
  Database["public"]["Enums"]["purchaseOrderTransactionType"];

export type Supplier = NonNullable<
  Awaited<ReturnType<typeof getSuppliers>>["data"]
>[number];

export type SupplierContact = NonNullable<
  Awaited<ReturnType<typeof getSupplierContacts>>["data"]
>[number];

export type SupplierLocation = NonNullable<
  Awaited<ReturnType<typeof getSupplierLocations>>["data"]
>[number];

export type SupplierStatus = NonNullable<
  Awaited<ReturnType<typeof getSupplierStatuses>>["data"]
>[number];

export type SupplierType = NonNullable<
  Awaited<ReturnType<typeof getSupplierTypes>>["data"]
>[number];
