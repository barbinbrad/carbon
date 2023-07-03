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
import { Hidden, Input, Number, Submit, Supplier } from "~/components/Form";
import { usePermissions } from "~/hooks";
import { partSupplierValidator } from "~/modules/parts";
import type { TypeOfValidator } from "~/types/validators";

type PartSupplierFormProps = {
  initialValues: TypeOfValidator<typeof partSupplierValidator>;
};

const PartSupplierForm = ({ initialValues }: PartSupplierFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const { partId } = useParams();

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "parts")
    : !permissions.can("create", "parts");

  const onClose = () => navigate(-1);

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        defaultValues={initialValues}
        validator={partSupplierValidator}
        method="post"
        action={
          isEditing
            ? `/x/part/${partId}/suppliers/${initialValues.id}`
            : `/x/part/${partId}/suppliers/new`
        }
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {isEditing ? "Edit" : "New"} Purchase Order Line
          </DrawerHeader>
          <DrawerBody pb={8}>
            <Hidden name="id" />
            <Hidden name="partId" />

            <VStack spacing={4} alignItems="start">
              <Supplier name="supplierId" label="Supplier" />
              <Input name="supplierPartId" label="Supplier Part ID" />
              {/* <UnitOfMeasure name="supplierUnitOfMeasureCode" label="Unit of Measure" /> */}
              <Number
                name="minimumOrderQuantity"
                label="Minimum Order Quantity"
              />
              <Number name="conversionFactor" label="Conversion Factor" />
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <HStack>
              <Submit isDisabled={isDisabled}>Save</Submit>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </ValidatedForm>
    </Drawer>
  );
};

export default PartSupplierForm;
