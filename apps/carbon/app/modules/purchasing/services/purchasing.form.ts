import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { address, contact } from "~/types/validators";

export const paymentTermValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    name: z.string().min(1, { message: "Name is required" }),
    description: zfd.text(z.string().optional()),
    daysDue: zfd.numeric(
      z
        .number()
        .min(0, { message: "Days due must be greater than or equal to 0" })
    ),
    daysDiscount: zfd.numeric(
      z
        .number()
        .min(0, { message: "Days discount must be greater than or equal to 0" })
    ),
    discountPercentage: zfd.numeric(
      z
        .number()
        .min(0, {
          message: "Discount percent must be greater than or equal to 0",
        })
        .max(100, {
          message: "Discount percent must be less than or equal to 100",
        })
    ),
    gracePeriod: zfd.numeric(
      z
        .number()
        .min(0, { message: "Grace period must be greater than or equal to 0" })
    ),
    calculationMethod: z.enum(
      ["Transaction Date", "End of Month", "Day of Month"],
      {
        errorMap: (issue, ctx) => ({
          message: "Calculation method is required",
        }),
      }
    ),
  })
);

export const supplierValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    name: z.string().min(1, { message: "Name is required" }),
    description: zfd.text(z.string().optional()),
    supplierTypeId: zfd.text(z.string().optional()),
    supplierStatusId: zfd.text(z.string().optional()),
    taxId: zfd.text(z.string().optional()),
    accountManagerId: zfd.text(z.string().optional()),
  })
);

export const supplierContactValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    ...contact,
    supplierLocationId: zfd.text(z.string().optional()),
  })
);

export const supplierLocationValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
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
