import { useMemo } from "react";
import { usePermissions } from "~/hooks";

import type { Route } from "~/types";

export default function useNewMenu(): Route[] {
  const permissions = usePermissions();

  const result = useMemo(() => {
    let links: Route[] = [];
    if (permissions.can("create", "parts")) {
      links.push({
        name: "New Part",
        to: "/x/part/new",
      });
    }

    if (permissions.can("create", "users")) {
      links.push({
        name: "New Employee",
        to: "/x/users/employees/new",
      });
    }

    if (permissions.can("create", "sales")) {
      links.push({
        name: "New Customer",
        to: "/x/sales/customers/new",
      });
    }

    if (permissions.can("create", "purchasing")) {
      links.push({
        name: "New Supplier",
        to: "/x/purchasing/suppliers/new",
      });
    }

    return links;
  }, [permissions]);

  return result;
}
