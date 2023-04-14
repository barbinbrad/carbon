import { useMatches } from "@remix-run/react";

import type { Route } from "~/types";

export default function useBreadcrumbs(): Route[] {
  const matches = useMatches();

  const result = matches.reduce<Route[]>((acc, match) => {
    switch (match.id) {
      case "routes/x+/account+/_layout":
        return acc.concat({
          name: "Account",
          to: match.pathname,
        });
      case "routes/x+/account+/profile":
        return acc.concat({
          name: "Profile",
          to: match.pathname,
        });
      case "routes/x+/account+/personal":
        return acc.concat({
          name: "Personal",
          to: match.pathname,
        });
      case "routes/x+/account+/password":
        return acc.concat({
          name: "Password",
          to: match.pathname,
        });
      case "routes/x+/account+/notifications":
        return acc.concat({
          name: "Notifications",
          to: match.pathname,
        });
      case "routes/x+/account+/security":
        return acc.concat({
          name: "Security",
          to: match.pathname,
        });
      case "routes/x+/account+/settings":
        return acc.concat({
          name: "Settings",
          to: match.pathname,
        });
      case "routes/x+/accounting+/_layout":
        return acc.concat({
          name: "Accounting",
          to: match.pathname,
        });
      case "routes/x+/parts+/index":
        return acc.concat({
          name: "Parts",
          to: match.pathname,
        });
      case "routes/x+/resources+/_layout":
        return acc.concat({
          name: "Resources",
          to: match.pathname,
        });
      case "routes/x+/part+/_layout":
      case "routes/x+/parts+/_layout":
        return acc.concat({
          name: "Parts",
          to: match.pathname,
        });
      case "routes/x+/parts+/accounts":
        return acc.concat({
          name: "Accounts",
          to: match.pathname,
        });
      case "routes/x+/parts+/configurator":
        return acc.concat({
          name: "Configurator",
          to: match.pathname,
        });
      case "routes/x+/parts+/groups":
        return acc.concat({
          name: "Groups",
          to: match.pathname,
        });
      case "routes/x+/resources+/abilities":
        return acc.concat({
          name: "Abilities",
          to: match.pathname,
        });
      case "routes/x+/resources+/ability.$abilityId":
        return acc.concat({
          name: "Abilities",
          to: "/x/resources/abilities",
        });
      case "routes/x+/resources+/attributes":
        return acc.concat({
          name: "Attributes",
          to: match.pathname,
        });
      case "routes/x+/resources+/contractors":
        return acc.concat({
          name: "Contractors",
          to: match.pathname,
        });
      case "routes/x+/resources+/departments":
        return acc.concat({
          name: "Departments",
          to: match.pathname,
        });
      case "routes/x+/resources+/equipment":
        return acc.concat({
          name: "Equipment",
          to: match.pathname,
        });
      case "routes/x+/resources+/holidays":
        return acc.concat({
          name: "Holidays",
          to: match.pathname,
        });
      case "routes/x+/resources+/locations":
        return acc.concat({
          name: "Locations",
          to: match.pathname,
        });
      case "routes/x+/resources+/partners":
        return acc.concat({
          name: "Partners",
          to: match.pathname,
        });
      case "routes/x+/resources+/people":
        return acc.concat({
          name: "People",
          to: match.pathname,
        });
      case "routes/x+/resources+/person.$personId":
        return acc.concat({
          name: "People",
          to: "/x/resources/people",
        });

      case "routes/x+/resources+/shifts":
        return acc.concat({
          name: "Shifts",
          to: match.pathname,
        });
      case "routes/x+/resources+/work-cells":
        return acc.concat({
          name: "Work Cells",
          to: match.pathname,
        });
      case "routes/x+/purchasing+/_layout":
        return acc.concat({
          name: "Purchasing",
          to: match.pathname,
        });
      case "routes/x+/purchasing+/suppliers":
        return acc.concat({
          name: "Suppliers",
          to: match.pathname,
        });
      case "routes/x+/purchasing+/supplier-types":
        return acc.concat({
          name: "Supplier Types",
          to: match.pathname,
        });
      case "routes/x+/sales+/_layout":
        return acc.concat({
          name: "Sales",
          to: match.pathname,
        });
      case "routes/x+/sales+/customers":
        return acc.concat({
          name: "Customers",
          to: match.pathname,
        });
      case "routes/x+/sales+/customer-types":
        return acc.concat({
          name: "Customer Types",
          to: match.pathname,
        });
      case "routes/x+/users+/_layout":
        return acc.concat({
          name: "Users",
          to: match.pathname,
        });
      case "routes/x+/users+/attributes":
        return acc.concat({
          name: "Attributes",
          to: match.pathname,
        });
      case "routes/x+/users+/employees":
        return acc.concat({
          name: "Employees",
          to: match.pathname,
        });
      case "routes/x+/users+/employee-types":
        return acc.concat({
          name: "Employee Types",
          to: match.pathname,
        });
      case "routes/x+/users+/customers":
        return acc.concat({
          name: "Customers",
          to: match.pathname,
        });
      case "routes/x+/users+/suppliers":
        return acc.concat({
          name: "Suppliers",
          to: match.pathname,
        });
      case "routes/x+/users+/groups":
        return acc.concat({
          name: "Groups",
          to: match.pathname,
        });
      case "routes/x+/users+/new":
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
