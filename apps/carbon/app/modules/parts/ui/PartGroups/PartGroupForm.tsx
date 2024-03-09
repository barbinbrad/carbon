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
import { Hidden, Input, Submit, TextArea } from "~/components/Form";
import { usePermissions } from "~/hooks";
import { partGroupValidator } from "~/modules/parts";
import { path } from "~/utils/path";

type PartGroupFormProps = {
  initialValues: z.infer<typeof partGroupValidator>;
};

const PartGroupForm = ({ initialValues }: PartGroupFormProps) => {
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
          validator={partGroupValidator}
          method="post"
          action={
            isEditing
              ? path.to.partGroup(initialValues.id!)
              : path.to.newPartGroup
          }
          defaultValues={initialValues}
          className="flex flex-col h-full"
        >
          <DrawerHeader>
            <DrawerTitle>{isEditing ? "Edit" : "New"} Part Group</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Hidden name="id" />
            <VStack spacing={4}>
              <Input name="name" label="Part Group" />
              <TextArea name="description" label="Description" />
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

export default PartGroupForm;
