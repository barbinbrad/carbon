import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const supplierTypeValidator = withZod(
  z.object({
    id: zfd.numeric(z.number().optional()),
    name: z.string().min(1, { message: "Name is required" }),
    color: z.string(),
  })
);
