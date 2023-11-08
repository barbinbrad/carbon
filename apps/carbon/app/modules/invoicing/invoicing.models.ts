import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const purchaseInvoiceStatusType = [
  "Draft",
  "Submitted",
  "Return",
  "Debit Note Issued",
  "Paid",
  "Partially Paid",
  "Overdue",
  "Voided",
] as const;

export const purchaseInvoiceValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    invoiceId: zfd.text(z.string().optional()),
    supplierId: z.string().min(36, { message: "Supplier is required" }),
    supplierContactId: zfd.text(z.string().optional()),
    dateIssued: zfd.text(z.string().optional()),
    dateDue: zfd.text(z.string().optional()),
    status: z.enum(purchaseInvoiceStatusType).optional(),
    currencyCode: zfd.text(z.string().optional()),
  })
);
