import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import {
  Boolean,
  CreatableSelect,
  Hidden,
  Number,
  Submit,
} from "~/components/Form";
import { partInventoryValidator } from "~/modules/parts";
import type { TypeOfValidator } from "~/types/validators";

type PartInventoryFormProps = {
  initialValues: Omit<
    TypeOfValidator<typeof partInventoryValidator>,
    "hasNewShelf"
  >;
  shelves: string[];
};

const PartInventoryForm = ({
  initialValues,
  shelves,
}: PartInventoryFormProps) => {
  const [hasNewShelf, setHasNewShelf] = useState(false);
  const shelfOptions = shelves.map((shelf) => ({ value: shelf, label: shelf }));

  return (
    <ValidatedForm
      method="post"
      validator={partInventoryValidator}
      defaultValues={{
        ...initialValues,
        // TODO: Remove these defaults once the API is ready
        // @ts-expect-error
        quantityOnHand: 0,
        quantityAvailable: 0,
        quantityOnPurchaseOrder: 0,
        quantityOnProdOrder: 0,
        quantityOnSalesOrder: 0,
      }}
    >
      <Card w="full">
        <CardHeader>
          <Heading size="md">Inventory</Heading>
        </CardHeader>
        <CardBody>
          <Hidden name="partId" />
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
                name="shelfId"
                label="Shelf"
                onUsingCreatedChanged={setHasNewShelf}
                // @ts-ignore
                w="full"
              />
              <Number
                name="quantityOnHand"
                label="Quantity On Hand"
                isReadOnly
              />
              <Number
                name="quantityAvailable"
                label="Quantity Available"
                isReadOnly
              />
            </VStack>
            <VStack alignItems="start" spacing={2} w="full">
              <Number
                name="quantityOnPurchaseOrder"
                label="Quantity On Purchase Order"
                isReadOnly
              />
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
            <VStack alignItems="start" spacing={2} w="full">
              <Number name="unitVolume" label="Unit Volume" />
              <Number name="unitWeight" label="Unit Weight" />
              <Boolean name="stockoutWarning" label="Stockout Warning" />
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

export default PartInventoryForm;
