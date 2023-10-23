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
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";

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
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        validator={workCellValidator}
        method="post"
        action={
          isEditing ? path.to.workCell(initialValues.id!) : path.to.newWorkCell
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
