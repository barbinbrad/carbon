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
import { useFetcher } from "@remix-run/react";
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
  supplierId: string;
  initialValues: z.infer<typeof supplierContactValidator>;
  type?: "modal" | "drawer";
  open?: boolean;
  onClose: () => void;
};

const SupplierContactForm = ({
  supplierId,
  initialValues,
  open = true,
  type = "drawer",
  onClose,
}: SupplierContactFormProps) => {
  const fetcher = useFetcher();

  const permissions = usePermissions();
  const isEditing = !!initialValues?.id;
  const isDisabled = isEditing
    ? !permissions.can("update", "purchasing")
    : !permissions.can("create", "purchasing");

  return (
    <Drawer
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose?.();
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
          fetcher={fetcher}
          className="flex flex-col h-full"
          onSubmit={() => {
            if (type === "modal") {
              onClose?.();
            }
          }}
        >
          <DrawerHeader>
            <DrawerTitle>{isEditing ? "Edit" : "New"} Contact</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Hidden name="id" />
            <Hidden name="type" value={type} />
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
              {/* <CustomFormFields table="supplierContact" />*/}
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
