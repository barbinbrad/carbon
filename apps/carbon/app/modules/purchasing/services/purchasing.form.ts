import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { address, contact } from "~/types/validators";

export const purchaseOrderValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    purchaseOrderId: z.string().min(1, { message: "PO Number is required" }),
    type: z.enum(["Draft", "Purchase", "Return"], {
      errorMap: (issue, ctx) => ({
        message: "Type is required",
      }),
    }),
    status: z.enum(
      [
        "Draft",
        "In Review",
        "In External Review",
        "Approved",
        "Rejected",
        "Confirmed",
      ],
      {
        errorMap: (issue, ctx) => ({
          message: "Status is required",
        }),
      }
    ),
    orderDueDate: zfd.text(z.string().optional()),
    receivedDate: zfd.text(z.string().optional()),
    notes: zfd.text(z.string().optional()),
    supplierId: z.string().min(36, { message: "Supplier is required" }),
    supplierContactId: zfd.text(z.string().optional()),
    supplierReference: zfd.text(z.string().optional()),
    invoiceSupplierId: zfd.text(z.string().optional()),
    invoiceSupplierLocationId: zfd.text(z.string().optional()),
    invoiceSupplierContactId: zfd.text(z.string().optional()),
    paymentTermId: zfd.text(z.string().optional()),
    shippingMethodId: zfd.text(z.string().optional()),
    currencyCode: z.string().min(1, { message: "Currency is required" }),
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
