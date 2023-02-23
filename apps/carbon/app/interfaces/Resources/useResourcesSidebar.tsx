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
        name: "Facilities",
        to: "/x/resources/facilities",
      },
      {
        name: "Crews",
        to: "/x/resources/crews",
      },
      // {
      //   name: "Pools",
      //   to: "/x/resources/contractors",
      // },
    ],
  },
  {
    name: "Configuration",
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
        name: "Processes",
        to: "/x/resources/process",
      },
      {
        name: "Shifts",
        to: "/x/resources/shifts",
      },
      {
        name: "Work Centers",
        to: "/x/resources/work-centers",
      },
    ],
  },
];

export default function useResourcesSidebar() {
  return { groups: resourcesRoutes };
}
