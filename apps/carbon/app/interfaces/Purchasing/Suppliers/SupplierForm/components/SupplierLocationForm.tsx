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
import { DatePicker, Input, Phone, Submit, TextArea } from "~/components/Form";
import type { SupplierLocation } from "~/interfaces/Purchasing/types";
import { supplierLocationValidator } from "~/services/purchasing";

type SupplierContactFormProps = {
  location?: SupplierLocation;
  onClose: () => void;
};

const SupplierContactForm = ({
  location,
  onClose,
}: SupplierContactFormProps) => {
  const { supplierId } = useParams();
  // @ts-ignore
  const isEditing = !!location?.id;
  if (Array.isArray(location?.address))
    throw new Error("location.address is an array");

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        validator={supplierLocationValidator}
        method="post"
        action={
          isEditing
            ? // @ts-ignore
              `/app/purchasing/suppliers/${supplierId}/location/${location?.id}`
            : `/app/purchasing/suppliers/${supplierId}/location/new`
        }
        defaultValues={{
          id: location?.id ?? "",
          name: location?.name ?? "",
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
          <DrawerHeader>{isEditing ? "Edit" : "New"} Contact</DrawerHeader>
          <DrawerBody pb={8}>
            <VStack spacing={4} alignItems="start">
              <Input name="name" label="Location Name" />
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
              <Submit>Save</Submit>
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

export default SupplierContactForm;
