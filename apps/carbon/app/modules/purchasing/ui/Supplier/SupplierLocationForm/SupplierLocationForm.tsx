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
import { useNavigate, useParams } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import { Hidden, Input, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import { supplierLocationValidator } from "~/modules/purchasing";
import type { TypeOfValidator } from "~/types/validators";

type SupplierLocationFormProps = {
  initialValues: TypeOfValidator<typeof supplierLocationValidator>;
};

const SupplierLocationForm = ({ initialValues }: SupplierLocationFormProps) => {
  const navigate = useNavigate();
  const { supplierId } = useParams();
  const permissions = usePermissions();
  const isEditing = !!initialValues?.id;
  const isDisabled = isEditing
    ? !permissions.can("update", "purchasing")
    : !permissions.can("create", "purchasing");

  const onClose = () => navigate(`/x/supplier/${supplierId}/locations`);

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        validator={supplierLocationValidator}
        method="post"
        action={
          isEditing
            ? `/x/supplier/${supplierId}/locations/${initialValues?.id}`
            : `/x/supplier/${supplierId}/locations/new`
        }
        defaultValues={initialValues}
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
