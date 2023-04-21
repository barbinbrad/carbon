import { usePermissions } from "~/hooks";
import type { PartReplenishmentSystem } from "~/modules/parts/types";
import type { Role } from "~/types";

export function usePartSidebar(replenishment: PartReplenishmentSystem) {
  const permissions = usePermissions();
  return [
    {
      name: "Part Basics",
      to: "",
    },
    {
      name: "Purchasing",
      to: "purchasing",
      isDisabled: replenishment === "Manufactured",
      role: ["employee", "supplier"],
    },
    {
      name: "Manufacturing",
      to: "manufacturing",
      isDisabled: replenishment === "Purchased",
      role: ["employee"],
    },
    {
      name: "Costing",
      to: "costing",
      role: ["employee", "supplier"],
    },
    {
      name: "Planning",
      to: "planning",
      role: ["employee"],
    },
    {
      name: "Inventory",
      to: "inventory",
      role: ["employee"],
    },
    {
      name: "Sale Price",
      to: "sale-price",
      role: ["employee", "customer"],
    },
  ].filter(
    (item) =>
      !item.isDisabled &&
      (item.role === undefined ||
        item.role.some((role) => permissions.is(role as Role)))
  );
}
