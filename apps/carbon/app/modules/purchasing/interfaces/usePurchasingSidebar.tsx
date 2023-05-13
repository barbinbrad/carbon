import { usePermissions } from "~/hooks";
import type { AuthenticatedRouteGroup } from "~/types";

const purchasingRoutes: AuthenticatedRouteGroup[] = [
  {
    name: "Manage",
    routes: [
      {
        name: "Suppliers",
        to: "/x/purchasing/suppliers",
      },
    ],
  },
  {
    name: "Configure",
    routes: [
      {
        name: "Payment Terms",
        to: "/x/purchasing/payment-terms",
        role: "employee",
      },
      {
        name: "Shipping Methods",
        to: "/x/purchasing/shipping-methods",
      },
      {
        name: "Supplier Types",
        to: "/x/purchasing/supplier-types",
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
