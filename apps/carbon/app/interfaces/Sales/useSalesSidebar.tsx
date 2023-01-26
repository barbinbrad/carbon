import { usePermissions } from "~/hooks";
import type { Authenticated, Route } from "~/types";

const salesRoutes: Record<string, Authenticated<Route>[]>[] = [
  {
    Manage: [
      {
        name: "Customers",
        to: "/app/sales/customers",
      },
    ],
  },
  {
    Configuration: [
      {
        name: "Customer Types",
        to: "/app/sales/customer-types",
        role: "employee",
      },
    ],
  },
];

export default function useSalesSidebar() {
  const permissions = usePermissions();
  return {
    links: salesRoutes.map((links) =>
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
