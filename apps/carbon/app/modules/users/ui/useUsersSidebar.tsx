import type { RouteGroup } from "~/types";
import { path } from "~/utils/path";

const usersRoutes: RouteGroup[] = [
  {
    name: "Manage",
    routes: [
      {
        name: "Employees",
        to: path.to.employeeAccounts,
      },
      {
        name: "Customers",
        to: path.to.customerAccounts,
      },
      {
        name: "Suppliers",
        to: path.to.supplierAccounts,
      },
      {
        name: "Groups",
        to: path.to.groups,
      },
    ],
  },
  {
    name: "Configure",
    routes: [
      {
        name: "Employee Types",
        to: path.to.employeeTypes,
      },
    ],
  },
];

export default function useUsersSidebar() {
  return { groups: usersRoutes };
}
