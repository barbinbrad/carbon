import {
  BsBank,
  BsCreditCard,
  BsFillPersonLinesFill,
  BsFillPinMapFill,
  BsTruck,
} from "react-icons/bs";
import { usePermissions } from "~/hooks";
import type { Role } from "~/types";

type Props = {
  contacts: number;
  locations: number;
};

export function useCustomerSidebar({ contacts, locations }: Props) {
  const permissions = usePermissions();
  return [
    {
      name: "Details",
      to: "",
      icon: BsBank,
      shortcut: "Command+Shift+d",
    },
    {
      name: "Contacts",
      to: "contacts",
      role: ["employee"],
      count: contacts,
      icon: BsFillPersonLinesFill,
      shortcut: "Command+Shift+c",
    },
    {
      name: "Locations",
      to: "locations",
      role: ["employee", "customer"],
      count: locations,
      icon: BsFillPinMapFill,
      shortcut: "Command+Shift+l",
    },
    {
      name: "Payments",
      to: "payments",
      role: ["employee"],
      icon: BsCreditCard,
      shortcut: "Command+Shift+p",
    },
    {
      name: "Shipping",
      to: "shipping",
      role: ["employee"],
      icon: BsTruck,
      shortcut: "Command+Shift+s",
    },
  ].filter(
    (item) =>
      item.role === undefined ||
      item.role.some((role) => permissions.is(role as Role))
  );
}
