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
    name: "People",
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
        name: "Shifts",
        to: "/x/resources/shifts",
      },
    ],
  },
  {
    name: "Equipment",
    routes: [
      {
        name: "Eqiupment Types",
        to: "/x/resources/attributes",
      },
      {
        name: "Processes",
        to: "/x/resources/processes",
      },
    ],
  },
  {
    name: "Locations",
    routes: [
      {
        name: "Locations",
        to: "/x/resources/locations",
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
