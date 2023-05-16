import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

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
