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
import { useNavigate } from "@remix-run/react";
import type { z } from "zod";
import { Hidden, Input, Submit, Timezone } from "~/components/Form";
import { usePermissions } from "~/hooks";
import { locationValidator } from "~/modules/resources";
import { path } from "~/utils/path";

type LocationFormProps = {
  initialValues: z.infer<typeof locationValidator>;
};

const LocationForm = ({ initialValues }: LocationFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

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
          validator={locationValidator}
          method="post"
          action={
            isEditing
              ? path.to.location(initialValues.id!)
              : path.to.newLocation
          }
          defaultValues={initialValues}
          className="flex flex-col h-full"
        >
          <DrawerHeader>
            <DrawerTitle>{isEditing ? "Edit" : "New"} Location</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Hidden name="id" />
            <VStack spacing={4}>
              <Input name="name" label="Location Name" />
              <Input name="addressLine1" label="Address Line 1" />
              <Input name="addressLine2" label="Address Line 2" />
              <Input name="city" label="City" />
              <Input name="state" label="State" />
              <Input name="postalCode" label="Postal Code" />
              {/* <Country name="country" label="Country" /> */}
              <Timezone name="timezone" label="Timezone" />
              {/* <Number name="latitude" label="Latitude" minValue={-90} maxValue={90} />
              <Number name="longitude" label="Longitude" minVale={-180} maxValue={180} /> */}
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

export default LocationForm;
