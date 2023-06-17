import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  HStack,
  Input as ChakraInput,
  VStack,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "@remix-run/react";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { Account, Hidden, Part, Select, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import type { PurchaseOrderLineType } from "~/modules/purchasing";
import { purchaseOrderLineValidator } from "~/modules/purchasing";
import type { TypeOfValidator } from "~/types/validators";

type PurchaseOrderLineFormProps = {
  initialValues: TypeOfValidator<typeof purchaseOrderLineValidator>;
  purchaseOrderLineTypes: PurchaseOrderLineType[];
};

const PurchaseOrderLineForm = ({
  initialValues,
  purchaseOrderLineTypes,
}: PurchaseOrderLineFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [type, setType] = useState(initialValues.purchaseOrderLineType);
  const [description, setDescription] = useState(initialValues.description);

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "purchasing")
    : !permissions.can("create", "purchasing");

  const purchaseOrderLineTypeOptions = purchaseOrderLineTypes.map((type) => ({
    label: type,
    value: type,
  }));

  const onClose = () => navigate(-1);

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        defaultValues={initialValues}
        validator={purchaseOrderLineValidator}
        method="post"
        action={
          isEditing
            ? `/x/purchase-order/${orderId}/lines/${initialValues.id}`
            : `/x/purchase-order/${orderId}/lines/new`
        }
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {isEditing ? "Edit" : "New"} Purchase Order Line
          </DrawerHeader>
          <DrawerBody pb={8}>
            <Hidden name="id" />
            <Hidden name="purchaseOrderId" />
            <Hidden name="description" value={description} />
            <VStack spacing={4} alignItems="start">
              <Select
                name="purchaseOrderLineType"
                label="Type"
                options={purchaseOrderLineTypeOptions}
                onChange={({ value }) => {
                  setType(value as PurchaseOrderLineType);
                  setDescription("");
                }}
              />
              {type === "Part" && (
                <Part
                  name="partId"
                  label="Part"
                  partReplenishmentSystem="Buy"
                  onChange={({ label }) => {
                    // TODO: don't let part number contain " - "
                    const [, ...description] = label.split(" - ");
                    setDescription(description.join(" - "));
                  }}
                />
              )}

              {type === "G/L Account" && (
                <Account
                  name="accountNumber"
                  label="Account"
                  onChange={({ label }) => {
                    setDescription(label);
                  }}
                />
              )}
              {type === "Fixed Asset" && (
                // TODO: implement Fixed Asset
                <Select name="assetId" label="Asset" options={[]} />
              )}
              <FormControl>
                <FormLabel>Description</FormLabel>
                <ChakraInput
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <HStack>
              <Submit isDisabled={isDisabled}>Save</Submit>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </ValidatedForm>
    </Drawer>
  );
};

export default PurchaseOrderLineForm;
