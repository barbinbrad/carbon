import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  HStack,
  VStack,
} from "@carbon/react";
import { ValidatedForm } from "@carbon/remix-validated-form";
import type { z } from "zod";
import { Combobox } from "~/components";
import {
  Boolean,
  Hidden,
  Number,
  Select as SelectForm,
  Submit,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import { partPlanningValidator, partReorderingPolicies } from "~/modules/parts";
import type { ListItem } from "~/types";
import { path } from "~/utils/path";

type PartPlanningFormProps = {
  initialValues: z.infer<typeof partPlanningValidator>;
  locations: ListItem[];
};

const PartPlanningForm = ({
  initialValues,
  locations,
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
      <Card>
        <HStack className="w-full justify-between items-start">
          <CardHeader>
            <CardTitle>Planning</CardTitle>
          </CardHeader>
          <CardAction>
            <Combobox
              size="sm"
              value={initialValues.locationId}
              options={locationOptions}
              onChange={(selected) => {
                // hard refresh because initialValues update has no effect otherwise
                window.location.href = `${path.to.partPlanning(
                  initialValues.partId
                )}?location=${selected}`;
              }}
            />
          </CardAction>
        </HStack>
        <CardContent>
          <Hidden name="partId" />
          <Hidden name="locationId" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-2 w-full">
            <VStack>
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
                minValue={0}
              />
              <Number
                name="maximumOrderQuantity"
                label="Maximum Order Quantity"
                minValue={0}
              />
              <Number
                name="orderMultiple"
                label="Order Multiple"
                minValue={0}
              />
            </VStack>
            <VStack>
              <Number
                name="demandAccumulationPeriod"
                label="Demand Accumulation Period (Days)"
                minValue={0}
              />
              <Number
                name="demandReschedulingPeriod"
                label="Rescheduling Period (Days)"
                minValue={0}
              />
              <Boolean
                name="demandAccumulationIncludesInventory"
                label="Demand Includes Inventory"
              />
            </VStack>
            <VStack>
              <Number name="reorderPoint" label="Reorder Point" />
              <Number
                name="reorderQuantity"
                label="Reorder Quantity"
                minValue={0}
              />
              <Number
                name="reorderMaximumInventory"
                label="Reorder Maximum Inventory"
                minValue={0}
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

export default PartPlanningForm;
