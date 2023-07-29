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
import { receiptValidator } from "~/modules/inventory";
import type { TypeOfValidator } from "~/types/validators";

type ReceiptFormProps = {
  initialValues: TypeOfValidator<typeof receiptValidator>;
};

const ReceiptForm = ({ initialValues }: ReceiptFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "inventory")
    : !permissions.can("create", "inventory");

  return (
    <Drawer onClose={onClose} isOpen={true} size="full">
      <ValidatedForm
        validator={receiptValidator}
        method="post"
        action={
          isEditing
            ? `/x/inventory/receipts/${initialValues.id}`
            : "/x/inventory/receipts/new"
        }
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{isEditing ? "Edit" : "New"} Receipt</DrawerHeader>
          <DrawerBody pb={8}>
            <Hidden name="id" />
            <VStack spacing={4} alignItems="start"></VStack>
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

export default ReceiptForm;
