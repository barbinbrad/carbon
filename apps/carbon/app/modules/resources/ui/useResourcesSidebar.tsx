import type { RouteGroup } from "~/types";
import { path } from "~/utils/path";

const resourcesRoutes: RouteGroup[] = [
  {
    name: "Manage",
    routes: [
      {
        name: "People",
        to: path.to.people,
      },
      {
        name: "Contractors",
        to: path.to.contractors,
      },
      {
        name: "Equipment",
        to: path.to.equipment,
      },
      {
        name: "Partners",
        to: path.to.partners,
      },
      {
        name: "Work Cells",
        to: path.to.workCells,
      },
    ],
  },
  {
    name: "Configure",
    routes: [
      {
        name: "Abilities",
        to: path.to.abilities,
      },
      {
        name: "Attributes",
        to: path.to.attributes,
      },
      {
        name: "Departments",
        to: path.to.departments,
      },
      {
        name: "Holidays",
        to: path.to.holidays,
      },
      {
        name: "Locations",
        to: path.to.locations,
      },
      {
        name: "Shifts",
        to: path.to.shifts,
      },
    ],
  },
];

export default function useResourcesSidebar() {
  return { groups: resourcesRoutes };
}
