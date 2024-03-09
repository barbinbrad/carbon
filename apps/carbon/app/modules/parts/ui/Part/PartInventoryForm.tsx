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
import { useRevalidator } from "@remix-run/react";
import type { z } from "zod";
import { Combobox } from "~/components";
import { CreatableCombobox, Hidden, Number, Submit } from "~/components/Form";
import { usePermissions, useUser } from "~/hooks";
import { useSupabase } from "~/lib/supabase";
import type { PartQuantities } from "~/modules/parts";
import { partInventoryValidator } from "~/modules/parts";
import type { ListItem } from "~/types";
import { path } from "~/utils/path";

type PartInventoryFormProps = {
  initialValues: z.infer<typeof partInventoryValidator>;
  quantities: PartQuantities;
  locations: ListItem[];
  shelves: string[];
};

const PartInventoryForm = ({
  initialValues,
  locations,
  quantities,
  shelves,
}: PartInventoryFormProps) => {
  const permissions = usePermissions();
  const { supabase } = useSupabase();
  const user = useUser();
  const revalidator = useRevalidator();

  const shelfOptions = shelves.map((shelf) => ({ value: shelf, label: shelf }));
  const locationOptions = locations.map((location) => ({
    label: location.name,
    value: location.id,
  }));

  return (
    <ValidatedForm
      method="post"
      validator={partInventoryValidator}
      defaultValues={{ ...quantities, ...initialValues }}
    >
      <Card>
        <HStack className="w-full justify-between items-start">
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
          </CardHeader>

          <CardAction>
            <Combobox
              size="sm"
              value={initialValues.locationId}
              options={locationOptions}
              onChange={(selected) => {
                // hard refresh because initialValues update has no effect otherwise
                window.location.href = `${path.to.partInventory(
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
              <CreatableCombobox
                name="defaultShelfId"
                label="Default Shelf"
                options={shelfOptions}
                onCreateOption={async (option) => {
                  const response = await supabase?.from("shelf").insert({
                    id: option,
                    locationId: initialValues.locationId,
                    createdBy: user.id,
                  });
                  if (response && response.error === null)
                    revalidator.revalidate();
                }}
                className="w-full"
              />

              <Number
                name="quantityOnHand"
                label="Quantity On Hand"
                isReadOnly
              />
            </VStack>
            <VStack>
              <Number
                name="quantityAvailable"
                label="Quantity Available"
                isReadOnly
              />
              <Number
                name="quantityOnPurchaseOrder"
                label="Quantity On Purchase Order"
                isReadOnly
              />
            </VStack>
            <VStack>
              <Number
                name="quantityOnProdOrder"
                label="Quantity On Prod Order"
                isReadOnly
              />
              <Number
                name="quantityOnSalesOrder"
                label="Quantity On Sales Order"
                isReadOnly
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

export default PartInventoryForm;
