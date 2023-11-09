import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { address, contact } from "~/types/validators";

export const customerValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    name: z.string().min(1, { message: "Name is required" }),
    customerTypeId: zfd.text(z.string().optional()),
    customerStatusId: zfd.text(z.string().optional()),
    taxId: zfd.text(z.string().optional()),
    accountManagerId: zfd.text(z.string().optional()),
  })
);

export const customerContactValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    ...contact,
    customerLocationId: zfd.text(z.string().optional()),
  })
);

export const customerLocationValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    ...address,
  })
);

export const customerPaymentValidator = withZod(
  z.object({
    customerId: z.string().min(36, { message: "Customer is required" }),
    invoiceCustomerId: zfd.text(z.string().optional()),
    invoiceCustomerLocationId: zfd.text(z.string().optional()),
    invoiceCustomerContactId: zfd.text(z.string().optional()),
    paymentTermId: zfd.text(z.string().optional()),
    currencyCode: zfd.text(z.string().optional()),
  })
);

export const customerShippingValidator = withZod(
  z.object({
    customerId: z.string().min(36, { message: "Customer is required" }),
    shippingCustomerId: zfd.text(z.string().optional()),
    shippingCustomerLocationId: zfd.text(z.string().optional()),
    shippingCustomerContactId: zfd.text(z.string().optional()),
    shippingTermId: zfd.text(z.string().optional()),
    shippingMethodId: zfd.text(z.string().optional()),
  })
);

export const customerTypeValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    name: z.string().min(1, { message: "Name is required" }),
    color: z.string(),
  })
);
