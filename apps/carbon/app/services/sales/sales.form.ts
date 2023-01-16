import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const customerValidator = withZod(
  z.object({
    id: z.string().optional(),
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().optional(),
    customerTypeId: z.string().optional(),
    customerStatusId: zfd.numeric(z.number().optional()),
    taxId: z.string().optional(),
    accountManagerId: z.string().optional(),
  })
);

export const customerTypeValidator = withZod(
  z.object({
    id: z.string(),
    name: z.string().min(1, { message: "Name is required" }),
    color: z.string(),
  })
);
