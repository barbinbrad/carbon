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
      {
        name: "Work Centers",
        to: "/x/resources/work-centers",
      },
    ],
  },
  {
    name: "People Configuration",
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
        name: "Holidays",
        to: "/x/resources/holidays",
      },
      {
        name: "Shifts",
        to: "/x/resources/shifts",
      },
    ],
  },
  {
    name: "Equipment Configuration",
    routes: [
      {
        name: "Eqiupment Types",
        to: "/x/resources/equipment-types",
      },
      {
        name: "Maintenance",
        to: "/x/resources/maintenance",
      },
    ],
  },
  {
    name: "Locations Configuration",
    routes: [
      {
        name: "Locations",
        to: "/x/resources/locations",
      },
      {
        name: "Work Center Types",
        to: "/x/resources/work-centers-types",
      },
    ],
  },
];

export default function useResourcesSidebar() {
  return { groups: resourcesRoutes };
}
