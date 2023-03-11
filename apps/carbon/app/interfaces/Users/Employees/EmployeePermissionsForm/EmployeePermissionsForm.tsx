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
import { useFetcher, useNavigate } from "@remix-run/react";
import type { PostgrestResponse } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { Hidden, Select, Submit } from "~/components/Form";
import PermissionCheckboxes from "~/interfaces/Users/components/Permission";
import type { EmployeeType, Permission } from "~/interfaces/Users/types";
import { employeeValidator } from "~/services/users";
import type { TypeOfValidator } from "~/types/validators";
import { mapRowsToOptions } from "~/utils/form";

type EmployeePermissionsFormProps = {
  name: string;
  initialValues: TypeOfValidator<typeof employeeValidator> & {
    permissions: Record<string, Permission>;
  };
};

const EmployeePermissionsForm = ({
  name,
  initialValues,
}: EmployeePermissionsFormProps) => {
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  const employeeTypeFetcher = useFetcher<PostgrestResponse<EmployeeType>>();

  useEffect(() => {
    if (employeeTypeFetcher.type === "init") {
      employeeTypeFetcher.load("/api/users/employee-types");
    }
  }, [employeeTypeFetcher]);

  const employeeTypeOptions = mapRowsToOptions({
    data: employeeTypeFetcher.data?.data,
    value: "id",
    label: "name",
  });

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
        action={`/x/users/employees/${initialValues.id}`}
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
                isLoading={employeeTypeFetcher.state === "loading"}
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
