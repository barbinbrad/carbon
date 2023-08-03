import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const receiptSourceDocumentType = [
  // "Sales Order",
  // "Sales Return Order",
  "Purchase Order",
  // "Purchase Return Order",
  // "Inbound Transfer",
  // "Outbound Transfer",
  // "Manufacturing Consumption",
  // "Manufacturing Output",
] as const;

export const receiptValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    receiptId: zfd.text(z.string().optional()),
    locationId: zfd.text(z.string().optional()),
    sourceDocument: z.enum(receiptSourceDocumentType, {
      errorMap: (issue, ctx) => ({
        message: "Source Document is required",
      }),
    }),
    sourceDocumentId: z
      .string()
      .min(1, { message: "Source Document ID is required" }),
    supplierId: zfd.text(z.string().optional()),
    receiptItems: z.array(
      z.object({
        partId: z.string().min(1, { message: "Part ID is required" }),
        description: z.string().min(1, { message: "Description is required" }),
        quantity: z.number().min(0, { message: "Quantity is required" }),
        unitCost: z
          .number()
          .min(0.0000001, { message: "Unit Cost is required" }),
        location: zfd.text(z.string().optional()),
        shelfId: zfd.text(z.string().optional()),
        unitOfMeasure: z
          .string()
          .min(1, { message: "Unit of Measure is required" }),
      })
    ),
  })
);

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
