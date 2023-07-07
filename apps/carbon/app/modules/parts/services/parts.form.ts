import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const partValidator = withZod(
  z.object({
    id: z.string().min(1, { message: "Part ID is required" }).max(255),
    name: z.string().min(1, { message: "Name is required" }).max(255),
    description: zfd.text(z.string().optional()),
    blocked: zfd.checkbox(),
    active: zfd.checkbox(),
    replenishmentSystem: z.enum(["Buy", "Make", "Buy and Make"], {
      errorMap: (issue, ctx) => ({
        message: "Replenishment system is required",
      }),
    }),
    partGroupId: z.string().optional(),
    partType: z.enum(["Inventory", "Non-Inventory", "Service"], {
      errorMap: (issue, ctx) => ({
        message: "Part type is required",
      }),
    }),
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

export const partGroupValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    name: z.string().min(1, { message: "Name is required" }).max(255),
    description: z.string().optional(),
    salesAccountId: zfd.text(z.string().optional()),
    discountAccountId: zfd.text(z.string().optional()),
    inventoryAccountId: zfd.text(z.string().optional()),
    // costOfGoodsSoldLaborAccountId: zfd.text(z.string().optional()),
    // costOfGoodsSoldMaterialAccountId: zfd.text(z.string().optional()),
    // costOfGoodsSoldOverheadAccountId: zfd.text(z.string().optional()),
    // costOfGoodsSoldSubcontractAccountId: zfd.text(z.string().optional()),
  })
);

export const partInventoryValidator = withZod(
  z.object({
    partId: z.string().min(1, { message: "Part ID is required" }),
    shelfId: zfd.text(z.string().optional()),
    hasNewShelf: z.enum(["true", "false"]),
    stockoutWarning: zfd.checkbox(),
    unitVolume: zfd.numeric(z.number().min(0)),
    unitWeight: zfd.numeric(z.number().min(0)),
  })
);

export const partManufacturingValidator = withZod(
  z.object({
    partId: z.string().min(1, { message: "Part ID is required" }),
    manufacturingPolicy: z.enum(["Make to Order", "Make to Stock"], {
      errorMap: (issue, ctx) => ({
        message: "Manufacturing policy is required",
      }),
    }),
    manufacturingLeadTime: zfd.numeric(z.number().min(0)),
    manufacturingBlocked: zfd.checkbox(),
    requiresConfiguration: zfd.checkbox(),
    scrapPercentage: zfd.numeric(z.number().min(0).max(100)),
    lotSize: zfd.numeric(z.number().min(0)),
  })
);

export const partPlanningValidator = withZod(
  z.object({
    partId: z.string().min(1, { message: "Part ID is required" }),
    reorderingPolicy: z.enum(
      [
        "Manual Reorder",
        "Demand-Based Reorder",
        "Fixed Reorder Quantity",
        "Maximum Quantity",
      ],
      {
        errorMap: (issue, ctx) => ({
          message: "Reordering policy is required",
        }),
      }
    ),
    critical: zfd.checkbox(),
    safetyStockQuantity: zfd.numeric(z.number().min(0)),
    safetyStockLeadTime: zfd.numeric(z.number().min(0)),
    demandAccumulationPeriod: zfd.numeric(z.number().min(0)),
    demandReschedulingPeriod: zfd.numeric(z.number().min(0)),
    demandAccumulationIncludesInventory: zfd.checkbox(),
    reorderPoint: zfd.numeric(z.number().min(0)),
    reorderQuantity: zfd.numeric(z.number().min(0)),
    reorderMaximumInventory: zfd.numeric(z.number().min(0)),
    reorderOverflowLevel: zfd.numeric(z.number().min(0)),
    reorderTimeBucket: zfd.numeric(z.number().min(0)),
    minimumOrderQuantity: zfd.numeric(z.number().min(0)),
    maximumOrderQuantity: zfd.numeric(z.number().min(0)),
    orderMultiple: zfd.numeric(z.number().min(1)),
  })
);

export const partPurchasingValidator = withZod(
  z.object({
    partId: z.string().min(1, { message: "Part ID is required" }),
    preferredSupplierId: zfd.text(z.string().optional()),
    conversionFactor: zfd.numeric(z.number().min(0)),
    purchasingLeadTime: zfd.numeric(z.number().min(0)),
    purchasingUnitOfMeasureCode: zfd.text(z.string().optional()),
    purchasingBlocked: zfd.checkbox(),
  })
);

export const partSupplierValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    partId: z.string().min(1, { message: "Part ID is required" }),
    supplierId: z.string().min(36, { message: "Supplier ID is required" }),
    supplierPartId: z.string().optional(),
    supplierUnitOfMeasureCode: zfd.text(z.string().optional()),
    minimumOrderQuantity: zfd.numeric(z.number().min(0)),
    conversionFactor: zfd.numeric(z.number().min(0)),
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
    priceIncludesTax: zfd.checkbox(),
    allowInvoiceDiscount: zfd.checkbox(),
  })
);

export const unitOfMeasureValidator = withZod(
  z.object({
    id: zfd.text(z.string().optional()),
    code: z.string().min(1, { message: "Code is required" }).max(5),
    name: z.string().min(1, { message: "Name is required" }).max(50),
  })
);
