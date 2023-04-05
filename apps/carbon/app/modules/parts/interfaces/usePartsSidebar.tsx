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
        name: "Routing",
        to: "/x/parts/routing",
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
        name: "Units of Measure",
        to: "/x/parts/uoms",
      },
    ],
  },
];

export default function usePartsSidebar() {
  return { groups: partsRoutes };
}
