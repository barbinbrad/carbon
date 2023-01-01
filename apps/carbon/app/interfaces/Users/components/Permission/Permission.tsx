import { Box, Checkbox, Stack } from "@chakra-ui/react";
import { capitalize } from "~/utils/string";
import type { Permission } from "~/interfaces/Users/types";

type PermissionProps = {
  module: string;
  permissions: Permission;
  updatePermissions: (module: string, permissions: Permission) => void;
};

const labels = ["view", "create", "update", "delete"] as const;

const PermissionCheckboxes = ({
  module,
  permissions,
  updatePermissions,
}: PermissionProps) => {
  const allChecked = Object.values(permissions).every(Boolean);
  const isIndeterminate =
    Object.values(permissions).some(Boolean) && !allChecked;

  const updateByPosition = (position: number, value: boolean) => {
    const newPermissions = { ...permissions };
    newPermissions[labels[position]] = value;
    updatePermissions(module, newPermissions);
  };

  return (
    <Box mb={8}>
      <Checkbox
        isChecked={allChecked}
        isIndeterminate={isIndeterminate}
        onChange={(e) =>
          updatePermissions(module, {
            view: e.target.checked,
            create: e.target.checked,
            update: e.target.checked,
            delete: e.target.checked,
          })
        }
      >
        {capitalize(module)}
      </Checkbox>
      <Stack pl={6} mt={2} spacing={2}>
        {labels.map((verb, index) => (
          <Checkbox
            key={index}
            isChecked={permissions[verb]}
            onChange={(e) => updateByPosition(index, e.target.checked)}
          >
            {`${capitalize(labels[index])} ${capitalize(module)}`}
          </Checkbox>
        ))}
      </Stack>
    </Box>
  );
};

export default PermissionCheckboxes;
