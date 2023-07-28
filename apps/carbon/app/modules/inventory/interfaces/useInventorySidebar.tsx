import { usePermissions } from "~/hooks";
import type { AuthenticatedRouteGroup } from "~/types";

const inventoryRoutes: AuthenticatedRouteGroup[] = [
  {
    name: "Manage",
    routes: [
      {
        name: "Receipts",
        to: "/x/inventory/reciepts",
      },
      {
        name: "Shipments",
        to: "/x/inventory/shipments",
      },
    ],
  },
  {
    name: "Configure",
    routes: [
      {
        name: "Shipping Methods",
        to: "/x/inventory/shipping-methods",
        role: "employee",
      },
    ],
  },
];

export default function useAccountingSidebar() {
  const permissions = usePermissions();
  return {
    groups: inventoryRoutes
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
