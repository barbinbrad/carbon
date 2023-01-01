import { ActionMenu } from "@carbon/react";
import { Box, Flex, MenuItem, VisuallyHidden } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import { BsPencilSquare, BsPeopleFill } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components/Data";
import { usePermissions } from "~/hooks";
import type { EmployeeType } from "~/interfaces/Users/types";

type EmployeeTypesTableProps = {
  data: EmployeeType[];
  count: number;
};

const EmployeeTypesTable = memo(({ data, count }: EmployeeTypesTableProps) => {
  const navigate = useNavigate();
  const permissions = usePermissions();

  const columns = useMemo<ColumnDef<typeof data[number]>[]>(() => {
    return [
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
            <ActionMenu>
              <MenuItem
                icon={<BsPeopleFill />}
                onClick={() => {
                  navigate(`/app/users/employees?type=${row.original.id}`);
                }}
              >
                View Employees
              </MenuItem>
              <MenuItem
                isDisabled={
                  row.original.protected || !permissions.can("update", "users")
                }
                icon={<BsPencilSquare />}
                onClick={() => {
                  navigate(`/app/users/employee-types/${row.original.id}`);
                }}
              >
                Edit Employee Type
              </MenuItem>
              <MenuItem
                isDisabled={
                  row.original.protected || !permissions.can("delete", "users")
                }
                icon={<IoMdTrash />}
                onClick={() => {
                  navigate(
                    `/app/users/employee-types/delete/${row.original.id}`
                  );
                }}
              >
                Delete Employee Type
              </MenuItem>
            </ActionMenu>
          </Flex>
        ),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Table<typeof data[number]> data={data} columns={columns} count={count} />
  );
});

EmployeeTypesTable.displayName = "EmployeeTypesTable";
export default EmployeeTypesTable;
