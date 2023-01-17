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
import { useParams } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import {
  DatePicker,
  Hidden,
  Input,
  Phone,
  Submit,
  TextArea,
} from "~/components/Form";
import type {
  SupplierContact,
  SupplierLocation,
} from "~/interfaces/Purchasing/types";
import { supplierContactValidator } from "~/services/purchasing";

type SupplierContactFormProps = {
  contact?: SupplierContact;
  locations?: SupplierLocation[];
  onClose: () => void;
};

const SupplierContactForm = ({
  contact,
  locations = [],
  onClose,
}: SupplierContactFormProps) => {
  const { supplierId } = useParams();
  const isEditing = !!contact?.id;
  if (Array.isArray(contact?.contact))
    throw new Error("contact.contact is an array");

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        validator={supplierContactValidator}
        method="post"
        action={
          isEditing
            ? `/app/purchasing/suppliers/${supplierId}/contact/${contact?.id}`
            : `/app/purchasing/suppliers/${supplierId}/contact/new`
        }
        defaultValues={{
          id: contact?.id ?? undefined,
          contactId: contact?.contact?.id ?? undefined,
          firstName: contact?.contact?.firstName ?? "",
          lastName: contact?.contact?.lastName ?? "",
          email: contact?.contact?.email ?? "",
          title: contact?.contact?.title ?? "",
          mobilePhone: contact?.contact?.mobilePhone ?? "",
          homePhone: contact?.contact?.homePhone ?? "",
          workPhone: contact?.contact?.workPhone ?? "",
          fax: contact?.contact?.fax ?? "",
          addressLine1: contact?.contact?.addressLine1 ?? "",
          addressLine2: contact?.contact?.addressLine2 ?? "",
          city: contact?.contact?.city ?? "",
          state: contact?.contact?.state ?? "",
          postalCode: contact?.contact?.postalCode ?? "",
          birthday: contact?.contact?.birthday ?? undefined,
        }}
        onSubmit={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{isEditing ? "Edit" : "New"} Contact</DrawerHeader>
          <DrawerBody pb={8}>
            <Hidden name="id" />
            <Hidden name="contactId" />
            <VStack spacing={4} alignItems="start">
              <Input name="firstName" label="First Name" />
              <Input name="lastName" label="Last Name" />
              <Input name="email" label="Email" />
              <Input name="title" label="Title" />
              <Phone name="mobilePhone" label="Mobile Phone" />
              <Phone name="homePhone" label="Home Phone" />
              <Phone name="workPhone" label="Work Phone" />
              <Phone name="fax" label="Fax" />
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
            <HStack spacing={2}>
              <Submit>Save</Submit>
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

export default SupplierContactForm;
