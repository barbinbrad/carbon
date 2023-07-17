import type { Authenticated, NavItem } from "~/types";
import { AiOutlinePartition, AiOutlineFieldTime } from "react-icons/ai";
import { BiListCheck, BiMessage } from "react-icons/bi";
import {
  BsCalendar2Week,
  BsCartDash,
  BsCartPlus,
  BsPeopleFill,
  BsShieldLock,
} from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { HiOutlineCube, HiOutlineDocumentDuplicate } from "react-icons/hi";
import { LuSettings2 } from "react-icons/lu";
import { TbPigMoney } from "react-icons/tb";
import { usePermissions } from "~/hooks";

export function useSidebar() {
  const permissions = usePermissions();

  const sidebarItems: Authenticated<NavItem>[] = [
    {
      permission: "parts",
      name: "Parts",
      to: "/x/parts",
      icon: <AiOutlinePartition />,
    },
    {
      permission: "jobs",
      name: "Jobs",
      to: "/x/jobs",
      icon: <BiListCheck />,
    },
    {
      permission: "inventory",
      name: "Inventory",
      to: "/x/inventory",
      icon: <HiOutlineCube />,
    },
    {
      permission: "scheduling",
      name: "Scheduling",
      to: "/x/scheduling",
      icon: <BsCalendar2Week />,
    },
    {
      permission: "timecards",
      name: "Timecards",
      to: "/x/timecards",
      icon: <AiOutlineFieldTime />,
    },
    {
      permission: "sales",
      name: "Sales",
      to: "/x/sales",
      icon: <BsCartPlus />,
    },
    {
      permission: "purchasing",
      name: "Purchasing",
      to: "/x/purchasing",
      icon: <BsCartDash />,
    },
    {
      permission: "documents",
      name: "Documents",
      to: "/x/documents",
      icon: <HiOutlineDocumentDuplicate />,
    },
    {
      permission: "messages",
      name: "Messaging",
      to: "/x/messaging",
      icon: <BiMessage />,
    },
    {
      permission: "accounting",
      name: "Accounting",
      to: "/x/accounting",
      icon: <TbPigMoney />,
    },
    {
      permission: "resources",
      name: "Resources",
      to: "/x/resources",
      icon: <BsPeopleFill />,
    },
    {
      permission: "users",
      name: "Users",
      to: "/x/users",
      icon: <BsShieldLock />,
    },
    {
      permission: "settings",
      name: "Settings",
      to: "/x/settings",
      icon: <LuSettings2 />,
    },
    {
      name: "My Account",
      to: "/x/account",
      icon: <CgProfile />,
    },
  ];

  return sidebarItems.filter((item) => {
    if (item.permission) {
      return permissions.can("view", item.permission);
    } else {
      return true;
    }
  });
}
