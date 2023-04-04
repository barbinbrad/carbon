import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const partValidator = withZod(
  z.object({
    id: z.string().min(1, { message: "Part ID is required" }).max(255),
    name: z.string().min(1, { message: "Name is required" }).max(255),
    description: zfd.text(z.string().optional()),
    blocked: zfd.checkbox(),
    partGroupId: z.string().min(20, { message: "Part Group is required" }),
    partType: z.enum(["Inventory", "Non-Inventory", "Service"], {
      errorMap: (issue, ctx) => ({
        message: "Part type is required",
      }),
    }),
    manufacturerPartNumber: zfd.text(z.string().optional()),
    unitOfMeasureCode: z
      .string()
      .min(1, { message: "Unit of Measure is required" }),
  })
);

export const partCostValidator = withZod(
  z.object({
    partId: z.string().min(1, { message: "Part ID is required" }),
    costingMethod: z.enum(["Standard", "Average", "FIFO", "LIFO"], {
      errorMap: (issue, ctx) => ({
        message: "Costing method is required",
      }),
    }),
    standardCost: zfd.numeric(z.number().min(0)),
    unitCost: zfd.numeric(z.number().min(0)),
    costIsAdjusted: zfd.checkbox(),
  })
);

export const partUnitSalePriceValidator = withZod(
  z.object({
    partId: z.string().min(1, { message: "Part ID is required" }),
    unitSalePrice: zfd.numeric(z.number().min(0)),
    currencyCode: z.string().min(1, { message: "Currency is required" }),
    salesUnitOfMeasureCode: z
      .string()
      .min(1, { message: "Unit of Measure is required" }),
    salesBlocked: zfd.checkbox(),
  })
);

export const partPurchasingValidator = withZod(
  z.object({
    partId: z.string().min(1, { message: "Part ID is required" }),
    replenishmentSystem: z.enum(
      ["Purchased", "Manufactured", "Purchased and Manufactured"],
      {
        errorMap: (issue, ctx) => ({
          message: "Replenishment system is required",
        }),
      }
    ),
    leadTime: zfd.numeric(z.number().min(0)),
    supplierId: zfd.text(z.string().optional()),
    supplierPartNumber: zfd.text(z.string().optional()),
    purchasingUnitOfMeasureCode: z
      .string()
      .min(1, { message: "Unit of Measure is required" }),
    purchasingBlocked: zfd.checkbox(),
    manufacturingPolicy: z.enum(["Make to Order", "Make to Stock"], {
      errorMap: (issue, ctx) => ({
        message: "Manufacturing policy is required",
      }),
    }),
    scrapPercentage: zfd.numeric(z.number().min(0).max(100)),
    lotSize: zfd.numeric(z.number().min(0)),
  })
);
