import type { RouteGroup } from "~/types";

const resourcesRoutes: RouteGroup[] = [
  {
    name: "Manage",
    routes: [
      {
        name: "People",
        to: "/x/resources/people",
      },
      {
        name: "Contractors",
        to: "/x/resources/contractors",
      },
      {
        name: "Equipment",
        to: "/x/resources/equipment",
      },
      {
        name: "Partners",
        to: "/x/resources/partners",
      },
      {
        name: "Work Cells",
        to: "/x/resources/work-cells",
      },
    ],
  },
  {
    name: "Configure",
    routes: [
      {
        name: "Abilities",
        to: "/x/resources/abilities",
      },
      {
        name: "Attributes",
        to: "/x/resources/attributes",
      },
      {
        name: "Departments",
        to: "/x/resources/departments",
      },
      {
        name: "Holidays",
        to: "/x/resources/holidays",
      },
      {
        name: "Locations",
        to: "/x/resources/locations",
      },
      {
        name: "Shifts",
        to: "/x/resources/shifts",
      },
    ],
  },
];

export default function useResourcesSidebar() {
  return { groups: resourcesRoutes };
}
