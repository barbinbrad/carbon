import { z } from "zod";
import { zfd } from "zod-form-data";

export const receiptSourceDocumentType = [
  // "Sales Order",
  // "Sales Invoice",
  // "Sales Return Order",
  "Purchase Order",
  "Purchase Invoice",
  // "Purchase Return Order",
  // "Inbound Transfer",
  // "Outbound Transfer",
  // "Manufacturing Consumption",
  // "Manufacturing Output",
] as const;

export const receiptStatusType = ["Draft", "Pending", "Posted"] as const;

export const receiptValidator = z.object({
  id: z.string().min(1),
  receiptId: z.string().min(1, { message: "Receipt ID is required" }),
  locationId: zfd.text(z.string().optional()),
  sourceDocument: z.enum(receiptSourceDocumentType).optional(),
  sourceDocumentId: zfd.text(
    z.string().min(1, { message: "Source Document ID is required" })
  ),
  externalDocumentId: zfd.text(z.string().optional()),
  sourceDocumentReadableId: zfd.text(z.string().optional()),
  supplierId: zfd.text(z.string().optional()),
});

export const shippingMethodValidator = z.object({
  id: zfd.text(z.string().optional()),
  name: z.string().min(1, { message: "Name is required" }),
  carrier: z.enum(["UPS", "FedEx", "USPS", "DHL", "Other"], {
    errorMap: (issue, ctx) => ({
      message: "Carrier is required",
    }),
  }),
  carrierAccountId: zfd.text(z.string().optional()),
  trackingUrl: zfd.text(z.string().optional()),
});
