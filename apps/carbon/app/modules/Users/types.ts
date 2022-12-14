import type { Database } from "@carbon/database";
import type {
  getEmployees,
  getEmployeeTypes,
  getFeatures,
  getPermissionsByEmployeeType,
  getUsers,
} from "~/services/users";

export type Employee = NonNullable<
  Awaited<ReturnType<typeof getEmployees>>["data"]
>[number];

export type EmployeeRow = Database["public"]["Tables"]["employee"]["Row"];

export type EmployeeTypePermission = NonNullable<
  Awaited<ReturnType<typeof getPermissionsByEmployeeType>>["data"]
>[number];

export type EmployeeType = NonNullable<
  Awaited<ReturnType<typeof getEmployeeTypes>>["data"]
>[number];

export type Feature = NonNullable<
  Awaited<ReturnType<typeof getFeatures>>["data"]
>[number];

export type Group = {
  data: {
    id: string;
    name: string;
    users: User[];
  };
  children: Group[];
};

export type Permission = {
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
};

export type User = NonNullable<
  Awaited<ReturnType<typeof getUsers>>["data"]
>[number];
