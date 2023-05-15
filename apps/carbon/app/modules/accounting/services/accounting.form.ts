import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const paymentTermValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    name: z.string().min(1, { message: "Name is required" }),
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
    calculationMethod: z.enum(["Net", "End of Month", "Day of Month"], {
      errorMap: (issue, ctx) => ({
        message: "Calculation method is required",
      }),
    }),
  })
);
