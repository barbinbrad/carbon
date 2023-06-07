import { useMemo } from "react";
import { AiOutlinePartition } from "react-icons/ai";
import { BsCartDash, BsShieldLock } from "react-icons/bs";
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
        icon: <AiOutlinePartition />,
      });
    }

    if (permissions.can("create", "purchasing")) {
      links.push({
        name: "New Purchase Order",
        to: "/x/purchase-order/new",
        icon: <BsCartDash />,
      });
    }

    if (permissions.can("create", "users")) {
      links.push({
        name: "New Employee",
        to: "/x/users/employees/new",
        icon: <BsShieldLock />,
      });
    }

    // if (permissions.can("create", "sales")) {
    //   links.push({
    //     name: "New Customer",
    //     to: "/x/sales/customers/new",
    //   });
    // }

    return links;
  }, [permissions]);

  return result;
}
