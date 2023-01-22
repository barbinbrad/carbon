import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { DataType } from "~/interfaces/Users/types";

export const attributeValidator = withZod(
  z
    .object({
      id: zfd.numeric(z.number().optional()),
      name: z.string().min(1, { message: "Name is required" }),
      userAttributeCategoryId: zfd.numeric(),
      attributeDataTypeId: zfd.numeric(),
      listOptions: z.string().min(1).array().optional(),
      canSelfManage: zfd.checkbox(),
    })
    .refine((input) => {
      // allows bar to be optional only when foo is 'foo'
      if (
        input.attributeDataTypeId === DataType.List &&
        (input.listOptions === undefined ||
          input.listOptions.length === 0 ||
          input.listOptions.some((option) => option.length === 0))
      )
        return false;

      return true;
    })
);

export const attributeCategoryValidator = withZod(
  z.object({
    id: zfd.numeric(z.number().optional()),
    name: z.string().min(1, { message: "Name is required" }),
    isPublic: zfd.checkbox(),
  })
);

export const bulkPermissionsValidator = withZod(
  z.object({
    editType: z.string().min(1, { message: "Update type is required" }),
    userIds: z
      .array(z.string().min(36, { message: "Invalid selection" }))
      .min(1, { message: "Group members are required" }),
    data: z
      .string()
      .startsWith("{", { message: "Invalid JSON" })
      .endsWith("}", { message: "Invalid JSON" }),
  })
);

export const createCustomerValidator = withZod(
  z.object({
    id: z.string().min(36, "Customer contact is required"),
    customer: z.string().min(36, { message: "Customer is required" }),
  })
);

export const createEmployeeValidator = withZod(
  z.object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email("Must be a valid email"),
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    employeeType: z.string().min(36, { message: "Employee type is required" }),
  })
);

export const createSupplierValidator = withZod(
  z.object({
    id: z.string().min(36, "Supplier contact is required"),
    supplier: z.string().min(36, { message: "Supplier is required" }),
  })
);

export const deactivateUsersValidator = withZod(
  z.object({
    redirectTo: z.string(),
    users: z
      .array(z.string().min(36, { message: "Invalid user id" }))
      .min(1, { message: "Group members are required" }),
  })
);

export const employeeTypeValidator = withZod(
  z.object({
    id: z.string(),
    name: z.string().min(1, { message: "Name is required" }),
    color: z.string(),
    data: z
      .string()
      .startsWith("[", { message: "Invalid JSON" })
      .endsWith("]", { message: "Invalid JSON" }),
  })
);

export const employeeTypePermissionsValidator = z.array(
  z.object({
    id: z.string(),
    permission: z.object({
      view: z.boolean(),
      create: z.boolean(),
      update: z.boolean(),
      delete: z.boolean(),
    }),
  })
);

export const employeeValidator = withZod(
  z.object({
    id: z.string(),
    employeeType: z.string().min(36, { message: "Employee type is required" }),
    data: z
      .string()
      .startsWith("{", { message: "Invalid JSON" })
      .endsWith("}", { message: "Invalid JSON" }),
  })
);

export const groupValidator = withZod(
  z.object({
    id: z.string(),
    name: z.string().min(1, { message: "Name is required" }),
    selections: z
      .array(z.string().min(36, { message: "Invalid selection" }))
      .min(1, { message: "Group members are required" }),
  })
);

export const resendInviteValidator = withZod(
  z.object({
    users: z
      .array(z.string().min(36, { message: "Invalid user id" }))
      .min(1, { message: "Group members are required" }),
  })
);

export const userPermissionsValidator = z.object({
  view: z.boolean(),
  create: z.boolean(),
  update: z.boolean(),
  delete: z.boolean(),
});
