import { v4 as uuidv4 } from "uuid";
import type { Feature } from "./features";

export const possibleEmployees = ["Admin", "Project Manager", "Sales"] as const;

export type EmployeeType = typeof possibleEmployees[number];

const employeeTypes = {} as Record<
  EmployeeType,
  { id: string; name: string; protected?: boolean }
>;

possibleEmployees.forEach((type) => {
  employeeTypes[type] = {
    id: uuidv4(),
    name: type,
    protected: type === "Admin",
  };
});

export { employeeTypes };
export const employeeTypePermissionsDefinitions: Record<
  EmployeeType,
  Record<
    Feature,
    { create: boolean; update: boolean; delete: boolean; view: boolean }
  >
> = {
  Admin: {
    Accounting: {
      create: true,
      update: true,
      delete: true,
      view: true,
    },
    Parts: {
      create: true,
      update: true,
      delete: true,
      view: true,
    },
    Jobs: {
      create: true,
      update: true,
      delete: true,
      view: true,
    },
    Inventory: {
      create: true,
      update: true,
      delete: true,
      view: true,
    },
    Scheduling: {
      create: true,
      update: true,
      delete: true,
      view: true,
    },
    Sales: {
      create: true,
      update: true,
      delete: true,
      view: true,
    },
    Purchasing: {
      create: true,
      update: true,
      delete: true,
      view: true,
    },
    Documents: {
      create: true,
      update: true,
      delete: true,
      view: true,
    },
    Messaging: {
      create: true,
      update: true,
      delete: true,
      view: true,
    },
    Timecards: {
      create: true,
      update: true,
      delete: true,
      view: true,
    },
    Resources: {
      create: true,
      update: true,
      delete: true,
      view: true,
    },
    Users: {
      create: true,
      update: true,
      delete: true,
      view: true,
    },
    Settings: {
      create: true,
      update: true,
      delete: true,
      view: true,
    },
  },
  "Project Manager": {
    Accounting: {
      create: false,
      update: false,
      delete: false,
      view: false,
    },
    Parts: {
      create: true,
      update: true,
      delete: true,
      view: true,
    },
    Jobs: {
      create: true,
      update: true,
      delete: true,
      view: true,
    },
    Inventory: {
      create: false,
      update: false,
      delete: false,
      view: true,
    },
    Scheduling: {
      create: true,
      update: true,
      delete: true,
      view: true,
    },
    Sales: {
      create: false,
      update: false,
      delete: false,
      view: false,
    },
    Purchasing: {
      create: false,
      update: false,
      delete: false,
      view: false,
    },
    Documents: {
      create: true,
      update: true,
      delete: true,
      view: true,
    },
    Messaging: {
      create: true,
      update: true,
      delete: true,
      view: true,
    },
    Timecards: {
      create: false,
      update: false,
      delete: false,
      view: true,
    },
    Resources: {
      create: true,
      update: true,
      delete: true,
      view: true,
    },
    Users: {
      create: false,
      update: false,
      delete: false,
      view: false,
    },
    Settings: {
      create: false,
      update: false,
      delete: false,
      view: false,
    },
  },
  Sales: {
    Accounting: {
      create: false,
      update: false,
      delete: false,
      view: false,
    },
    Parts: {
      create: false,
      update: false,
      delete: false,
      view: true,
    },
    Jobs: {
      create: false,
      update: false,
      delete: false,
      view: true,
    },
    Inventory: {
      create: false,
      update: false,
      delete: false,
      view: true,
    },
    Scheduling: {
      create: false,
      update: false,
      delete: false,
      view: true,
    },
    Sales: {
      create: true,
      update: true,
      delete: true,
      view: true,
    },
    Purchasing: {
      create: false,
      update: false,
      delete: false,
      view: false,
    },
    Documents: {
      create: true,
      update: true,
      delete: true,
      view: true,
    },
    Messaging: {
      create: true,
      update: true,
      delete: true,
      view: true,
    },
    Timecards: {
      create: false,
      update: false,
      delete: false,
      view: false,
    },
    Resources: {
      create: false,
      update: false,
      delete: false,
      view: false,
    },
    Users: {
      create: false,
      update: false,
      delete: false,
      view: false,
    },
    Settings: {
      create: false,
      update: false,
      delete: false,
      view: false,
    },
  },
};
