import { usePermissions } from "~/hooks";
import type { Authenticated, Route } from "~/types";

const purchasingRoutes: Record<string, Authenticated<Route>[]>[] = [
  {
    Manage: [
      {
        name: "Suppliers",
        to: "/app/purchasing/suppliers",
      },
    ],
  },
  {
    Configuration: [
      {
        name: "Supplier Types",
        to: "/app/purchasing/supplier-types",
        role: "employee",
      },
    ],
  },
];

export default function useSalesSidebar() {
  const permissions = usePermissions();
  return {
    links: purchasingRoutes.map((links) =>
      Object.entries(links).reduce<Record<string, Authenticated<Route[]>>>(
        (acc, [name, routes]) => {
          const filteredRoutes = routes.filter((route) => {
            if (route.role) {
              return permissions.is(route.role);
            } else {
              return true;
            }
          });

          if (filteredRoutes.length > 0) {
            acc[name] = filteredRoutes;
          }

          return acc;
        },
        {}
      )
    ),
  };
}
