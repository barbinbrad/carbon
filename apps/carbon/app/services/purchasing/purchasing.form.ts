import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const supplierValidator = withZod(
  z.object({
    id: z.string(),
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string(),
    supplierTypeId: z.string(),
    supplierStatusId: z.number(),
    taxId: z.string(),
    taxable: zfd.checkbox(),
    established: z.string(),
    accountManagerId: z.string(),
    website: z.string(),
    twitter: z.string(),
    facebook: z.string(),
    instagram: z.string(),
    linkedin: z.string(),
    github: z.string(),
    youtube: z.string(),
    twitch: z.string(),
    discord: z.string(),
  })
);

export const supplierTypeValidator = withZod(
  z.object({
    id: z.string(),
    name: z.string().min(1, { message: "Name is required" }),
    color: z.string(),
  })
);
