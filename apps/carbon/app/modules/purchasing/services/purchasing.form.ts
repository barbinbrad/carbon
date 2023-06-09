import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { address, contact } from "~/types/validators";

export const purchaseOrderValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    purchaseOrderId: zfd.text(z.string().optional()),
    orderDate: z.string().min(1, { message: "Order Date is required" }),
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
    notes: zfd.text(z.string().optional()),
    supplierId: z.string().min(36, { message: "Supplier is required" }),
    supplierContactId: zfd.text(z.string().optional()),
    supplierReference: zfd.text(z.string().optional()),
    closed: zfd.checkbox(),
  })
);

export const purchaseOrderDeliveryValidator = withZod(
  z.object({
    id: z.string(),
    shippingMethodId: zfd.text(z.string().optional()),
    shippingTermId: zfd.text(z.string().optional()),
    trackingNumber: z.string(),
    deliveryDate: zfd.text(z.string().optional()),
    receiptRequestedDate: zfd.text(z.string().optional()),
    receiptPromisedDate: zfd.text(z.string().optional()),
    notes: zfd.text(z.string().optional()),
  })
);

export const purchaseOrderPaymentValidator = withZod(
  z.object({
    id: z.string(),
    invoiceSupplierId: zfd.text(z.string().optional()),
    invoiceSupplierLocationId: zfd.text(z.string().optional()),
    invoiceSupplierContactId: zfd.text(z.string().optional()),
    paymentTermId: zfd.text(z.string().optional()),
    paymentDate: zfd.text(z.string().optional()),
    currencyCode: zfd.text(z.string().optional()),
  })
);

export const supplierValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    name: z.string().min(1, { message: "Name is required" }),
    supplierTypeId: zfd.text(z.string().optional()),
    supplierStatusId: zfd.text(z.string().optional()),
    taxId: zfd.text(z.string().optional()),
    accountManagerId: zfd.text(z.string().optional()),
    defaultCurrencyCode: zfd.text(z.string().optional()),
    defaultPaymentTermId: zfd.text(z.string().optional()),
    defaultShippingTermId: zfd.text(z.string().optional()),
    defaultShippingMethodId: zfd.text(z.string().optional()),
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
