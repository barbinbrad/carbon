import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

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

export const userPermissionsValidator = z.object({
  view: z.boolean(),
  create: z.boolean(),
  update: z.boolean(),
  delete: z.boolean(),
});

export const groupValidator = withZod(
  z.object({
    id: z.string(),
    name: z.string().min(1, { message: "Name is required" }),
    selections: z
      .array(z.string().min(36, { message: "Invalid selection" }))
      .min(1, { message: "Group members are required" }),
  })
);
