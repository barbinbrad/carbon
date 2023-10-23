import {
  Button,
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
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import {
  Boolean,
  Hidden,
  Input,
  Location,
  Submit,
  TimePicker,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import { shiftValidator } from "~/modules/resources";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";

type ShiftFormProps = {
  initialValues: TypeOfValidator<typeof shiftValidator>;
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
        action={isEditing ? path.to.shift(initialValues.id!) : path.to.newShift}
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

              <FormControl>
                <FormLabel>Days</FormLabel>
                <VStack w="full" alignItems="start">
                  <Boolean name="monday" description="Monday" />
                  <Boolean name="tuesday" description="Tuesday" />
                  <Boolean name="wednesday" description="Wednesday" />
                  <Boolean name="thursday" description="Thursday" />
                  <Boolean name="friday" description="Friday" />
                  <Boolean name="saturday" description="Saturday" />
                  <Boolean name="sunday" description="Sunday" />
                </VStack>
              </FormControl>
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
