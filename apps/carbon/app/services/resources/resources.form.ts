import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { DataType } from "~/interfaces/Users/types";

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
