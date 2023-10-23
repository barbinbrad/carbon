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
import { Hidden, Select, Submit } from "~/components/Form";
import type { Permission } from "~/modules/users";
import { employeeValidator } from "~/modules/users";
import PermissionCheckboxes from "~/modules/users/ui/components/Permission";
import type { ListItem } from "~/types";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";

type EmployeePermissionsFormProps = {
  name: string;
  employeeTypes: ListItem[];
  initialValues: TypeOfValidator<typeof employeeValidator> & {
    permissions: Record<string, Permission>;
  };
};

const EmployeePermissionsForm = ({
  name,
  employeeTypes,
  initialValues,
}: EmployeePermissionsFormProps) => {
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  const employeeTypeOptions =
    employeeTypes?.map((et) => ({
      value: et.id,
      label: et.name,
    })) ?? [];

  const [permissions, setPermissions] = useState(initialValues.permissions);
  const updatePermissions = (module: string, permission: Permission) => {
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [module]: permission,
    }));
  };

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        validator={employeeValidator}
        method="post"
        action={path.to.employeeAccount(initialValues.id)}
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{name}</DrawerHeader>
          <DrawerBody pb={8}>
            <VStack spacing={4} alignItems="start">
              <Select
                name="employeeType"
                label="Employee Type"
                options={employeeTypeOptions}
                placeholder="Select Employee Type"
              />
              <FormLabel>Permissions</FormLabel>
              {Object.entries(permissions)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([module, data], index) => (
                  <Box key={index}>
                    <PermissionCheckboxes
                      module={module}
                      permissions={data}
                      updatePermissions={updatePermissions}
                    />
                  </Box>
                ))}
              <Hidden name="id" />
              <Hidden name="data" value={JSON.stringify(permissions)} />
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

export default EmployeePermissionsForm;
