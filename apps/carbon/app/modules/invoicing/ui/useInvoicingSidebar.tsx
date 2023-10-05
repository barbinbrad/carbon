import { usePermissions } from "~/hooks";
import type { AuthenticatedRouteGroup } from "~/types";

const invoicingRoutes: AuthenticatedRouteGroup[] = [
  {
    name: "Manage",
    routes: [
      {
        name: "Purchase Invoices",
        to: "/x/invoicing/purchasing",
        role: "employee",
      },
      {
        name: "Sales Invoices",
        to: "/x/invoicing/sales",
        role: "employee",
      },
    ],
  },
];

export default function useInvoicingSidebar() {
  const permissions = usePermissions();
  return {
    groups: invoicingRoutes
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
