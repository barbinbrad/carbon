import type { getSuppliers, getSupplierTypes } from "~/services/purchasing";

export type Supplier = NonNullable<
  Awaited<ReturnType<typeof getSuppliers>>["data"]
>[number];

export type SupplierType = NonNullable<
  Awaited<ReturnType<typeof getSupplierTypes>>["data"]
>[number];
