import { useColor } from "@carbon/react";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { Employees, Hidden, Radios, Submit } from "~/components/Form";
import { bulkPermissionsValidator } from "~/services/users";
import PermissionCheckboxes from "../../components/Permission";
import type { Permission } from "../../types";

type BulkEditPermissionsProps = {
  userIds: string[];
  isOpen: boolean;
  onClose: () => void;
};

const BulkEditPermissions = ({
  userIds,
  isOpen,
  onClose,
}: BulkEditPermissionsProps) => {
  const [permissions, setPermissions] = useState<Record<string, Permission>>(
    {}
  );

  const updatePermissions = (module: string, permission: Permission) => {
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [module]: permission,
    }));
  };

  const emptyPermissionsFetcher = useFetcher<{
    permissions: Record<
      string,
      {
        id: string;
        permission: Permission;
      }
    >;
  }>();

  useEffect(() => {
    if (emptyPermissionsFetcher.type === "init") {
      emptyPermissionsFetcher.load("/resource/users/empty-permissions");
    }
  }, [emptyPermissionsFetcher]);

  useEffect(() => {
    if (emptyPermissionsFetcher.data) {
      let emptyPermissions: Record<string, Permission> = {};
      Object.entries(emptyPermissionsFetcher.data.permissions).forEach(
        ([module, data]) => {
          emptyPermissions[module] = data.permission;
        }
      );
      setPermissions(emptyPermissions);
    }
  }, [emptyPermissionsFetcher.data]);

  return (
    <Drawer onClose={onClose} isOpen={isOpen} size="sm">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Bulk Edit Permissions</DrawerHeader>
        <DrawerBody pb={8}>
          <ValidatedForm
            validator={bulkPermissionsValidator}
            method="post"
            action="/x/users/bulk-edit-permissions"
            onSubmit={onClose}
            defaultValues={{ userIds }}
          >
            <VStack spacing={4} alignItems="start">
              <Box
                borderColor={useColor("gray.200")}
                borderRadius="lg"
                borderStyle="solid"
                borderWidth={1}
                p={4}
                w="full"
              >
                <Radios
                  name="editType"
                  label="Type of Permission Update"
                  options={[
                    {
                      label: "Add Permissions",
                      value: "add",
                    },
                    {
                      label: "Update Permissions",
                      value: "update",
                    },
                  ]}
                />
              </Box>

              <Employees
                name="userIds"
                selectionsMaxHeight={"calc(100vh - 330px)"}
                label="Users to Update"
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
              <Hidden name="data" value={JSON.stringify(permissions)} />
              <HStack spacing={2} my={4}>
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
            </VStack>
          </ValidatedForm>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default BulkEditPermissions;
