import { usePermissions } from "~/hooks";
import type { AuthenticatedRouteGroup } from "~/types";

const purchasingRoutes: AuthenticatedRouteGroup[] = [
  {
    name: "Manage",
    routes: [
      {
        name: "Suppliers",
        to: "/app/purchasing/suppliers",
      },
    ],
  },
  {
    name: "Configuration",
    routes: [
      {
        name: "Supplier Types",
        to: "/app/purchasing/supplier-types",
        role: "employee",
      },
    ],
  },
];

export default function usePurchasingSidebar() {
  const permissions = usePermissions();
  return {
    groups: purchasingRoutes
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
