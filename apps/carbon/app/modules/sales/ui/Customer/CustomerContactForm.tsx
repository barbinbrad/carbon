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
import { useNavigate, useParams } from "@remix-run/react";
import type { z } from "zod";
import {
  DatePicker,
  Hidden,
  Input,
  PhoneInput,
  Submit,
  TextArea,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import { customerContactValidator } from "~/modules/sales";
import { path } from "~/utils/path";

type CustomerContactFormProps = {
  initialValues: z.infer<typeof customerContactValidator>;
};

const CustomerContactForm = ({ initialValues }: CustomerContactFormProps) => {
  const navigate = useNavigate();
  const { customerId } = useParams();

  if (!customerId) throw new Error("customerId not found");

  const permissions = usePermissions();
  const isEditing = !!initialValues?.id;
  const isDisabled = isEditing
    ? !permissions.can("update", "sales")
    : !permissions.can("create", "sales");

  const onClose = () => navigate(path.to.customerContacts(customerId));

  return (
    <Drawer
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DrawerContent>
        <ValidatedForm
          validator={customerContactValidator}
          method="post"
          action={
            isEditing
              ? path.to.customerContact(customerId, initialValues.id!)
              : path.to.newCustomerContact(customerId)
          }
          defaultValues={initialValues}
          onSubmit={onClose}
          className="flex flex-col h-full"
        >
          <DrawerHeader>
            <DrawerTitle>{isEditing ? "Edit" : "New"} Contact</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Hidden name="id" />
            <Hidden name="contactId" />
            <VStack spacing={4}>
              <Input name="firstName" label="First Name" />
              <Input name="lastName" label="Last Name" />
              <Input name="email" label="Email" />
              <Input name="title" label="Title" />
              <PhoneInput name="mobilePhone" label="Mobile Phone" />
              <PhoneInput name="homePhone" label="Home Phone" />
              <PhoneInput name="workPhone" label="Work Phone" />
              <PhoneInput name="fax" label="Fax" />
              <Input name="addressLine1" label="Address Line 1" />
              <Input name="addressLine2" label="Address Line 2" />
              <Input name="city" label="City" />
              <Input name="state" label="State" />
              <Input name="postalCode" label="Zip Code" />
              {/* Country dropdown */}
              <DatePicker name="birthday" label="Birthday" />
              <TextArea name="notes" label="Notes" />
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

export default CustomerContactForm;
