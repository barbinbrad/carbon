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
import {
  Boolean,
  Combobox,
  Hidden,
  Number,
  Submit,
  Supplier,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import type { UnitOfMeasureListItem } from "~/modules/parts";
import { partPurchasingValidator } from "~/modules/parts";

type PartPurchasingFormProps = {
  initialValues: z.infer<typeof partPurchasingValidator>;
  unitOfMeasures: UnitOfMeasureListItem[];
};

const PartPurchasingForm = ({
  initialValues,
  unitOfMeasures,
}: PartPurchasingFormProps) => {
  const permissions = usePermissions();

  const unitOfMeasureOptions = unitOfMeasures.map((unitOfMeasure) => ({
    label: unitOfMeasure.name,
    value: unitOfMeasure.code,
  }));

  return (
    <ValidatedForm
      method="post"
      validator={partPurchasingValidator}
      defaultValues={initialValues}
    >
      <Card>
        <CardHeader>
          <CardTitle>Purchasing</CardTitle>
        </CardHeader>
        <CardContent>
          <Hidden name="partId" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-2 w-full">
            <VStack>
              <Supplier name="preferredSupplierId" label="Preferred Supplier" />
              <Number name="purchasingLeadTime" label="Lead Time (Days)" />
            </VStack>
            <VStack>
              <Combobox
                name="purchasingUnitOfMeasureCode"
                label="Purchasing Unit of Measure"
                options={unitOfMeasureOptions}
              />
              <Number
                name="conversionFactor"
                label="Conversion Factor"
                minValue={0}
              />
            </VStack>
            <VStack>
              <Boolean name="purchasingBlocked" label="Purchasing Blocked" />
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

export default PartPurchasingForm;
