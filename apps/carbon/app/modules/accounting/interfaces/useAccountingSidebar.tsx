import { usePermissions } from "~/hooks";
import type { AuthenticatedRouteGroup } from "~/types";

const accountingRoutes: AuthenticatedRouteGroup[] = [
  {
    name: "Manage",
    routes: [
      {
        name: "Chart of Accounts",
        to: "/x/accounting/charts",
        role: "employee",
      },
    ],
  },
  {
    name: "Configure",
    routes: [
      {
        name: "Currencies",
        to: "/x/accounting/currencies",
        role: "employee",
      },
      {
        name: "G/L Categories",
        to: "/x/accounting/categories",
        role: "employee",
      },
      {
        name: "Payment Terms",
        to: "/x/accounting/payment-terms",
        role: "employee",
      },
    ],
  },
];

export default function useAccountingSidebar() {
  const permissions = usePermissions();
  return {
    groups: accountingRoutes
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
