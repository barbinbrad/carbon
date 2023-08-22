import { Select } from "@carbon/react";
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  Heading,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { ValidatedForm } from "remix-validated-form";
import {
  Boolean,
  Hidden,
  Number,
  Select as SelectForm,
  Submit,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import type { PartReorderingPolicy } from "~/modules/parts";
import { partPlanningValidator } from "~/modules/parts";
import type { ListItem } from "~/types";
import type { TypeOfValidator } from "~/types/validators";

type PartPlanningFormProps = {
  initialValues: TypeOfValidator<typeof partPlanningValidator>;
  locations: ListItem[];
  partReorderingPolicies: PartReorderingPolicy[];
};

const PartPlanningForm = ({
  initialValues,
  locations,
  partReorderingPolicies,
}: PartPlanningFormProps) => {
  const permissions = usePermissions();

  const locationOptions = locations.map((location) => ({
    label: location.name,
    value: location.id,
  }));

  return (
    <ValidatedForm
      method="post"
      validator={partPlanningValidator}
      defaultValues={initialValues}
    >
      <Card w="full">
        <CardHeader>
          <HStack w="full" justifyContent="space-between">
            <Heading size="md">Planning</Heading>
            <Box w={180}>
              <Select
                // @ts-ignore
                size="sm"
                value={locationOptions.find(
                  (location) => location.value === initialValues.locationId
                )}
                options={locationOptions}
                onChange={(selected) => {
                  // hard refresh because initialValues update has no effect otherwise
                  window.location.href = `/x/part/${initialValues.partId}/planning?location=${selected?.value}`;
                }}
              />
            </Box>
          </HStack>
        </CardHeader>
        <CardBody>
          <Hidden name="partId" />
          <Hidden name="locationId" />
          <Grid
            gridTemplateColumns={["1fr", "1fr", "1fr 1fr 1fr"]}
            gridColumnGap={8}
            gridRowGap={2}
            w="full"
          >
            <VStack alignItems="start" spacing={2} w="full">
              <SelectForm
                name="reorderingPolicy"
                label="Reordering Policy"
                options={partReorderingPolicies.map((policy) => ({
                  label: policy,
                  value: policy,
                }))}
              />
              <Boolean name="critical" label="Critical" />
              <Number
                name="safetyStockQuantity"
                label="Safety Stock Quantity"
              />
              <Number
                name="safetyStockLeadTime"
                label="Safety Stock Lead Time (Days)"
              />
              <Number
                name="minimumOrderQuantity"
                label="Minimum Order Quantity"
              />
              <Number
                name="maximumOrderQuantity"
                label="Maximum Order Quantity"
              />
              <Number name="orderMultiple" label="Order Multiple" />
            </VStack>
            <VStack alignItems="start" spacing={2} w="full">
              <Number
                name="demandAccumulationPeriod"
                label="Demand Accumulation Period (Days)"
              />
              <Number
                name="demandReschedulingPeriod"
                label="Rescheduling Period (Days)"
              />
              <Boolean
                name="demandAccumulationIncludesInventory"
                label="Demand Includes Inventory"
              />
            </VStack>
            <VStack alignItems="start" spacing={2} w="full">
              <Number name="reorderPoint" label="Reorder Point" />
              <Number name="reorderQuantity" label="Reorder Quantity" />
              <Number
                name="reorderMaximumInventory"
                label="Reorder Maximum Inventory"
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

export default PartPlanningForm;
