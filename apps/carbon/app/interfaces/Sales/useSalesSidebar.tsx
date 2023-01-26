import { usePermissions } from "~/hooks";
import type { AuthenticatedRouteGroup } from "~/types";

const salesRoutes: AuthenticatedRouteGroup[] = [
  {
    name: "Manage",
    routes: [
      {
        name: "Customers",
        to: "/app/sales/customers",
      },
    ],
  },
  {
    name: "Configuration",
    routes: [
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
    groups: salesRoutes
      .filter((group) => {
        const filteredRoutes = group.routes.filter((route) => {
          if (route.role) {
            return permissions.is(route.role);
          } else {
            return true;
          }
        });

        return filteredRoutes.length > 0;
      })
      .map((group) => ({
        ...group,
        routes: group.routes.filter((route) => {
          if (route.role) {
            return permissions.is(route.role);
          } else {
            return true;
          }
        }),
      })),
  };
}
