import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

export const customerTypeValidator = withZod(
  z.object({
    id: z.string(),
    name: z.string().min(1, { message: "Name is required" }),
    color: z.string(),
  })
);
