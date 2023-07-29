import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

const receiptSourceDocumentType = [
  "Sales Order",
  "Sales Return Order",
  "Purchase Order",
  "Purchase Return Order",
  "Inbound Transfer",
  "Outbound Transfer",
  "Manufacturing Consumption",
  "Manufacturing Output",
] as const;

export const receiptValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    receiptId: zfd.text(z.string().optional()),
    sourceDocument: z.enum(receiptSourceDocumentType, {
      errorMap: (issue, ctx) => ({
        message: "Source Document is required",
      }),
    }),
    sourceDocumentId: z
      .string()
      .min(1, { message: "Source Document ID is required" }),
    supplierId: zfd.text(z.string().optional()),
    supplierInvoiceNumber: zfd.text(z.string().optional()),
    supplierShipmentNumber: zfd.text(z.string().optional()),
    expectedDeliveryDate: zfd.text(z.string().optional()),
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
