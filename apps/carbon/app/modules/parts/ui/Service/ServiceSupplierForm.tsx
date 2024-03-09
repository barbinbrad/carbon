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
import { Hidden, Input, Submit, Supplier } from "~/components/Form";
import { usePermissions } from "~/hooks";
import { serviceSupplierValidator } from "~/modules/parts";
import { path } from "~/utils/path";

type ServiceSupplierFormProps = {
  initialValues: z.infer<typeof serviceSupplierValidator>;
};

const ServiceSupplierForm = ({ initialValues }: ServiceSupplierFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const { serviceId } = useParams();

  if (!serviceId) throw new Error("serviceId not found");

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "parts")
    : !permissions.can("create", "parts");

  const onClose = () => navigate(-1);

  return (
    <Drawer
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DrawerContent>
        <ValidatedForm
          defaultValues={initialValues}
          validator={serviceSupplierValidator}
          method="post"
          action={
            isEditing
              ? path.to.serviceSupplier(serviceId, initialValues.id!)
              : path.to.newServiceSupplier(serviceId)
          }
          className="flex flex-col h-full"
        >
          <DrawerHeader>
            <DrawerTitle>
              {isEditing ? "Edit" : "New"} Service Supplier
            </DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Hidden name="id" />
            <Hidden name="serviceId" />

            <VStack spacing={4}>
              <Supplier name="supplierId" label="Supplier" />
              <Input name="supplierServiceId" label="Supplier Service ID" />
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

export default ServiceSupplierForm;
