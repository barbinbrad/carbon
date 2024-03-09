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
import { Color, Department, Hidden, Input, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import { departmentValidator } from "~/modules/resources";
import { path } from "~/utils/path";

type DepartmentFormProps = {
  initialValues: z.infer<typeof departmentValidator>;
};

const DepartmentForm = ({ initialValues }: DepartmentFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "resources")
    : !permissions.can("create", "resources");

  return (
    <Drawer
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DrawerContent>
        <ValidatedForm
          validator={departmentValidator}
          method="post"
          action={
            isEditing
              ? path.to.department(initialValues.id!)
              : path.to.newDepartment
          }
          defaultValues={initialValues}
          className="flex flex-col h-full"
        >
          <DrawerHeader>
            <DrawerTitle>{isEditing ? "Edit" : "New"} Department</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Hidden name="id" />
            <VStack spacing={4}>
              <Input name="name" label="Department Name" />
              <Color name="color" label="Color" />
              <Department name="parentDepartmentId" label="Parent Department" />
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

export default DepartmentForm;
