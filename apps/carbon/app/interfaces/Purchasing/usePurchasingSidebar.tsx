import type { Route } from "~/types";

const purchasingRoutes: Record<string, Route[]>[] = [
  {
    Configuration: [
      {
        name: "Suppliers",
        to: "/app/purchasing/suppliers",
      },
      {
        name: "Supplier Types",
        to: "/app/purchasing/supplier-types",
      },
    ],
  },
];

export default function useSalesSidebar() {
  return { links: purchasingRoutes };
}
