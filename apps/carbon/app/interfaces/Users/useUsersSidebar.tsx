import type { Route } from "~/types";

const usersRoutes: Record<string, Route[]>[] = [
  {
    Manage: [
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
    Configuration: [
      {
        name: "Employee Types",
        to: "/app/users/employee-types",
      },
    ],
  },
];

export default function useUsersSidebar() {
  return { links: usersRoutes };
}
