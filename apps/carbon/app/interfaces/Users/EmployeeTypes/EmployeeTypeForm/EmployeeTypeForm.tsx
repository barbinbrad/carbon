import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { Color, Hidden, Input, Submit } from "~/components/Form";
import PermissionCheckboxes from "~/interfaces/Users/components/Permission";
import type { Permission } from "~/interfaces/Users/types";
import { employeeTypeValidator } from "~/services/users";

type EmployeeTypeFormProps = {
  initialValues: {
    id?: string;
    name: string;
    color: string;
    permissions: Record<
      string,
      {
        id: string;
        permission: Permission;
      }
    >;
  };
};

const EmployeeTypeForm = ({ initialValues }: EmployeeTypeFormProps) => {
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  const [permissions, setPermissions] = useState(initialValues.permissions);
  const updatePermissions = (module: string, permission: Permission) => {
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [module]: {
        id: prevPermissions[module].id,
        permission,
      },
    }));
  };

  const isEditing = initialValues.id !== undefined;

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        validator={employeeTypeValidator}
        method="post"
        action={
          isEditing
            ? `/app/users/employee-types/${initialValues.id}`
            : "/app/users/employee-types/new"
        }
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {isEditing ? "Edit" : "New"} Employee Type
          </DrawerHeader>
          <DrawerBody pb={8}>
            <Hidden name="id" />
            <VStack spacing={4} alignItems="start">
              <Input name="name" label="Employee Type" />
              <Color name="color" label="Color" />
              <Hidden
                name="data"
                value={JSON.stringify(Object.values(permissions))}
              />
            </VStack>
            <VStack spacing={2} alignItems="start">
              <FormLabel>Default Permissions</FormLabel>
              {Object.entries(permissions)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([module, data], index) => (
                  <Box key={index}>
                    <PermissionCheckboxes
                      module={module}
                      permissions={data.permission}
                      updatePermissions={updatePermissions}
                    />
                  </Box>
                ))}
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

export default EmployeeTypeForm;
