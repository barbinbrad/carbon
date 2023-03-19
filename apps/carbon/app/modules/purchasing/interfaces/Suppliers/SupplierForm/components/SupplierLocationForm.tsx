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
import { useParams } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import { Hidden, Input, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import type { SupplierLocation } from "~/modules/purchasing";
import { supplierLocationValidator } from "~/modules/purchasing";

type SupplierLocationFormProps = {
  location?: SupplierLocation;
  onClose: () => void;
};

const SupplierLocationForm = ({
  location,
  onClose,
}: SupplierLocationFormProps) => {
  const { supplierId } = useParams();
  const permissions = usePermissions();
  const isEditing = !!location?.id;
  const isDisabled = isEditing
    ? !permissions.can("update", "purchasing")
    : !permissions.can("create", "purchasing");

  if (Array.isArray(location?.address))
    throw new Error("location.address is an array");

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        validator={supplierLocationValidator}
        method="post"
        action={
          isEditing
            ? `/x/purchasing/suppliers/${supplierId}/location/${location?.id}`
            : `/x/purchasing/suppliers/${supplierId}/location/new`
        }
        defaultValues={{
          id: location?.id ?? undefined,
          addressId: location?.address?.id ?? undefined,

          addressLine1: location?.address?.addressLine1 ?? "",
          addressLine2: location?.address?.addressLine2 ?? "",
          city: location?.address?.city ?? "",
          state: location?.address?.state ?? "",
          postalCode: location?.address?.postalCode ?? "",
        }}
        onSubmit={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{isEditing ? "Edit" : "New"} Location</DrawerHeader>
          <DrawerBody pb={8}>
            <Hidden name="id" />
            <Hidden name="addressId" />
            <VStack spacing={4} alignItems="start">
              <Input name="addressLine1" label="Address Line 1" />
              <Input name="addressLine2" label="Address Line 2" />
              <Input name="city" label="City" />
              <Input name="state" label="State" />
              <Input name="postalCode" label="Zip Code" />
              {/* Country dropdown */}
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

export default SupplierLocationForm;
