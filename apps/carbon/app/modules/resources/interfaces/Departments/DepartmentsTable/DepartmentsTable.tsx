import { Box, MenuItem } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { Department } from "~/modules/resources";

type DepartmentsTableProps = {
  data: Department[];
  count: number;
};

const DepartmentsTable = memo(({ data, count }: DepartmentsTableProps) => {
  const navigate = useNavigate();
  const permissions = usePermissions();
  const [params] = useUrlParams();

  const rows = data.map((row) => ({
    ...row,
    parentDepartment:
      (Array.isArray(row.department)
        ? row.department.map((d) => d.name).join(", ")
        : row.department?.name) ?? "",
  }));

  const columns = useMemo<ColumnDef<typeof rows[number]>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Department",
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
        header: "Sub-Departments",
        cell: ({ row }) => row.original.parentDepartment,
      },
    ];
  }, []);

  const renderContextMenu = useCallback(
    (row: typeof data[number]) => {
      return (
        <>
          <MenuItem
            icon={<BsPencilSquare />}
            onClick={() => {
              navigate(
                `/x/resources/departments/${row.id}?${params.toString()}`
              );
            }}
          >
            Edit Department
          </MenuItem>
          <MenuItem
            isDisabled={!permissions.can("delete", "resources")}
            icon={<IoMdTrash />}
            onClick={() => {
              navigate(
                `/x/resources/departments/delete/${row.id}?${params.toString()}`
              );
            }}
          >
            Delete Department
          </MenuItem>
        </>
      );
    },
    [navigate, params, permissions]
  );

  return (
    <Table<typeof rows[number]>
      data={rows}
      count={count}
      columns={columns}
      renderContextMenu={renderContextMenu}
    />
  );
});

DepartmentsTable.displayName = "DepartmentsTable";
export default DepartmentsTable;
