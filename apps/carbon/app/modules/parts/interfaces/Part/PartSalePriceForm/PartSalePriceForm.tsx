import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { ValidatedForm } from "remix-validated-form";
import {
  Boolean,
  Currency,
  Hidden,
  Number,
  Select,
  Submit,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import type { UnitOfMeasureListItem } from "~/modules/parts";
import { partUnitSalePriceValidator } from "~/modules/parts";
import type { TypeOfValidator } from "~/types/validators";

type PartSalePriceFormProps = {
  initialValues: TypeOfValidator<typeof partUnitSalePriceValidator>;
  unitOfMeasures: UnitOfMeasureListItem[];
};

const PartSalePriceForm = ({
  initialValues,
  unitOfMeasures,
}: PartSalePriceFormProps) => {
  const permissions = usePermissions();

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
      <Card w="full">
        <CardHeader>
          <Heading size="md">Sale Price</Heading>
        </CardHeader>
        <CardBody>
          <Hidden name="partId" />
          <Grid
            gridTemplateColumns={["1fr", "1fr", "1fr 1fr 1fr"]}
            gridColumnGap={8}
            gridRowGap={2}
            w="full"
          >
            <VStack alignItems="start" spacing={2} w="full">
              <Number name="unitSalePrice" label="Unit Sale Price" />
              <Currency name="currencyCode" label="Currency" />
            </VStack>
            <VStack alignItems="start" spacing={2} w="full">
              <Select
                name="salesUnitOfMeasureCode"
                label="Sales Unit of Measure"
                options={unitOfMeasureOptions}
              />
            </VStack>
            <VStack alignItems="start" spacing={2} w="full">
              <Boolean name="salesBlocked" label="Sales Blocked" />
              <Boolean name="priceIncludesTax" label="Price Includes Tax" />
              <Boolean
                name="allowInvoiceDiscount"
                label="Allow Invoice Discount"
              />
            </VStack>
          </Grid>
        </CardBody>
        <CardFooter>
          <Submit isDisabled={!permissions.can("update", "parts")}>Save</Submit>
        </CardFooter>
      </Card>
    </ValidatedForm>
  );
};

export default PartSalePriceForm;
