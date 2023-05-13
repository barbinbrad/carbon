import type { Database } from "@carbon/database";
import type {
  getPaymentTerms,
  getSupplierContacts,
  getSupplierLocations,
  getSuppliers,
  getSupplierStatuses,
  getSupplierTypes,
} from "./services";

export type PaymentTermCalculationMethod =
  Database["public"]["Enums"]["paymentTermCalculationMethod"];

export type PaymentTerm = NonNullable<
  Awaited<ReturnType<typeof getPaymentTerms>>["data"]
>[number];

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
