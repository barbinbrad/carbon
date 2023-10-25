import { usePermissions } from "~/hooks";
import type { AuthenticatedRouteGroup } from "~/types";
import { path } from "~/utils/path";

const invoicingRoutes: AuthenticatedRouteGroup[] = [
  {
    name: "Manage",
    routes: [
      {
        name: "Purchase Invoices",
        to: path.to.purchaseInvoices,
        role: "employee",
      },
      {
        name: "Sales Invoices",
        to: path.to.salesInvoices,
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
