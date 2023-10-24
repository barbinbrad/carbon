import { usePermissions } from "~/hooks";
import type { AuthenticatedRouteGroup } from "~/types";
import { path } from "~/utils/path";

const partsRoutes: AuthenticatedRouteGroup[] = [
  {
    name: "Manage",
    routes: [
      {
        name: "Parts",
        to: path.to.partsSearch,
      },
      {
        name: "Routing",
        to: path.to.routings,
        role: "employee",
      },
    ],
  },
  {
    name: "Configure",
    routes: [
      {
        name: "Part Groups",
        to: path.to.partGroups,
        role: "employee",
      },
      {
        name: "Units of Measure",
        to: path.to.uoms,
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
