ALTER TABLE "customer" 
  ADD COLUMN "defaultCurrencyCode" TEXT,
  ADD COLUMN "defaultPaymentTermId" TEXT,
  ADD COLUMN "defaultShippingMethodId" TEXT,
  ADD COLUMN "defaultShippingTermId" TEXT;

ALTER TABLE "customer"
  ADD CONSTRAINT "customer_defaultPaymentTermId_fkey" FOREIGN KEY ("defaultPaymentTermId") REFERENCES "paymentTerm" ("id") ON DELETE SET NULL,
  ADD CONSTRAINT "customer_defaultShippingMethodId_fkey" FOREIGN KEY ("defaultShippingMethodId") REFERENCES "shippingMethod" ("id") ON DELETE SET NULL,
  ADD CONSTRAINT "customer_defaultShippingTermId_fkey" FOREIGN KEY ("defaultShippingTermId") REFERENCES "shippingTerm" ("id") ON DELETE SET NULL;
