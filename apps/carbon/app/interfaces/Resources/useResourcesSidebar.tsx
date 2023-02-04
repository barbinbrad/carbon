import type { RouteGroup } from "~/types";

const resourcesRoutes: RouteGroup[] = [
  {
    name: "Manage",
    routes: [
      {
        name: "People",
        to: "/x/resources/people/all",
      },
      {
        name: "Contractors",
        to: "/x/resources/contractors",
      },
      {
        name: "Equipment",
        to: "/x/resources/contractors",
      },
      {
        name: "Facilities",
        to: "/x/resources/contractors",
      },
      {
        name: "Crews",
        to: "/x/resources/contractors",
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
        name: "Attributes",
        to: "/x/resources/people/attributes",
      },
      {
        name: "Skills",
        to: "/x/resources/people/skills",
      },
    ],
  },
];

export default function useResourcesSidebar() {
  return { groups: resourcesRoutes };
}
