import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { address, contact } from "~/types/validators";

export const supplierValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    name: z.string().min(1, { message: "Name is required" }),
    description: zfd.text(z.string().optional()),
    supplierTypeId: zfd.text(z.string().optional()),
    supplierStatusId: zfd.numeric(z.number().optional()),
    taxId: zfd.text(z.string().optional()),
    accountManagerId: zfd.text(z.string().optional()),
  })
);

export const supplierContactValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    ...contact,
    supplierLocationId: zfd.numeric(z.number().optional()),
  })
);

export const supplierLocationValidator = withZod(
  z.object({
    id: zfd.numeric(z.number().optional()),
    ...address,
  })
);

export const supplierTypeValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    name: z.string().min(1, { message: "Name is required" }),
    color: z.string(),
  })
);
