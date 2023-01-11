import type { getSupplierTypes } from "~/services/purchasing";

export type SupplierType = NonNullable<
  Awaited<ReturnType<typeof getSupplierTypes>>["data"]
>[number];
