import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { DataType } from "~/modules/users";

export const abilityValidator = withZod(
  z
    .object({
      name: z.string().min(1, { message: "Name is required" }),
      startingPoint: zfd.numeric(
        z.number().min(0, { message: "Learning curve is required" })
      ),
      weeks: zfd.numeric(z.number().min(0, { message: "Weeks is required" })),
      shadowWeeks: zfd.numeric(
        z.number().min(0, { message: "Shadow is required" })
      ),
      employees: z
        .array(z.string().min(36, { message: "Invalid selection" }))
        .min(1, { message: "Group members are required" })
        .optional(),
    })
    .refine((schema) => schema.shadowWeeks <= schema.weeks, {
      message: "name is required when you send color on request",
    })
);

export const abilityCurveValidator = withZod(
  z.object({
    data: z
      .string()
      .startsWith("[", { message: "Invalid JSON" })
      .endsWith("]", { message: "Invalid JSON" }),
    shadowWeeks: zfd.numeric(
      z.number().min(0, { message: "Time shadowing is required" })
    ),
  })
);

export const abilityNameValidator = withZod(
  z.object({
    name: z.string().min(1, { message: "Name is required" }),
  })
);

export const attributeValidator = withZod(
  z
    .object({
      id: zfd.text(z.string().optional()),
      name: z.string().min(1, { message: "Name is required" }),
      userAttributeCategoryId: z.string().min(20),
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
    id: zfd.text(z.string().optional()),
    name: z.string().min(1, { message: "Name is required" }),
    isPublic: zfd.checkbox(),
  })
);

export const departmentValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    name: z.string().min(1, { message: "Name is required" }),
    color: z.string(),
    parentDepartmentId: zfd.text(z.string().optional()),
  })
);

export const employeeAbilityValidator = withZod(
  z.object({
    employeeId: z.string().min(36, { message: "Employee is required" }),
    trainingStatus: z.string().min(1, { message: "Status is required" }),
    trainingPercent: zfd.numeric(z.number().optional()),
    trainingDays: zfd.numeric(z.number().optional()),
  })
);

export const employeeJobValidator = withZod(
  z.object({
    title: z.string().min(1, { message: "Title is required" }),
    startDate: zfd.text(z.string().optional()),
    locationId: zfd.text(z.string().optional()),
    shiftId: zfd.text(z.string().optional()),
    managerId: zfd.text(z.string().optional()),
  })
);

export const equipmentValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string(),
    equipmentTypeId: z.string().min(1, { message: "Type is required" }),
    operatorsRequired: zfd.numeric(z.number().optional()),
    locationId: z.string().min(1, { message: "Location is required" }),
    workCellId: zfd.text(z.string().optional()),
    setupHours: zfd.numeric(z.number().optional()),
  })
);

export const equipmentTypeValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string(),
    color: z.string(),
    requiredAbility: zfd.text(z.string().optional()),
  })
);

export const holidayValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    name: z.string().min(1, { message: "Name is required" }),
    date: z.string().min(1, { message: "Date is required" }),
  })
);

export const locationValidator = withZod(
  z
    .object({
      id: zfd.text(z.string().optional()),
      name: z.string().min(1, { message: "Name is required" }),
      timezone: z.string().min(1, { message: "Timezone is required" }),
      latitude: zfd.numeric(z.number().optional()),
      longitude: zfd.numeric(z.number().optional()),
    })
    .superRefine(({ latitude, longitude }, ctx) => {
      if ((latitude && !longitude) || (!latitude && longitude)) {
        ctx.addIssue({
          code: "custom",
          message: "Both latitude and longitude are required",
        });
      }
    })
);

export const noteValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    note: z.string().min(1, { message: "Note is required" }),
  })
);

export const partnerValidator = withZod(
  z.object({
    id: z.string().min(20, { message: "Partner is required" }),
    hoursPerWeek: zfd.numeric(
      z.number().min(0, { message: "Hours are required" })
    ),
  })
);

export const shiftValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    name: z.string().min(1, { message: "Name is required" }),
    startTime: z.string().min(1, { message: "Start time is required" }),
    endTime: z.string().min(1, { message: "End time is required" }),
    locationId: z.string().min(1, { message: "Location is required" }),
    monday: zfd.checkbox(),
    tuesday: zfd.checkbox(),
    wednesday: zfd.checkbox(),
    thursday: zfd.checkbox(),
    friday: zfd.checkbox(),
    saturday: zfd.checkbox(),
    sunday: zfd.checkbox(),
  })
);

export const workCellValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string(),
    departmentId: z.string().min(1, { message: "Department is required" }),
    locationId: z.string().min(1, { message: "Location is required" }),
    workCellTypeId: z.string().min(1, { message: "Type is required" }),
    activeDate: zfd.text(z.string().optional()),
  })
);

export const workCellTypeValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string(),
    color: z.string(),
    requiredAbility: zfd.text(z.string().optional()),
  })
);
