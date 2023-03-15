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
  Submit,
  TextArea,
  Color,
  Ability,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import { workCellTypeValidator } from "~/services/resources";
import type { TypeOfValidator } from "~/types/validators";

type WorkCellTypeFormProps = {
  initialValues: TypeOfValidator<typeof workCellTypeValidator>;
  onClose: () => void;
};

const WorkCellTypeForm = ({
  initialValues,
  onClose,
}: WorkCellTypeFormProps) => {
  const permissions = usePermissions();
  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "resources")
    : !permissions.can("create", "resources");

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        validator={workCellTypeValidator}
        method="post"
        action={
          isEditing
            ? `/x/resources/work-cells/${initialValues.id}`
            : "/x/resources/work-cells/new"
        }
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {isEditing ? "Edit" : "New"} Work Cell Type
          </DrawerHeader>
          <DrawerBody pb={8}>
            <Hidden name="id" />
            <VStack spacing={4} alignItems="start">
              <Input name="name" label="Name" />
              <TextArea name="description" label="Description" />
              <Color name="color" label="Color" />
              <Ability name="requiredAbility" label="Required Ability" />
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

export default WorkCellTypeForm;
