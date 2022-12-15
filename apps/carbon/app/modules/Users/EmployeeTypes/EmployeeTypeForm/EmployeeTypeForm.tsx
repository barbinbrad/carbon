import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { Color, Hidden, Input, Submit } from "~/components/Form";
import { employeeTypeValidator } from "~/services/users";
import PermissionCheckboxes from "../../components/Permission";
import type { Permission } from "../../types";

type EmployeeTypeFormProps = {
  initialValues: {
    id: string;
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
  const onClose = () => {
    navigate("/app/users/employee-types");
  };

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

  const isEditing = initialValues.id !== "";

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{isEditing ? "Edit" : "New"} Employee Type</DrawerHeader>
        <DrawerBody pb={8}>
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
            <VStack spacing={4} alignItems="start">
              <Hidden name="id" />
              <Input name="name" label="Employee Type" />
              <Color name="color" label="Color" />
              <Hidden
                name="data"
                value={JSON.stringify(Object.values(permissions))}
              />
            </VStack>
            <VStack spacing={2} alignItems="start">
              <Text fontSize="md" fontWeight="medium" my={2}>
                Permissions
              </Text>
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
          </ValidatedForm>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default EmployeeTypeForm;
