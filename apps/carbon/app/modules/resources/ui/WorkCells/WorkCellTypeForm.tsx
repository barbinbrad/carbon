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
  StandardFactor,
  Submit,
  TextArea,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import { workCellTypeValidator } from "~/modules/resources";
import { path } from "~/utils/path";

type WorkCellTypeFormProps = {
  initialValues: z.infer<typeof workCellTypeValidator>;
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
    <Drawer
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DrawerContent>
        <ValidatedForm
          validator={workCellTypeValidator}
          method="post"
          action={
            isEditing
              ? path.to.workCellType(initialValues.id!)
              : path.to.newWorkCellType
          }
          defaultValues={initialValues}
          className="flex flex-col h-full"
        >
          <DrawerHeader>
            <DrawerTitle>
              {isEditing ? "Edit" : "New"} Work Cell Type
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
              <Number name="quotingRate" label="Quoting Rate" />
              <Number name="laborRate" label="Labor Rate" />
              <Number name="overheadRate" label="Overhead Rate" />
              <StandardFactor
                name="defaultStandardFactor"
                label="Default Standard Factor"
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

export default WorkCellTypeForm;
