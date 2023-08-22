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
    name: "Posting Groups",
    routes: [
      {
        name: "Customer Groups",
        to: "/x/accounting/customer-groups",
        role: "employee",
      },
      {
        name: "Part Groups",
        to: "/x/accounting/part-groups",
        role: "employee",
      },
      {
        name: "Supplier Groups",
        to: "/x/accounting/supplier-groups",
        role: "employee",
      },
    ],
  },
  {
    name: "Configure",
    routes: [
      {
        name: "Account Defaults",
        to: "/x/accounting/defaults",
        role: "employee",
      },
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
