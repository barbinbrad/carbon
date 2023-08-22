import { usePermissions } from "~/hooks";
import type { AuthenticatedRouteGroup } from "~/types";

const settingsRoutes: AuthenticatedRouteGroup[] = [
  {
    name: "Configure",
    routes: [
      {
        name: "Sequences",
        to: "/x/settings/sequences",
        role: "employee",
      },
    ],
  },
];

export default function usePurchasingSidebar() {
  const permissions = usePermissions();
  return {
    groups: settingsRoutes
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
