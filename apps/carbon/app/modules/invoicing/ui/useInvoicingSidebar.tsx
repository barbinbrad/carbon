import { usePermissions } from "~/hooks";
import type { AuthenticatedRouteGroup } from "~/types";

const invoicingRoutes: AuthenticatedRouteGroup[] = [
  {
    name: "Manage",
    routes: [
      {
        name: "Accounts Payable",
        to: "/x/invoicing/payable",
        role: "employee",
      },
      {
        name: "Accounts Receivable",
        to: "/x/invoicing/receivable",
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
