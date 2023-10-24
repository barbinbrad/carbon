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
import { useNavigate, useParams } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import {
  DatePicker,
  Hidden,
  Input,
  Phone,
  Submit,
  TextArea,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import { supplierContactValidator } from "~/modules/purchasing";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";

type SupplierContactFormProps = {
  initialValues: TypeOfValidator<typeof supplierContactValidator>;
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
    <Drawer onClose={onClose} isOpen={true} size="sm">
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

export default SupplierContactForm;
