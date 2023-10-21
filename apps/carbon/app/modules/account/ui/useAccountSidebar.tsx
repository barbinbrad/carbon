import type { Route } from "~/types";
import { path } from "~/utils/path";

const accountRoutes: Route[] = [
  {
    name: "Profile",
    to: path.to.profile,
  },
  {
    name: "Personal",
    to: path.to.accountPersonal,
  },
  {
    name: "Password",
    to: path.to.accountPassword,
  },
];

export default function useAccountSidebar() {
  // TODO: filter links based on employee type
  return { links: accountRoutes };
}
