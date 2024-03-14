import { z } from "zod";
import { zfd } from "zod-form-data";
import { address, contact } from "~/types/validators";
import { standardFactorType } from "../shared/types";

export const customerValidator = z.object({
  id: zfd.text(z.string().optional()),
  name: z.string().min(1, { message: "Name is required" }),
  customerTypeId: zfd.text(z.string().optional()),
  customerStatusId: zfd.text(z.string().optional()),
  taxId: zfd.text(z.string().optional()),
  accountManagerId: zfd.text(z.string().optional()),
});

export const customerContactValidator = z.object({
  id: zfd.text(z.string().optional()),
  ...contact,
  customerLocationId: zfd.text(z.string().optional()),
});

export const customerLocationValidator = z.object({
  id: zfd.text(z.string().optional()),
  ...address,
});

export const customerPaymentValidator = z.object({
  customerId: z.string().min(36, { message: "Customer is required" }),
  invoiceCustomerId: zfd.text(z.string().optional()),
  invoiceCustomerLocationId: zfd.text(z.string().optional()),
  invoiceCustomerContactId: zfd.text(z.string().optional()),
  paymentTermId: zfd.text(z.string().optional()),
  currencyCode: zfd.text(z.string().optional()),
});

export const customerShippingValidator = z.object({
  customerId: z.string().min(36, { message: "Customer is required" }),
  shippingCustomerId: zfd.text(z.string().optional()),
  shippingCustomerLocationId: zfd.text(z.string().optional()),
  shippingCustomerContactId: zfd.text(z.string().optional()),
  shippingTermId: zfd.text(z.string().optional()),
  shippingMethodId: zfd.text(z.string().optional()),
});

export const customerStatusValidator = z.object({
  id: zfd.text(z.string().optional()),
  name: z.string().min(1, { message: "Name is required" }),
});

export const customerTypeValidator = z.object({
  id: zfd.text(z.string().optional()),
  name: z.string().min(1, { message: "Name is required" }),
});

export const quoteLineStatusType = [
  "Draft",
  "In Progress",
  "Complete",
] as const;

export const quoteStatusType = [
  "Draft",
  "Open",
  "Replied",
  "Ordered",
  "Partially Ordered",
  "Lost",
  "Cancelled",
  "Expired",
] as const;

export const quotationValidator = z.object({
  id: zfd.text(z.string().optional()),
  quoteId: zfd.text(z.string().optional()),
  name: z.string().min(1, { message: "Name is required" }),
  customerId: z.string().min(36, { message: "Customer is required" }),
  customerLocationId: zfd.text(z.string().optional()),
  customerContactId: zfd.text(z.string().optional()),
  customerReference: zfd.text(z.string().optional()),
  locationId: zfd.text(z.string().optional()),
  ownerId: z.string().min(36, { message: "Owner is required" }),
  notes: zfd.text(z.string().optional()),
  expirationDate: zfd.text(z.string().optional()),
});

export const quotationAssemblyValidator = z.object({
  id: zfd.text(z.string().optional()),
  parentAssemblyId: zfd.text(z.string().optional()),
  partId: z.string().min(1, { message: "Part is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  unitOfMeasureCode: zfd.text(z.string().optional()),
  quantityPerParent: zfd.numeric(
    z.number().min(1, { message: "Quantity is required" })
  ),
});

export const quotationMaterialValidator = z.object({
  id: zfd.text(z.string().optional()),
  partId: z.string().min(1, { message: "Part is required" }),
  quantity: zfd.numeric(
    z.number().min(0.00001, { message: "Quantity is required" })
  ),
  description: z.string().min(1, { message: "Description is required" }),
  unitCost: zfd.numeric(z.number().min(0)),
  unitOfMeasureCode: zfd.text(z.string().optional()),
});

export const quotationOperationValidator = z.object({
  id: zfd.text(z.string().optional()),
  quoteAssemblyId: zfd.text(z.string().optional()),
  workCellTypeId: z.string().min(20, { message: "Work cell is required" }),
  equipmentTypeId: zfd.text(z.string().optional()),
  description: zfd.text(
    z.string().min(0, { message: "Description is required" })
  ),
  setupHours: zfd.numeric(z.number().min(0)),
  standardFactor: z.enum(standardFactorType, {
    errorMap: () => ({ message: "Standard factor is required" }),
  }),
  productionStandard: zfd.numeric(z.number().min(0)),
  quotingRate: zfd.numeric(z.number().min(0)),
  laborRate: zfd.numeric(z.number().min(0)),
  overheadRate: zfd.numeric(z.number().min(0)),
});

export const quotationLineValidator = z.object({
  id: zfd.text(z.string().optional()),
  quoteId: z.string(),
  partId: z.string().min(1, { message: "Part is required" }),
  status: z.enum(quoteLineStatusType, {
    errorMap: () => ({ message: "Status is required" }),
  }),
  description: z.string().min(1, { message: "Description is required" }),
  replenishmentSystem: z.enum(["Buy", "Make"]),
  customerPartId: zfd.text(z.string().optional()),
  customerPartRevision: zfd.text(z.string().optional()),
  unitOfMeasureCode: zfd.text(
    z.string().min(1, { message: "Unit of measure is required" })
  ),
});

export const quotationReleaseValidator = z
  .object({
    notification: z.enum(["Email", "None"]).optional(),
    customerContact: zfd.text(z.string().optional()),
  })
  .refine(
    (data) => (data.notification === "Email" ? data.customerContact : true),
    {
      message: "Supplier contact is required for email",
      path: ["customerContact"], // path of error
    }
  );
