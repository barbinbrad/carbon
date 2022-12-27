import type { Route } from "~/types";

const accountRoutes: Route[] = [
  {
    name: "Profile",
    to: "/app/account/profile",
  },
  {
    name: "Personal",
    to: "/app/account/personal",
  },
  {
    name: "Password",
    to: "/app/account/password",
  },
  // {
  //   name: "Notifications",
  //   to: "/app/account/notifications",
  // },
  // {
  //   name: "Security",
  //   to: "/app/account/security",
  // },
  // {
  //   name: "Settings",
  //   to: "/app/account/settings",
  // },
];

export default function useAccountSidebar() {
  // TODO: filter links based on employee type
  return { links: accountRoutes };
}
