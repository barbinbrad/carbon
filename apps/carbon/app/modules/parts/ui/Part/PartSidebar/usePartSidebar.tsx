import { BiListCheck } from "react-icons/bi";
import { BsBank, BsBarChartLineFill, BsCartDash } from "react-icons/bs";
import { HiOutlineCube } from "react-icons/hi";
import { IoPricetagsOutline } from "react-icons/io5";
import { PiMoneyFill, PiShareNetworkFill } from "react-icons/pi";
import { usePermissions } from "~/hooks";
import type { PartReplenishmentSystem } from "~/modules/parts/types";
import type { Role } from "~/types";

export function usePartSidebar(replenishment: PartReplenishmentSystem) {
  const permissions = usePermissions();
  return [
    {
      name: "Details",
      to: "",
      icon: BsBank,
      shortcut: "Command+Shift+d",
    },
    {
      name: "Purchasing",
      to: "purchasing",
      isDisabled: replenishment === "Make",
      role: ["employee", "supplier"],
      icon: BsCartDash,
      shortcut: "Command+Shift+p",
    },
    {
      name: "Suppliers",
      to: "suppliers",
      isDisabled: replenishment === "Make",
      role: ["employee", "supplier"],
      icon: PiShareNetworkFill,
      shortcut: "Command+Shift+s",
    },
    {
      name: "Manufacturing",
      to: "manufacturing",
      isDisabled: replenishment === "Buy",
      role: ["employee"],
      icon: BiListCheck,
      shortcut: "Command+Shift+m",
    },
    {
      name: "Costing",
      to: "costing",
      role: ["employee", "supplier"],
      icon: IoPricetagsOutline,
      shortcut: "Command+Shift+c",
    },
    {
      name: "Planning",
      to: "planning",
      role: ["employee"],
      icon: BsBarChartLineFill,
      shortcut: "Command+Shift+p",
    },
    {
      name: "Inventory",
      to: "inventory",
      role: ["employee", "supplier"],
      icon: HiOutlineCube,
      shortcut: "Command+Shift+i",
    },
    {
      name: "Sale Price",
      to: "sale-price",
      role: ["employee", "customer"],
      icon: PiMoneyFill,
      shortcut: "Command+Shift+x",
    },
  ].filter(
    (item) =>
      !item.isDisabled &&
      (item.role === undefined ||
        item.role.some((role) => permissions.is(role as Role)))
  );
}
