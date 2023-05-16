import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import { Hidden, Input, Select, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import { shippingMethodValidator } from "~/modules/inventory";
import type { TypeOfValidator } from "~/types/validators";
import { mapRowsToOptions } from "~/utils/form";

type ShippingMethodFormProps = {
  initialValues: TypeOfValidator<typeof shippingMethodValidator>;
  accounts: {
    number: string;
    name: string;
  }[];
};

const ShippingMethodForm = ({
  initialValues,
  accounts,
}: ShippingMethodFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "inventory")
    : !permissions.can("create", "inventory");

  const shippingCarrierOptions = ["UPS", "FedEx", "USPS", "DHL", "Other"].map(
    (v) => ({
      label: v,
      value: v,
    })
  );

  const accountOptions = mapRowsToOptions({
    data: accounts,
    value: "number",
    label: "name",
  });

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        validator={shippingMethodValidator}
        method="post"
        action={
          isEditing
            ? `/x/inventory/shipping-methods/${initialValues.id}`
            : "/x/inventory/shipping-methods/new"
        }
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {isEditing ? "Edit" : "New"} Shipping Method
          </DrawerHeader>
          <DrawerBody pb={8}>
            <Hidden name="id" />
            <VStack spacing={4} alignItems="start">
              <Input name="name" label="Name" />
              <Select
                name="carrier"
                label="Carrier"
                options={shippingCarrierOptions}
              />
              <Select
                name="carrierAccountId"
                label="Carrier Account"
                options={accountOptions}
              />
              <Input
                name="trackingUrl"
                label="Tracking URL"
                prefix="https://"
              />
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <HStack spacing={2}>
              <Submit isDisabled={isDisabled}>Save</Submit>
              <Button
                size="md"
                colorScheme="gray"
                variant="solid"
                onClick={onClose}
              >
                Cancel
              </Button>
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </ValidatedForm>
    </Drawer>
  );
};

export default ShippingMethodForm;
