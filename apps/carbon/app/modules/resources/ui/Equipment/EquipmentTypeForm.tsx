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
import type { z } from "zod";
import {
  Ability,
  Color,
  Hidden,
  Input,
  Number,
  Submit,
  TextArea,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import { equipmentTypeValidator } from "~/modules/resources";
import { path } from "~/utils/path";

type EquipmentTypeFormProps = {
  initialValues: z.infer<typeof equipmentTypeValidator>;
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
    <Drawer
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DrawerContent>
        <ValidatedForm
          validator={equipmentTypeValidator}
          method="post"
          action={
            isEditing
              ? path.to.equipmentType(initialValues.id!)
              : path.to.newEquipmentType
          }
          defaultValues={initialValues}
          className="flex flex-col h-full"
        >
          <DrawerHeader>
            <DrawerTitle>
              {isEditing ? "Edit" : "New"} Equipment Type
            </DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Hidden name="id" />
            <VStack spacing={4}>
              <Input name="name" label="Name" />
              <TextArea name="description" label="Description" />
              <Color name="color" label="Color" />
              <Ability
                name="requiredAbility"
                label="Required Ability"
                isClearable
              />
              <Number name="setupHours" label="Setup Hours" />
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

export default EquipmentTypeForm;
