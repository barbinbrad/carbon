import { BsKeyFill, BsPaletteFill, BsShieldLock } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import type { Route } from "~/types";
import { path } from "~/utils/path";

const accountRoutes: Route[] = [
  {
    name: "Profile",
    to: path.to.profile,
    icon: <CgProfile />,
  },
  {
    name: "Personal",
    to: path.to.accountPersonal,
    icon: <BsShieldLock />,
  },
  {
    name: "Password",
    to: path.to.accountPassword,
    icon: <BsKeyFill />,
  },
  {
    name: "Theme",
    to: path.to.theme,
    icon: <BsPaletteFill />,
  },
];

export default function useAccountSubmodules() {
  return { links: accountRoutes };
}
