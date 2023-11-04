import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const sequenceValidator = withZod(
  z.object({
    table: z.string().min(1, { message: "Table is required" }),
    prefix: zfd.text(z.string().optional()),
    suffix: zfd.text(z.string().optional()),
    next: zfd.numeric(z.number().min(0)),
    step: zfd.numeric(z.number().min(1)),
    size: zfd.numeric(z.number().min(1).max(20)),
  })
);
