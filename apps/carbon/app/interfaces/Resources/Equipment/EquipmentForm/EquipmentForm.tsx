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
import {
  Input,
  Hidden,
  Number,
  Submit,
  Select,
  TextArea,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import { equipmentValidator } from "~/services/resources";
import { mapRowsToOptions } from "~/utils/form";

type EquipmentFormProps = {
  initialValues: {
    id?: string;
    name: string;
    description: string;
    equipmentTypeId: string;
    operatorsRequired: number;
    workCellId?: string;
  };
  equipmentTypes: {
    id: string;
    name: string;
  }[];
  onClose: () => void;
};

const EquipmentForm = ({
  initialValues,
  equipmentTypes,
  onClose,
}: EquipmentFormProps) => {
  const permissions = usePermissions();
  const options = mapRowsToOptions({
    data: equipmentTypes,
    value: "id",
    label: "name",
  });
  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "resources")
    : !permissions.can("create", "resources");

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        validator={equipmentValidator}
        method="post"
        action={
          isEditing
            ? `/x/resources/equipment/unit/${initialValues.id}`
            : "/x/resources/equipment/unit/new"
        }
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{isEditing ? "Edit" : "New"} Equipment</DrawerHeader>
          <DrawerBody pb={8}>
            <Hidden name="id" />
            <VStack spacing={2} alignItems="start">
              <Input name="name" label="Name" />
              <TextArea name="description" label="Description" />
              <Select
                name="equipmentTypeId"
                label="Equipment Type"
                options={options}
              />
              <Number
                name="operatorsRequired"
                label="Operators Required"
                min={0}
                max={100} // this seems like a reasonable max?
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

export default EquipmentForm;
