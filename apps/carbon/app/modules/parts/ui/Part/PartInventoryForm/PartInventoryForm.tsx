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
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { CreatableSelect, Hidden, Number, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import type { PartQuantities } from "~/modules/parts";
import { partInventoryValidator } from "~/modules/parts";
import type { ListItem } from "~/types";
import type { TypeOfValidator } from "~/types/validators";

type PartInventoryFormProps = {
  initialValues: Omit<
    TypeOfValidator<typeof partInventoryValidator>,
    "hasNewShelf"
  >;
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
  const [hasNewShelf, setHasNewShelf] = useState(false);
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
      <Card w="full">
        <CardHeader>
          <HStack w="full" justifyContent="space-between">
            <Heading size="md">Inventory</Heading>
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
                  window.location.href = `/x/part/${initialValues.partId}/inventory?location=${selected?.value}`;
                }}
              />
            </Box>
          </HStack>
        </CardHeader>
        <CardBody>
          <Hidden name="partId" />
          <Hidden name="locationId" />
          <Hidden name="hasNewShelf" value={hasNewShelf.toString()} />
          <Grid
            gridTemplateColumns={["1fr", "1fr", "1fr 1fr 1fr"]}
            gridColumnGap={8}
            gridRowGap={2}
            w="full"
          >
            <VStack alignItems="start" spacing={2} w="full">
              <CreatableSelect
                options={shelfOptions}
                name="defaultShelfId"
                label="Default Shelf"
                onUsingCreatedChanged={setHasNewShelf}
                // @ts-ignore
                w="full"
              />
              <Number
                name="quantityOnHand"
                label="Quantity On Hand"
                isReadOnly
              />
            </VStack>
            <VStack alignItems="start" spacing={2} w="full">
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
            <VStack alignItems="start" spacing={2} w="full">
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
          </Grid>
        </CardBody>
        <CardFooter>
          <Submit isDisabled={!permissions.can("update", "parts")}>Save</Submit>
        </CardFooter>
      </Card>
    </ValidatedForm>
  );
};

export default PartInventoryForm;
