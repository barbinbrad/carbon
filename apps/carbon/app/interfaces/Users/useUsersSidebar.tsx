import type { Route, RouteGroup } from "~/types";

const usersRoutes: RouteGroup[] = [
  {
    name: "Manage",
    routes: [
      {
        name: "Employees",
        to: "/app/users/employees",
      },
      {
        name: "Customers",
        to: "/app/users/customers",
      },
      {
        name: "Suppliers",
        to: "/app/users/suppliers",
      },
      {
        name: "Groups",
        to: "/app/users/groups",
      },
    ],
  },
  {
    name: "Configuration",
    routes: [
      {
        name: "Employee Types",
        to: "/app/users/employee-types",
      },
    ],
  },
];

export default function useUsersSidebar() {
  return { groups: usersRoutes };
}
