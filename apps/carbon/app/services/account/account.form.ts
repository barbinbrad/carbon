import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

export const accountProfileValidator = withZod(
  z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    about: z.string(),
  })
);

export const accountPasswordValidator = withZod(
  z
    .object({
      currentPassword: z
        .string()
        .min(6, { message: "Current password is required" }),
      password: z.string().min(6, { message: "Password is required" }),
      confirmPassword: z
        .string()
        .min(6, { message: "Confirm password is required" }),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
      if (confirmPassword !== password) {
        ctx.addIssue({
          code: "custom",
          message: "The passwords did not match",
        });
      }
    })
);

export const accountPersonalDataValidator = withZod(z.object({}));
