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
import { ValidatedForm } from "remix-validated-form";
import { Input, Hidden, Submit, TextArea, Color } from "~/components/Form";
import { usePermissions } from "~/hooks";
import { equipmentTypeValidator } from "~/services/resources";

type EquipmentTypeFormProps = {
  initialValues: {
    id?: string;
    name: string;
    color: string;
    description: string;
  };
  onClose: () => void;
};

const EquipmentTypeForm = ({
  initialValues,
  onClose,
}: EquipmentTypeFormProps) => {
  const permissions = usePermissions();
  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "resources")
    : !permissions.can("create", "resources");

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        validator={equipmentTypeValidator}
        method="post"
        action={
          isEditing
            ? `/x/resources/equipment/${initialValues.id}`
            : "/x/resources/equipment/new"
        }
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {isEditing ? "Edit" : "New"} Equipment Type
          </DrawerHeader>
          <DrawerBody pb={8}>
            <Hidden name="id" />
            <VStack spacing={4} alignItems="start">
              <Input name="name" label="Name" />
              <TextArea name="description" label="Description" />
              <Color name="color" label="Color" />
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

export default EquipmentTypeForm;
