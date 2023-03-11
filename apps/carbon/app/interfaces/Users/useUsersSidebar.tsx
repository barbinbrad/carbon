import type { RouteGroup } from "~/types";

const usersRoutes: RouteGroup[] = [
  {
    name: "Manage",
    routes: [
      {
        name: "Employees",
        to: "/x/users/employees",
      },
      {
        name: "Customers",
        to: "/x/users/customers",
      },
      {
        name: "Suppliers",
        to: "/x/users/suppliers",
      },
      {
        name: "Groups",
        to: "/x/users/groups",
      },
    ],
  },
  {
    name: "Configure",
    routes: [
      {
        name: "Employee Types",
        to: "/x/users/employee-types",
      },
    ],
  },
];

export default function useUsersSidebar() {
  return { groups: usersRoutes };
}
