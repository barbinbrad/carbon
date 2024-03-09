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
import { useNavigate } from "@remix-run/react";
import type { z } from "zod";
import { Account, Hidden, Input, Select, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import { shippingMethodValidator } from "~/modules/inventory";
import { path } from "~/utils/path";

type ShippingMethodFormProps = {
  initialValues: z.infer<typeof shippingMethodValidator>;
};

const ShippingMethodForm = ({ initialValues }: ShippingMethodFormProps) => {
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

  return (
    <Drawer
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DrawerContent>
        <ValidatedForm
          validator={shippingMethodValidator}
          method="post"
          action={
            isEditing
              ? path.to.shippingMethod(initialValues.id!)
              : path.to.newShippingMethod
          }
          defaultValues={initialValues}
          className="flex flex-col h-full"
        >
          <DrawerHeader>
            <DrawerTitle>
              {isEditing ? "Edit" : "New"} Shipping Method
            </DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Hidden name="id" />
            <VStack spacing={4}>
              <Input name="name" label="Name" />
              <Select
                name="carrier"
                label="Carrier"
                options={shippingCarrierOptions}
              />
              <Account
                classes={["Expense"]}
                name="carrierAccountId"
                label="Carrier Account"
              />
              <Input
                name="trackingUrl"
                label="Tracking URL"
                prefix="https://"
              />
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

export default ShippingMethodForm;
