import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { DataType } from "~/interfaces/Users/types";

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
    })
    .refine((schema) => schema.shadowWeeks <= schema.weeks, {
      message: "name is required when you send color on request",
    })
);

export const abilityTitleValidator = withZod(
  z.object({
    id: z.string().min(20),
    title: z.string().min(1, { message: "Title is required" }),
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

export const noteValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    note: z.string().min(1, { message: "Note is required" }),
  })
);

export const updateAbilityValidator = withZod(
  z.object({
    id: z.string().min(20),
    data: z
      .string()
      .startsWith("{", { message: "Invalid JSON" })
      .endsWith("}", { message: "Invalid JSON" }),
  })
);
