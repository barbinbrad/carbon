import { useMatches } from "@remix-run/react";
import { IoHomeSharp } from "react-icons/io5";
import type { Route } from "~/types";

export default function useBreadcrumbs(): Route[] {
  const matches = useMatches();

  const result = matches.reduce<Route[]>((acc, match) => {
    switch (match.id) {
      case "root":
        return acc.concat({ to: "/app", name: "Home", icon: <IoHomeSharp /> });
      case "routes/app.account":
        return acc.concat({
          name: "Account",
          to: match.pathname,
        });
      case "routes/app.account.profile":
        return acc.concat({
          name: "Profile",
          to: match.pathname,
        });
      case "routes/app.account.personal":
        return acc.concat({
          name: "Personal",
          to: match.pathname,
        });
      case "routes/app.account.password":
        return acc.concat({
          name: "Password",
          to: match.pathname,
        });
      case "routes/app.account.notifications":
        return acc.concat({
          name: "Notifications",
          to: match.pathname,
        });
      case "routes/app.account.security":
        return acc.concat({
          name: "Security",
          to: match.pathname,
        });
      case "routes/app.account.settings":
        return acc.concat({
          name: "Settings",
          to: match.pathname,
        });
      case "routes/app.parts":
        return acc.concat({
          name: "Parts",
          to: match.pathname,
        });
      case "routes/app.people":
        return acc.concat({
          name: "People",
          to: match.pathname,
        });
      case "routes/app.people.attributes":
        return acc.concat({
          name: "Attributes",
          to: match.pathname,
        });
      case "routes/app.purchasing":
        return acc.concat({
          name: "Purchasing",
          to: match.pathname,
        });
      case "routes/app.purchasing.suppliers":
        return acc.concat({
          name: "Suppliers",
          to: match.pathname,
        });
      case "routes/app.purchasing.supplier-types":
        return acc.concat({
          name: "Supplier Types",
          to: match.pathname,
        });
      case "routes/app.sales":
        return acc.concat({
          name: "Sales",
          to: match.pathname,
        });
      case "routes/app.sales.customers":
        return acc.concat({
          name: "Customers",
          to: match.pathname,
        });
      case "routes/app.sales.customer-types":
        return acc.concat({
          name: "Customer Types",
          to: match.pathname,
        });
      case "routes/app.users":
        return acc.concat({
          name: "Users",
          to: match.pathname,
        });
      case "routes/app.users.attributes":
        return acc.concat({
          name: "Attributes",
          to: match.pathname,
        });
      case "routes/app.users.employees":
        return acc.concat({
          name: "Employees",
          to: match.pathname,
        });
      case "routes/app.users.employee-types":
        return acc.concat({
          name: "Employee Types",
          to: match.pathname,
        });
      case "routes/app.users.customers":
        return acc.concat({
          name: "Customers",
          to: match.pathname,
        });
      case "routes/app.users.suppliers":
        return acc.concat({
          name: "Suppliers",
          to: match.pathname,
        });
      case "routes/app.users.groups":
        return acc.concat({
          name: "Groups",
          to: match.pathname,
        });
      case "routes/app.users.$personId":
        return acc.concat({
          name: match.params.personId!,
          to: `app.users.${match.params.personId}`,
        });
      case "routes/app.users.new":
        return acc.concat({
          name: "New",
          to: match.pathname,
        });
      default:
        // don't include unspecified matches
        return acc;
    }
  }, []);

  return result;
}
