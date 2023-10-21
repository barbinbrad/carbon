import { AiOutlineFieldTime, AiOutlinePartition } from "react-icons/ai";
import { BiListCheck, BiMessage } from "react-icons/bi";
import {
  BsCalendar2Week,
  BsCartDash,
  BsCartPlus,
  BsCreditCard,
  BsPeopleFill,
  BsShieldLock,
} from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { HiOutlineCube, HiOutlineDocumentDuplicate } from "react-icons/hi";
import { LuSettings2 } from "react-icons/lu";
import { TbPigMoney } from "react-icons/tb";
import { usePermissions } from "~/hooks";
import type { Authenticated, NavItem } from "~/types";
import { path } from "~/utils/path";

export function useSidebar() {
  const permissions = usePermissions();

  const sidebarItems: Authenticated<NavItem>[] = [
    {
      permission: "parts",
      name: "Parts",
      to: path.to.parts,
      icon: <AiOutlinePartition />,
    },
    {
      permission: "jobs",
      name: "Jobs",
      to: path.to.jobs,
      icon: <BiListCheck />,
    },
    {
      permission: "inventory",
      name: "Inventory",
      to: path.to.inventory,
      icon: <HiOutlineCube />,
    },
    {
      permission: "scheduling",
      name: "Scheduling",
      to: path.to.scheduling,
      icon: <BsCalendar2Week />,
    },
    {
      permission: "timecards",
      name: "Timecards",
      to: path.to.timecards,
      icon: <AiOutlineFieldTime />,
    },
    {
      permission: "sales",
      name: "Sales",
      to: path.to.sales,
      icon: <BsCartPlus />,
    },
    {
      permission: "purchasing",
      name: "Purchasing",
      to: path.to.purchasing,
      icon: <BsCartDash />,
    },
    {
      permission: "documents",
      name: "Documents",
      to: path.to.documents,
      icon: <HiOutlineDocumentDuplicate />,
    },
    {
      permission: "messages",
      name: "Messaging",
      to: path.to.messaging,
      icon: <BiMessage />,
    },
    {
      permission: "accounting",
      name: "Accounting",
      to: path.to.accounting,
      icon: <TbPigMoney />,
    },
    {
      permission: "invoicing",
      name: "Invoicing",
      to: path.to.invoicing,
      icon: <BsCreditCard />,
    },
    {
      permission: "resources",
      name: "Resources",
      to: path.to.resources,
      icon: <BsPeopleFill />,
    },
    {
      permission: "users",
      name: "Users",
      to: path.to.users,
      icon: <BsShieldLock />,
    },
    {
      permission: "settings",
      name: "Settings",
      to: path.to.settings,
      icon: <LuSettings2 />,
    },
    {
      name: "My Account",
      to: path.to.account,
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
