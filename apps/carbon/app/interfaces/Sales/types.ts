import type { getCustomers, getCustomerTypes } from "~/services/sales";

export type Customer = NonNullable<
  Awaited<ReturnType<typeof getCustomers>>["data"]
>[number];

export type CustomerType = NonNullable<
  Awaited<ReturnType<typeof getCustomerTypes>>["data"]
>[number];
