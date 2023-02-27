import {
  Button,
  Checkbox,
  CheckboxGroup,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  HStack,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import { Hidden, Input, Location, Submit, TimePicker } from "~/components/Form";
import { usePermissions } from "~/hooks";
import { shiftValidator } from "~/services/resources";

type ShiftFormProps = {
  initialValues: {
    id?: string;
    name: string;
    startTime?: string;
    endTime?: string;
    locationId?: string;
  };
};

const ShiftForm = ({ initialValues }: ShiftFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "resources")
    : !permissions.can("create", "resources");

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        validator={shiftValidator}
        method="post"
        action={
          isEditing
            ? `/x/resources/shifts/${initialValues.id}`
            : "/x/resources/shifts/new"
        }
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{isEditing ? "Edit" : "New"} Shift</DrawerHeader>
          <DrawerBody pb={8}>
            <Hidden name="id" />
            <VStack spacing={4} alignItems="start">
              <Input name="name" label="Shift Name" />
              <Location name="locationId" label="Location" />
              <TimePicker name="startTime" label="Start Time" />
              <TimePicker name="endTime" label="End Time" />
              <CheckboxGroup
                colorScheme="blackAlpha"
                defaultValue={[
                  "monday",
                  "tuesday",
                  "wednesday",
                  "thursday",
                  "friday",
                ]}
              >
                <FormControl>
                  <FormLabel>Days</FormLabel>
                  <VStack w="full" alignItems="start">
                    <Checkbox value="sunday">Sunday</Checkbox>
                    <Checkbox value="monday">Monday</Checkbox>
                    <Checkbox value="tuesday">Tuesday</Checkbox>
                    <Checkbox value="wednesday">Wednesday</Checkbox>
                    <Checkbox value="thursday">Thursday</Checkbox>
                    <Checkbox value="friday">Friday</Checkbox>
                    <Checkbox value="saturday">Saturday</Checkbox>
                  </VStack>
                </FormControl>
              </CheckboxGroup>
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

export default ShiftForm;
