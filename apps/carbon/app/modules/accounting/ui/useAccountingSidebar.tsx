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
      // {
      //   name: "Journals",
      //   to: "/x/accounting/journals",
      //   role: "employee",
      // },
    ],
  },
  {
    name: "Posting Groups",
    routes: [
      // {
      //   name: "Bank Account Groups",
      //   to: "/x/accounting/groups/bank",
      //   role: "employee",
      // },
      // {
      //   name: "Fixed Asset Groups",
      //   to: "/x/accounting/groups/fixed-asset",
      //   role: "employee",
      // },
      {
        name: "Inventory Groups",
        to: "/x/accounting/groups/inventory",
        role: "employee",
      },
      {
        name: "Purchasing Groups",
        to: "/x/accounting/groups/purchasing",
        role: "employee",
      },
      {
        name: "Sales Groups",
        to: "/x/accounting/groups/sales",
        role: "employee",
      },
    ],
  },
  {
    name: "Configure",
    routes: [
      {
        name: "Account Categories",
        to: "/x/accounting/categories",
        role: "employee",
      },
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
        name: "Fiscal Years",
        to: "/x/accounting/years",
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
