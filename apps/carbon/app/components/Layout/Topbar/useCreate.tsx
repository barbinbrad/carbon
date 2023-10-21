import { useMemo } from "react";
import { AiOutlinePartition } from "react-icons/ai";
import { BsCartDash, BsShieldLock } from "react-icons/bs";
import { IoMdPeople } from "react-icons/io";
import { SiHandshake } from "react-icons/si";
import { usePermissions } from "~/hooks";

import type { Route } from "~/types";
import { path } from "~/utils/path";

export default function useNewMenu(): Route[] {
  const permissions = usePermissions();

  const result = useMemo(() => {
    let links: Route[] = [];
    if (permissions.can("create", "parts")) {
      links.push({
        name: "Part",
        to: path.to.newPart,
        icon: <AiOutlinePartition />,
      });
    }

    if (permissions.can("create", "purchasing")) {
      links.push({
        name: "Purchase Order",
        to: path.to.newPurchaseOrder,
        icon: <BsCartDash />,
      });
    }

    if (permissions.can("create", "purchasing")) {
      links.push({
        name: "Supplier",
        to: path.to.newSupplier,
        icon: <SiHandshake />,
      });
    }

    if (permissions.can("create", "sales")) {
      links.push({
        name: "Customer",
        to: path.to.newCustomer,
        icon: <IoMdPeople />,
      });
    }

    if (permissions.can("create", "users")) {
      links.push({
        name: "Employee",
        to: path.to.newEmployee,
        icon: <BsShieldLock />,
      });
    }

    return links;
  }, [permissions]);

  return result;
}
