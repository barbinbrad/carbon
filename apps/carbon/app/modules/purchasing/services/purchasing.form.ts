import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { address, contact } from "~/types/validators";

export const shippingMethodValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    name: z.string().min(1, { message: "Name is required" }),
    carrier: z.enum(["UPS", "FedEx", "USPS", "DHL", "Other"], {
      errorMap: (issue, ctx) => ({
        message: "Carrier is required",
      }),
    }),
    carrierAccountId: zfd.text(z.string().optional()),
    trackingUrl: zfd.text(z.string().optional()),
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
