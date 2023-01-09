import type { Route } from "~/types";

const salesRoutes: Record<string, Route[]>[] = [
  {
    Configuration: [
      {
        name: "Customers",
        to: "/app/sales/customers",
      },
      {
        name: "Customer Types",
        to: "/app/sales/customer-types",
      },
    ],
  },
];

export default function useSalesSidebar() {
  return { links: salesRoutes };
}
