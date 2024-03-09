import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  VStack,
} from "@carbon/react";
import { ValidatedForm } from "@carbon/remix-validated-form";
import { useState } from "react";
import type { z } from "zod";
import {
  Boolean,
  Combobox,
  Currency,
  Hidden,
  Number,
  Submit,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import type { UnitOfMeasureListItem } from "~/modules/parts";
import { partUnitSalePriceValidator } from "~/modules/parts";

type PartSalePriceFormProps = {
  initialValues: z.infer<typeof partUnitSalePriceValidator>;
  unitOfMeasures: UnitOfMeasureListItem[];
};

const PartSalePriceForm = ({
  initialValues,
  unitOfMeasures,
}: PartSalePriceFormProps) => {
  const permissions = usePermissions();
  const [currency, setCurrency] = useState(initialValues.currencyCode);

  const unitOfMeasureOptions = unitOfMeasures.map((unitOfMeasure) => ({
    label: unitOfMeasure.name,
    value: unitOfMeasure.code,
  }));

  return (
    <ValidatedForm
      method="post"
      validator={partUnitSalePriceValidator}
      defaultValues={initialValues}
    >
      <Card>
        <CardHeader>
          <CardTitle>Sale Price</CardTitle>
        </CardHeader>
        <CardContent>
          <Hidden name="partId" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-2 w-full">
            <VStack>
              <Number
                name="unitSalePrice"
                label="Unit Sale Price"
                minValue={0}
                formatOptions={{
                  style: "currency",
                  currency,
                }}
              />
              <Currency
                name="currencyCode"
                label="Currency"
                onChange={(newValue) => {
                  if (newValue) setCurrency(newValue?.value);
                }}
              />
            </VStack>
            <VStack>
              <Combobox
                name="salesUnitOfMeasureCode"
                label="Sales Unit of Measure"
                options={unitOfMeasureOptions}
              />
            </VStack>
            <VStack>
              <Boolean name="salesBlocked" label="Sales Blocked" />
              <Boolean name="priceIncludesTax" label="Price Includes Tax" />
              <Boolean
                name="allowInvoiceDiscount"
                label="Allow Invoice Discount"
              />
            </VStack>
          </div>
        </CardContent>
        <CardFooter>
          <Submit isDisabled={!permissions.can("update", "parts")}>Save</Submit>
        </CardFooter>
      </Card>
    </ValidatedForm>
  );
};

export default PartSalePriceForm;
