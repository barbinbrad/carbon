import type { Route } from "~/types";

const usersRoutes: Record<string, Route[]>[] = [
  {
    Configuration: [
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
  return { links: usersRoutes };
}
