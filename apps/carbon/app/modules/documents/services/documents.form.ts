import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const documentValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    name: z.string().min(3).max(50),
    description: z.string().optional(),
    size: z.number().positive(),
    url: zfd.text(z.string().url().optional()),
    readGroups: z
      .array(z.string().min(36, { message: "Invalid selection" }))
      .min(1, { message: "Read permissions are required" }),
    writeGroups: z
      .array(z.string().min(36, { message: "Invalid selection" }))
      .min(1, { message: "Write permissions are required" }),
  })
);
