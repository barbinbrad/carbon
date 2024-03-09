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
import { useMemo } from "react";
import type { z } from "zod";
import {
  Combobox,
  Hidden,
  Input,
  Number,
  Submit,
  Supplier,
} from "~/components/Form";
import { usePermissions, useRouteData } from "~/hooks";
import type { UnitOfMeasureListItem } from "~/modules/parts";
import { partSupplierValidator } from "~/modules/parts";
import { path } from "~/utils/path";

type PartSupplierFormProps = {
  initialValues: z.infer<typeof partSupplierValidator>;
};

const PartSupplierForm = ({ initialValues }: PartSupplierFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const { partId } = useParams();

  if (!partId) throw new Error("partId not found");

  const sharedPartData = useRouteData<{
    unitOfMeasures: UnitOfMeasureListItem[];
  }>(path.to.partRoot);

  const unitOfMeasureOptions = useMemo(() => {
    return (
      sharedPartData?.unitOfMeasures.map((unitOfMeasure) => ({
        label: unitOfMeasure.name,
        value: unitOfMeasure.code,
      })) ?? []
    );
  }, [sharedPartData?.unitOfMeasures]);

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
          validator={partSupplierValidator}
          method="post"
          action={
            isEditing
              ? path.to.partSupplier(partId, initialValues.id!)
              : path.to.newPartSupplier(partId)
          }
          className="flex flex-col h-full"
        >
          <DrawerHeader>
            <DrawerTitle>
              {isEditing ? "Edit" : "New"} Part Supplier
            </DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Hidden name="id" />
            <Hidden name="partId" />

            <VStack spacing={4}>
              <Supplier name="supplierId" label="Supplier" />
              <Input name="supplierPartId" label="Supplier Part ID" />
              <Combobox
                name="supplierUnitOfMeasureCode"
                label="Unit of Measure"
                options={unitOfMeasureOptions}
              />
              <Number
                name="minimumOrderQuantity"
                label="Minimum Order Quantity"
                minValue={0}
              />
              <Number
                name="conversionFactor"
                label="Conversion Factor"
                minValue={0}
              />
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

export default PartSupplierForm;
