import { usePermissions } from "~/hooks";
import type { AuthenticatedRouteGroup } from "~/types";

const partsRoutes: AuthenticatedRouteGroup[] = [
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
        role: "employee",
      },
    ],
  },
  {
    name: "Configure",
    routes: [
      {
        name: "Part Groups",
        to: "/x/parts/groups",
        role: "employee",
      },
      {
        name: "Units of Measure",
        to: "/x/parts/uom",
        role: "employee",
      },
    ],
  },
];

export default function usePartsSidebar() {
  const permissions = usePermissions();
  return {
    groups: partsRoutes
      .filter((group) => {
        const filteredRoutes = group.routes.filter((route) => {
          if (route.role) {
            return permissions.is(route.role);
          } else {
            return true;
          }
        });

        return filteredRoutes.length > 0;
      })
      .map((group) => ({
        ...group,
        routes: group.routes.filter((route) => {
          if (route.role) {
            return permissions.is(route.role);
          } else {
            return true;
          }
        }),
      })),
  };
}
