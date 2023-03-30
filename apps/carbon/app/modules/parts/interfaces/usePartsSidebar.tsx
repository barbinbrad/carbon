import type { RouteGroup } from "~/types";

const partsRoutes: RouteGroup[] = [
  {
    name: "Manage",
    routes: [
      {
        name: "Parts",
        to: "/x/parts/search",
      },
      {
        name: "Configurator",
        to: "/x/parts/configurator",
      },
    ],
  },
  {
    name: "Configure",
    routes: [
      {
        name: "Part Groups",
        to: "/x/parts/groups",
      },
      {
        name: "Part Accounts",
        to: "/x/parts/accounts",
      },
    ],
  },
];

export default function usePartsSidebar() {
  return { groups: partsRoutes };
}