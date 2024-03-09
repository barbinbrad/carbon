import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  HStack,
  VStack,
} from "@carbon/react";

import { ValidatedForm } from "@carbon/remix-validated-form";
import { useNavigate, useParams } from "@remix-run/react";
import type { z } from "zod";
import { Hidden, Input, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import { supplierLocationValidator } from "~/modules/purchasing";
import { path } from "~/utils/path";

type SupplierLocationFormProps = {
  initialValues: z.infer<typeof supplierLocationValidator>;
};

const SupplierLocationForm = ({ initialValues }: SupplierLocationFormProps) => {
  const navigate = useNavigate();
  const { supplierId } = useParams();

  if (!supplierId) throw new Error("supplierId not found");

  const permissions = usePermissions();
  const isEditing = !!initialValues?.id;
  const isDisabled = isEditing
    ? !permissions.can("update", "purchasing")
    : !permissions.can("create", "purchasing");

  const onClose = () => navigate(path.to.supplierLocations(supplierId));

  return (
    <Drawer
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DrawerContent>
        <ValidatedForm
          validator={supplierLocationValidator}
          method="post"
          action={
            isEditing
              ? path.to.supplierLocation(supplierId, initialValues.id!)
              : path.to.newSupplierLocation(supplierId)
          }
          defaultValues={initialValues}
          onSubmit={onClose}
          className="flex flex-col h-full"
        >
          <DrawerHeader>
            <DrawerTitle>{isEditing ? "Edit" : "New"} Location</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Hidden name="id" />
            <Hidden name="addressId" />
            <VStack spacing={4}>
              <Input name="addressLine1" label="Address Line 1" />
              <Input name="addressLine2" label="Address Line 2" />
              <Input name="city" label="City" />
              <Input name="state" label="State" />
              <Input name="postalCode" label="Zip Code" />
              {/* Country dropdown */}
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <HStack>
              <Submit isDisabled={isDisabled}>Save</Submit>
              <Button size="md" variant="solid" onClick={onClose}>
                Cancel
              </Button>
            </HStack>
          </DrawerFooter>
        </ValidatedForm>
      </DrawerContent>
    </Drawer>
  );
};

export default SupplierLocationForm;
