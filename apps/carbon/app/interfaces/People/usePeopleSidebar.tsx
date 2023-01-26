import type { RouteGroup } from "~/types";

const usersRoutes: RouteGroup[] = [
  {
    name: "Configuration",
    routes: [
      {
        name: "Attributes",
        to: "/app/people/attributes",
      },
      {
        name: "Skills",
        to: "/app/people/skills",
      },
    ],
  },
];

export default function usePeopleSidebar() {
  return { groups: usersRoutes };
}
