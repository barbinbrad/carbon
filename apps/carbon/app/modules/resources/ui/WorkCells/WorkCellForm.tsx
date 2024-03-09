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
  DatePicker,
  Department,
  Hidden,
  Input,
  Location,
  Select,
  Submit,
  TextArea,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import { workCellValidator } from "~/modules/resources";
import { path } from "~/utils/path";

type WorkCellFormProps = {
  initialValues: z.infer<typeof workCellValidator>;
  workCellTypes: {
    id: string;
    name: string;
  }[];
  onClose: () => void;
};

const WorkCellForm = ({
  initialValues,
  workCellTypes,
  onClose,
}: WorkCellFormProps) => {
  const permissions = usePermissions();

  const options =
    workCellTypes?.map((cell) => ({
      value: cell.id,
      label: cell.name,
    })) ?? [];

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
          validator={workCellValidator}
          method="post"
          action={
            isEditing
              ? path.to.workCell(initialValues.id!)
              : path.to.newWorkCell
          }
          defaultValues={initialValues}
          className="flex flex-col h-full"
        >
          <DrawerHeader>
            <DrawerTitle>{isEditing ? "Edit" : "New"} Work Cell</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Hidden name="id" />
            <VStack spacing={4}>
              <Input name="name" label="Name" />
              <TextArea name="description" label="Description" />
              <Select
                name="workCellTypeId"
                label="Work Cell Type"
                options={options}
              />
              <Location name="locationId" label="Location" />
              <Department name="departmentId" label="Department" />
              <DatePicker name="activeDate" label="Active Date" />
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

export default WorkCellForm;
