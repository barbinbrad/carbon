import type { PartReplenishmentSystem } from "~/modules/parts/types";

export function usePartSidebar(replenishment: PartReplenishmentSystem) {
  return [
    {
      name: "Part Basics",
      to: "basics",
    },
    {
      name: "Purchasing",
      to: "purchasing",
      isDisabled: replenishment === "Manufactured",
    },
    {
      name: "Manufacturing",
      to: "manufacturing",
      isDisabled: replenishment === "Purchased",
    },
    {
      name: "Costing",
      to: "costing",
    },
    {
      name: "Planning",
      to: "planning",
    },
    {
      name: "Inventory",
      to: "inventory",
    },
    {
      name: "Sale Price",
      to: "sale-price",
    },
  ].filter((item) => !item.isDisabled);
}
