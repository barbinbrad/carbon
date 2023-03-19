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
  Location,
  Submit,
  Select,
  TextArea,
  Department,
  DatePicker,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import { workCellValidator } from "~/modules/resources";
import type { TypeOfValidator } from "~/types/validators";
import { mapRowsToOptions } from "~/utils/form";

type WorkCellFormProps = {
  initialValues: TypeOfValidator<typeof workCellValidator>;
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
  const options = mapRowsToOptions({
    data: workCellTypes,
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
        validator={workCellValidator}
        method="post"
        action={
          isEditing
            ? `/x/resources/work-cells/cell/${initialValues.id}`
            : "/x/resources/work-cells/cell/new"
        }
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{isEditing ? "Edit" : "New"} Work Cell</DrawerHeader>
          <DrawerBody pb={8}>
            <Hidden name="id" />
            <VStack spacing={2} alignItems="start">
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

export default WorkCellForm;
