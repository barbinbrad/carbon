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
  z
    .object({
      id: z.string(),
      locationId: zfd.text(z.string().optional()),
      shippingMethodId: zfd.text(z.string().optional()),
      shippingTermId: zfd.text(z.string().optional()),
      trackingNumber: z.string(),
      deliveryDate: zfd.text(z.string().optional()),
      receiptRequestedDate: zfd.text(z.string().optional()),
      receiptPromisedDate: zfd.text(z.string().optional()),
      dropShipment: zfd.checkbox(),
      customerId: zfd.text(z.string().optional()),
      customerLocationId: zfd.text(z.string().optional()),
      notes: zfd.text(z.string().optional()),
    })
    .refine(
      (data) => {
        if (data.dropShipment) {
          return data.customerId && data.customerLocationId;
        }
        return true;
      },
      {
        message: "Drop shipment requires customer and location",
        path: ["dropShipment"], // path of error
      }
    )
    .refine(
      (data) => {
        if (data.locationId) {
          return !data.dropShipment;
        }
        return true;
      },
      {
        message: "Location is not required for drop shipment",
        path: ["locationId"], // path of error
      }
    )
);

export const purchaseOrderLineValidator = withZod(
  z
    .object({
      id: zfd.text(z.string().optional()),
      purchaseOrderId: z.string().min(20, { message: "Order is required" }),
      purchaseOrderLineType: z.enum(
        ["Comment", "Part", "G/L Account", "Fixed Asset"],
        {
          errorMap: (issue, ctx) => ({
            message: "Type is required",
          }),
        }
      ),
      partId: zfd.text(z.string().optional()),
      accountNumber: zfd.text(z.string().optional()),
      assetId: zfd.text(z.string().optional()),
      description: zfd.text(z.string().optional()),
      purchaseQuantity: zfd.numeric(z.number().optional()),
      unitOfMeasureCode: zfd.text(z.string().optional()),
      unitPrice: zfd.numeric(z.number().optional()),
      setupPrice: zfd.numeric(z.number().optional()),
      shelfId: zfd.text(z.string().optional()),
    })
    .refine(
      (data) => (data.purchaseOrderLineType === "Part" ? data.partId : true),
      {
        message: "Part is required",
        path: ["partId"], // path of error
      }
    )
    .refine(
      (data) =>
        data.purchaseOrderLineType === "G/L Account"
          ? data.accountNumber
          : true,
      {
        message: "Account is required",
        path: ["accountNumber"], // path of error
      }
    )
    .refine(
      (data) =>
        data.purchaseOrderLineType === "Fixed Asset" ? data.assetId : true,
      {
        message: "Asset is required",
        path: ["assetId"], // path of error
      }
    )
    .refine(
      (data) =>
        data.purchaseOrderLineType === "Comment" ? data.description : true,
      {
        message: "Comment is required",
        path: ["description"], // path of error
      }
    )
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
