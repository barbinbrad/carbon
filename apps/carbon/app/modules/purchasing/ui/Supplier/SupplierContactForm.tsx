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
import { supplierContactValidator } from "~/modules/purchasing";
import { path } from "~/utils/path";

type SupplierContactFormProps = {
  initialValues: z.infer<typeof supplierContactValidator>;
};

const SupplierContactForm = ({ initialValues }: SupplierContactFormProps) => {
  const navigate = useNavigate();
  const { supplierId } = useParams();

  if (!supplierId) throw new Error("supplierId not found");

  const permissions = usePermissions();
  const isEditing = !!initialValues?.id;
  const isDisabled = isEditing
    ? !permissions.can("update", "purchasing")
    : !permissions.can("create", "purchasing");

  const onClose = () => navigate(path.to.supplierContacts(supplierId));

  return (
    <Drawer
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DrawerContent>
        <ValidatedForm
          validator={supplierContactValidator}
          method="post"
          action={
            isEditing
              ? path.to.supplierContact(supplierId, initialValues.id!)
              : path.to.newSupplierContact(supplierId)
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

export default SupplierContactForm;
