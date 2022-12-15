import { ActionMenu } from "@carbon/react";
import { Box, Flex, MenuItem, VisuallyHidden } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import { memo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components/Data";
import { usePermissions } from "~/hooks";
import type { EmployeeType } from "~/modules/Users/types";

type EmployeeTypesTableProps = {
  data: EmployeeType[];
  count: number;
};

const EmployeeTypesTable = memo(({ data, count }: EmployeeTypesTableProps) => {
  const navigate = useNavigate();
  const permissions = usePermissions();

  const rows = data.map((row) => ({
    id: row.id,
    protected: row.protected,
    name: row.name,
    color: row.color,
  }));

  return (
    <Table<typeof rows[number]>
      data={rows}
      columns={[
        {
          accessorKey: "name",
          header: "Employee Type",
          cell: (item) => item.getValue(),
        },
        {
          accessorKey: "color",
          header: "Color",
          cell: (item) => (
            <Box
              aria-label="Color"
              w={6}
              h={6}
              borderRadius="md"
              bg={item.getValue() ?? "#000000"}
              role="img"
            />
          ),
        },
        {
          accessorKey: "id",
          header: () => <VisuallyHidden>Actions</VisuallyHidden>,
          cell: ({ row }) => (
            <Flex justifyContent="end">
              {!row.original.protected &&
                (permissions.can("update", "users") ||
                  permissions.can("delete", "users")) && (
                  <ActionMenu>
                    {permissions.can("update", "users") && (
                      <MenuItem
                        icon={<BsPencilSquare />}
                        onClick={() => {
                          navigate(
                            `/app/users/employee-types/${row.original.id}`
                          );
                        }}
                      >
                        Edit Employee Type
                      </MenuItem>
                    )}
                    {permissions.can("delete", "users") && (
                      <MenuItem
                        icon={<IoMdTrash />}
                        onClick={() => {
                          navigate(
                            `/app/users/employee-types/delete/${row.original.id}`
                          );
                        }}
                      >
                        Delete Employee Type
                      </MenuItem>
                    )}
                  </ActionMenu>
                )}
            </Flex>
          ),
        },
      ]}
      count={count}
    />
  );
});

EmployeeTypesTable.displayName = "EmployeeTypesTable";
export default EmployeeTypesTable;
