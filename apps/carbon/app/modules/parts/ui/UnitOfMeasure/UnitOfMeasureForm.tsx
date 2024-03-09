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
import { Hidden, Input, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import { unitOfMeasureValidator } from "~/modules/parts";
import { path } from "~/utils/path";

type UnitOfMeasureFormProps = {
  initialValues: z.infer<typeof unitOfMeasureValidator>;
};

const UnitOfMeasureForm = ({ initialValues }: UnitOfMeasureFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "parts")
    : !permissions.can("create", "parts");

  return (
    <Drawer
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DrawerContent>
        <ValidatedForm
          validator={unitOfMeasureValidator}
          method="post"
          action={isEditing ? path.to.uom(initialValues.id!) : path.to.newUom}
          defaultValues={initialValues}
          className="flex flex-col h-full"
        >
          <DrawerHeader>
            <DrawerTitle>
              {isEditing ? "Edit" : "New"} Unit of Measure
            </DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Hidden name="id" />
            <VStack spacing={4}>
              <Input name="name" label="Unit of Measure" />
              <Input
                name="code"
                label="Code"
                helperText="Unique, uppercase, without spaces"
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

export default UnitOfMeasureForm;
