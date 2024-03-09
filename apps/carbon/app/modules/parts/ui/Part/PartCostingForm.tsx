import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  VStack,
} from "@carbon/react";
import { ValidatedForm } from "@carbon/remix-validated-form";
import type { z } from "zod";
import { Boolean, Hidden, Number, Select, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import { partCostValidator, partCostingMethods } from "~/modules/parts";

type PartCostingFormProps = {
  initialValues: z.infer<typeof partCostValidator>;
};

const currency = "USD"; // TODO: get from settings

const PartCostingForm = ({ initialValues }: PartCostingFormProps) => {
  const permissions = usePermissions();

  const partCostingMethodOptions = partCostingMethods.map(
    (partCostingMethod) => ({
      label: partCostingMethod,
      value: partCostingMethod,
    })
  );

  return (
    <ValidatedForm
      method="post"
      validator={partCostValidator}
      defaultValues={initialValues}
    >
      <Card>
        <CardHeader>
          <CardTitle>Costing & Posting</CardTitle>
        </CardHeader>
        <CardContent>
          <Hidden name="partId" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-2 w-full">
            <VStack>
              <Select
                name="costingMethod"
                label="Part Costing Method"
                options={partCostingMethodOptions}
              />
              <Number
                name="standardCost"
                label="Standard Cost"
                formatOptions={{
                  style: "currency",
                  currency,
                }}
              />

              <Number
                name="unitCost"
                label="Unit Cost"
                formatOptions={{
                  style: "currency",
                  currency,
                }}
              />
            </VStack>
            <VStack>
              <Number
                name="salesHistory"
                label="Sales History"
                formatOptions={{
                  style: "currency",
                  currency,
                }}
                isReadOnly
              />
              <Number
                name="salesHistoryQty"
                label="Sales History Qty"
                formatOptions={{
                  maximumSignificantDigits: 3,
                }}
                isReadOnly
              />
              <Boolean name="costIsAdjusted" label="Cost Is Adjusted" />
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

export default PartCostingForm;
