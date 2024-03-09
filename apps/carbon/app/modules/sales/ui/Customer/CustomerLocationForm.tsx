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
import { customerLocationValidator } from "~/modules/sales";
import { path } from "~/utils/path";

type CustomerLocationFormProps = {
  initialValues: z.infer<typeof customerLocationValidator>;
};

const CustomerLocationForm = ({ initialValues }: CustomerLocationFormProps) => {
  const navigate = useNavigate();
  const { customerId } = useParams();

  if (!customerId) throw new Error("customerId not found");

  const permissions = usePermissions();
  const isEditing = !!initialValues?.id;
  const isDisabled = isEditing
    ? !permissions.can("update", "sales")
    : !permissions.can("create", "sales");

  const onClose = () => navigate(path.to.customerLocations(customerId));

  return (
    <Drawer
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DrawerContent>
        <ValidatedForm
          validator={customerLocationValidator}
          method="post"
          action={
            isEditing
              ? path.to.customerLocation(customerId, initialValues.id!)
              : path.to.newCustomerLocation(customerId)
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

export default CustomerLocationForm;
