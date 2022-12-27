import type { Authenticated, NavItem } from "~/types";
import { AiOutlinePartition, AiOutlineFieldTime } from "react-icons/ai";
import { BiListCheck, BiMessage } from "react-icons/bi";
import {
  BsCalendar2Week,
  BsCartDash,
  BsCartPlus,
  BsShieldLock,
} from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { GoSettings } from "react-icons/go";
import { HiOutlineCube, HiOutlineDocumentDuplicate } from "react-icons/hi";
import { SiHandshake } from "react-icons/si";
import { usePermissions } from "~/hooks";

const sidebarItems: Authenticated<NavItem>[] = [
  {
    permission: "parts",
    name: "Parts",
    to: "/app/parts",
    icon: <AiOutlinePartition />,
  },
  {
    permission: "jobs",
    name: "Jobs",
    to: "/app/jobs",
    icon: <BiListCheck />,
  },
  {
    permission: "inventory",
    name: "Inventory",
    to: "/app/inventory",
    icon: <HiOutlineCube />,
  },
  {
    permission: "scheduling",
    name: "Scheduling",
    to: "/app/scheduling",
    icon: <BsCalendar2Week />,
  },
  {
    permission: "timecards",
    name: "Timecards",
    to: "/app/timecards",
    icon: <AiOutlineFieldTime />,
  },
  {
    permission: "orders",
    name: "Orders",
    to: "/app/orders",
    icon: <BsCartPlus />,
  },
  {
    permission: "purchasing",
    name: "Purchasing",
    to: "/app/purchasing",
    icon: <BsCartDash />,
  },
  {
    permission: "documents",
    name: "Documents",
    to: "/app/documents",
    icon: <HiOutlineDocumentDuplicate />,
  },
  {
    permission: "messages",
    name: "Messaging",
    to: "/app/messaging",
    icon: <BiMessage />,
  },
  {
    permission: "partners",
    name: "Partners",
    to: "/app/partners",
    icon: <SiHandshake />,
  },
  {
    permission: "users",
    name: "Users",
    to: "/app/users",
    icon: <BsShieldLock />,
  },
  {
    permission: "settings",
    name: "Settings",
    to: "/app/settings",
    icon: <GoSettings />,
  },
  {
    name: "My Account",
    to: "/app/account",
    icon: <CgProfile />,
  },
];

export function useSidebar() {
  const permissions = usePermissions();
  return sidebarItems.filter((item) => {
    if (item.permission) {
      return permissions.can("view", item.permission);
    } else {
      return true;
    }
  });
}
