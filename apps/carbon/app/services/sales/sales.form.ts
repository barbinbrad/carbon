import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const customerValidator = withZod(
  z.object({
    id: z.string(),
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string(),
    customerTypeId: z.string(),
    customerStatusId: z.number(),
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

export const customerTypeValidator = withZod(
  z.object({
    id: z.string(),
    name: z.string().min(1, { message: "Name is required" }),
    color: z.string(),
  })
);
