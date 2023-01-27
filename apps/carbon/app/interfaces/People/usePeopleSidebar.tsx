import type { RouteGroup } from "~/types";

const usersRoutes: RouteGroup[] = [
  {
    name: "Configuration",
    routes: [
      {
        name: "Attributes",
        to: "/x/people/attributes",
      },
      {
        name: "Skills",
        to: "/x/people/skills",
      },
    ],
  },
];

export default function usePeopleSidebar() {
  return { groups: usersRoutes };
}
