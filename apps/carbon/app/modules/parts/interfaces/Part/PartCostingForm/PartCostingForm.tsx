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
import { Boolean, Hidden, Number, Select, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import type { PartCostingMethod } from "~/modules/parts";
import { partCostValidator } from "~/modules/parts";
import type { TypeOfValidator } from "~/types/validators";
import { mapRowsToOptions } from "~/utils/form";

type PartCostingFormProps = {
  initialValues: TypeOfValidator<typeof partCostValidator>;
  accounts: { number: string; name: string }[];
  partCostingMethods: PartCostingMethod[];
};

const PartCostingForm = ({
  initialValues,
  accounts,
  partCostingMethods,
}: PartCostingFormProps) => {
  const permissions = usePermissions();

  const accountOptions = mapRowsToOptions({
    data: accounts,
    value: "number",
    label: "name",
  });

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
      <Card w="full">
        <CardHeader>
          <Heading size="md">Costing & Posting</Heading>
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
              <Select
                name="costingMethod"
                label="Part Costing Method"
                options={partCostingMethodOptions}
              />
              <Number name="standardCost" label="Standard Cost" precision={2} />
              <Number name="unitCost" label="Unit Cost" precision={2} />
            </VStack>
            {permissions.has("accounting") && (
              <VStack alignItems="start" spacing={2} w="full">
                <Select
                  name="salesAccountId"
                  label="Sales Account"
                  options={accountOptions}
                />
                <Select
                  name="inventoryAccountId"
                  label="Inventory Account"
                  options={accountOptions}
                />
                <Select
                  name="discountAccountId"
                  label="Discount Account"
                  options={accountOptions}
                />
              </VStack>
            )}
            <VStack alignItems="start" spacing={2} w="full">
              <Number
                name="salesHistory"
                label="Sales History"
                precision={2}
                isReadOnly
              />
              <Number
                name="salesHistoryQty"
                label="Sales History Qty"
                precision={2}
                isReadOnly
              />
              <Boolean name="costIsAdjusted" label="Cost Is Adjusted" />
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

export default PartCostingForm;
