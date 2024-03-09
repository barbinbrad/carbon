import { z } from "zod";
import { zfd } from "zod-form-data";

export const purchaseInvoiceLineType = [
  "Part",
  "Service",
  "G/L Account",
  "Fixed Asset",
  "Comment",
] as const;

export const purchaseInvoiceStatusType = [
  "Draft",
  "Pending",
  "Submitted",
  "Return",
  "Debit Note Issued",
  "Paid",
  "Partially Paid",
  "Overdue",
  "Voided",
] as const;

export const purchaseInvoiceValidator = z.object({
  id: zfd.text(z.string().optional()),
  invoiceId: zfd.text(z.string().optional()),
  supplierId: z.string().min(36, { message: "Supplier is required" }),
  supplierReference: zfd.text(z.string().optional()),
  paymentTermId: zfd.text(z.string().optional()),
  currencyCode: zfd.text(z.string().optional()),
  invoiceSupplierId: zfd.text(z.string().optional()),
  invoiceSupplierContactId: zfd.text(z.string().optional()),
  invoiceSupplierLocationId: zfd.text(z.string().optional()),
  dateIssued: zfd.text(z.string().optional()),
  dateDue: zfd.text(z.string().optional()),
  status: z.enum(purchaseInvoiceStatusType).optional(),
});

export const purchaseInvoiceLineValidator = z
  .object({
    id: zfd.text(z.string().optional()),
    invoiceId: z.string().min(20, { message: "Invoice is required" }),
    invoiceLineType: z.enum(purchaseInvoiceLineType, {
      errorMap: (issue, ctx) => ({
        message: "Type is required",
      }),
    }),
    purchaseOrderId: zfd.text(z.string().optional()),
    purchaseOrderLineId: zfd.text(z.string().optional()),
    partId: zfd.text(z.string().optional()),
    serviceId: zfd.text(z.string().optional()),
    accountNumber: zfd.text(z.string().optional()),
    assetId: zfd.text(z.string().optional()),
    description: zfd.text(z.string().optional()),
    quantity: zfd.numeric(z.number().optional()),
    unitPrice: zfd.numeric(z.number().optional()),
    locationId: zfd.text(z.string().optional()),
    shelfId: zfd.text(z.string().optional()),
    unitOfMeasureCode: zfd.text(z.string().optional()),
    currencyCode: zfd.text(z.string().optional()),
    exchangeRate: zfd.numeric(z.number().optional()),
  })
  .refine((data) => (data.invoiceLineType === "Part" ? data.partId : true), {
    message: "Part is required",
    path: ["partId"], // path of error
  })
  .refine(
    (data) => (data.invoiceLineType === "Part" ? data.locationId : true),
    {
      message: "Location is required",
      path: ["locationId"], // path of error
    }
  )
  .refine(
    (data) =>
      data.invoiceLineType === "G/L Account" ? data.accountNumber : true,
    {
      message: "Account is required",
      path: ["accountNumber"], // path of error
    }
  )
  .refine(
    (data) => (data.invoiceLineType === "Fixed Asset" ? data.assetId : true),
    {
      message: "Asset is required",
      path: ["assetId"], // path of error
    }
  )
  .refine(
    (data) => (data.invoiceLineType === "Comment" ? data.description : true),
    {
      message: "Comment is required",
      path: ["description"], // path of error
    }
  );
