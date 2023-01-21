import type { Database } from "@carbon/database";
import type {
  getAttribute,
  getAttributeCategories,
  getAttributeCategory,
  getCustomers,
  getEmployees,
  getEmployeeTypes,
  getFeatures,
  getPermissionsByEmployeeType,
  getSuppliers,
  getUsers,
} from "~/services/users";

export type Attribute = NonNullable<
  Awaited<ReturnType<typeof getAttribute>>["data"]
>;

export type AttributeCategory = NonNullable<
  Awaited<ReturnType<typeof getAttributeCategories>>["data"]
>[number];

export type AttributeCategoryDetail = NonNullable<
  Awaited<ReturnType<typeof getAttributeCategory>>["data"]
>;

export type AttributeDataType = {
  id: number;
  label: string;
  isBoolean: boolean;
  isDate: boolean;
  isList: boolean;
  isNumeric: boolean;
  isText: boolean;
};

export type Customer = NonNullable<
  Awaited<ReturnType<typeof getCustomers>>["data"]
>[number];

export enum DataType {
  Boolean = 1,
  Date = 2,
  List = 3,
  Numeric = 4,
  Text = 5,
  User = 6,
}

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
    isEmployeeTypeGroup: boolean;
    isCustomerOrgGroup: boolean;
    isCustomerTypeGroup: boolean;
    isSupplierOrgGroup: boolean;
    isSupplierTypeGroup: boolean;
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

export type Supplier = NonNullable<
  Awaited<ReturnType<typeof getSuppliers>>["data"]
>[number];

export type User = NonNullable<
  Awaited<ReturnType<typeof getUsers>>["data"]
>[number];
