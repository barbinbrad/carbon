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
import { partPlanningValidator } from "~/modules/parts";

type PartPlanningFormValues = {
  partId: string;
};

type PartPlanningFormProps = {
  initialValues: PartPlanningFormValues;
};

const PartPlanningForm = ({ initialValues }: PartPlanningFormProps) => {
  return (
    <ValidatedForm
      method="post"
      validator={partPlanningValidator}
      defaultValues={initialValues}
    >
      <Card w="full">
        <CardHeader>
          <Heading size="md">Planning</Heading>
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
                name="reorderingPolicy"
                label="Reordering Policy"
                options={[
                  {
                    label: "Demand-Based Reorder",
                    value: "Demand-Based Reorder",
                  },
                ]}
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
              <Number
                name="reorderOverflowLevel"
                label="Reorder Overflow Level"
              />
              <Number
                name="reorderTimeBucket"
                label="Reorder Time Bucket (Days)"
              />
            </VStack>
          </Grid>
        </CardBody>
        <CardFooter>
          <Submit>Save</Submit>
        </CardFooter>
      </Card>
    </ValidatedForm>
  );
};

export default PartPlanningForm;
