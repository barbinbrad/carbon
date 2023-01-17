import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { address, contact } from "~/types/validators";

export const customerValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    name: z.string().min(1, { message: "Name is required" }),
    description: zfd.text(z.string().optional()),
    customerTypeId: zfd.text(z.string().optional()),
    customerStatusId: zfd.numeric(z.number().optional()),
    taxId: zfd.text(z.string().optional()),
    accountManagerId: zfd.text(z.string().optional()),
  })
);

export const customerContactValidator = withZod(
  z.object({
    id: zfd.numeric(z.number().optional()),
    ...contact,
    customerLocationId: zfd.numeric(z.number().optional()),
  })
);

export const customerLocationValidator = withZod(
  z.object({
    id: zfd.numeric(z.number().optional()),
    ...address,
  })
);

export const customerTypeValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    name: z.string().min(1, { message: "Name is required" }),
    color: z.string(),
  })
);
