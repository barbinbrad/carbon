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
import { Hidden, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import { purchaseOrderLineValidator } from "~/modules/purchasing";
import type { TypeOfValidator } from "~/types/validators";

type PurchaseOrderLineFormProps = {
  initialValues: TypeOfValidator<typeof purchaseOrderLineValidator>;
};

const PurchaseOrderLineForm = ({
  initialValues,
}: PurchaseOrderLineFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "purchasing")
    : !permissions.can("create", "purchasing");

  const onClose = () => navigate(-1);

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        defaultValues={initialValues}
        validator={purchaseOrderLineValidator}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {isEditing ? "Edit" : "New"} Purchase Order Line
          </DrawerHeader>
          <DrawerBody pb={8}>
            <Hidden name="id" />
            <VStack spacing={4} alignItems="start"></VStack>
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
