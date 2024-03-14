import { Hyperlink, MenuIcon, MenuItem } from "@carbon/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsFillPenFill, BsPeopleFill } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { EmployeeType } from "~/modules/users";
import { path } from "~/utils/path";

type EmployeeTypesTableProps = {
  data: EmployeeType[];
  count: number;
};

const EmployeeTypesTable = memo(({ data, count }: EmployeeTypesTableProps) => {
  const [params] = useUrlParams();
  const navigate = useNavigate();
  const permissions = usePermissions();

  const columns = useMemo<ColumnDef<(typeof data)[number]>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Employee Type",
        cell: ({ row, getValue }) =>
          row.original.protected ? (
            getValue()
          ) : (
            <Hyperlink onClick={() => navigate(row.original.id)}>
              {row.original.name}
            </Hyperlink>
          ),
      },
    ];
  }, [navigate]);

  const renderContextMenu = useCallback(
    (row: (typeof data)[number]) => {
      return (
        <>
          <MenuItem
            onClick={() => {
              navigate(`${path.to.employeeAccounts}?type=${row.id}`);
            }}
          >
            <MenuIcon icon={<BsPeopleFill />} />
            View Employees
          </MenuItem>
          <MenuItem
            disabled={row.protected || !permissions.can("update", "users")}
            onClick={() => {
              navigate(`${path.to.employeeType(row.id)}?${params.toString()}`);
            }}
          >
            <MenuIcon icon={<BsFillPenFill />} />
            Edit Employee Type
          </MenuItem>
          <MenuItem
            disabled={row.protected || !permissions.can("delete", "users")}
            onClick={() => {
              navigate(
                `${path.to.deleteEmployeeType(row.id)}?${params.toString()}`
              );
            }}
          >
            <MenuIcon icon={<IoMdTrash />} />
            Delete Employee Type
          </MenuItem>
        </>
      );
    },
    [navigate, params, permissions]
  );

  return (
    <Table<(typeof data)[number]>
      data={data}
      columns={columns}
      count={count}
      renderContextMenu={renderContextMenu}
    />
  );
});

EmployeeTypesTable.displayName = "EmployeeTypesTable";
export default EmployeeTypesTable;
