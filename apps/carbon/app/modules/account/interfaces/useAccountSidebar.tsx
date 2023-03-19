import type { Route } from "~/types";

const accountRoutes: Route[] = [
  {
    name: "Profile",
    to: "/x/account/profile",
  },
  {
    name: "Personal",
    to: "/x/account/personal",
  },
  {
    name: "Password",
    to: "/x/account/password",
  },
  // {
  //   name: "Notifications",
  //   to: "/x/account/notifications",
  // },
  // {
  //   name: "Security",
  //   to: "/x/account/security",
  // },
  // {
  //   name: "Settings",
  //   to: "/x/account/settings",
  // },
];

export default function useAccountSidebar() {
  // TODO: filter links based on employee type
  return { links: accountRoutes };
}
