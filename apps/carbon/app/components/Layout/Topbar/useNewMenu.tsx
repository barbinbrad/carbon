import { useMemo } from "react";
import { AiOutlinePartition } from "react-icons/ai";
import { BsCartDash, BsShieldLock } from "react-icons/bs";
import { IoMdPeople } from "react-icons/io";
import { SiHandshake } from "react-icons/si";
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

    if (permissions.can("create", "purchasing")) {
      links.push({
        name: "New Supplier",
        to: "/x/purchasing/suppliers/new",
        icon: <SiHandshake />,
      });
    }

    if (permissions.can("create", "sales")) {
      links.push({
        name: "New Customer",
        to: "/x/sales/customers/new",
        icon: <IoMdPeople />,
      });
    }

    if (permissions.can("create", "users")) {
      links.push({
        name: "New Employee",
        to: "/x/users/employees/new",
        icon: <BsShieldLock />,
      });
    }

    return links;
  }, [permissions]);

  return result;
}
