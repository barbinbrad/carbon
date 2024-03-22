import { Enumerable, HStack, MenuIcon, MenuItem } from "@carbon/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsFillPenFill } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { New, TableNew } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { Department } from "~/modules/resources";
import { path } from "~/utils/path";

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

  const columns = useMemo<ColumnDef<(typeof rows)[number]>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Department",
        cell: ({ row }) => (
          <Enumerable
            value={row.original.name}
            onClick={() => navigate(row.original.id)}
            className="cursor-pointer"
          />
        ),
      },
      {
        header: "Sub-Departments",
        cell: ({ row }) => (
          <HStack>
            {row.original.parentDepartment.split(", ").map((v) => (
              <Enumerable key={v} value={v} />
            ))}
          </HStack>
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
              navigate(`${path.to.department(row.id)}?${params.toString()}`);
            }}
          >
            <MenuIcon icon={<BsFillPenFill />} />
            Edit Department
          </MenuItem>
          <MenuItem
            disabled={!permissions.can("delete", "resources")}
            onClick={() => {
              navigate(
                `${path.to.deleteDepartment(row.id)}?${params.toString()}`
              );
            }}
          >
            <MenuIcon icon={<IoMdTrash />} />
            Delete Department
          </MenuItem>
        </>
      );
    },
    [navigate, params, permissions]
  );

  return (
    <TableNew<(typeof rows)[number]>
      data={rows}
      count={count}
      columns={columns}
      primaryAction={
        permissions.can("create", "resources") && (
          <New label="Department" to={`new?${params.toString()}`} />
        )
      }
      renderContextMenu={renderContextMenu}
    />
  );
});

DepartmentsTable.displayName = "DepartmentsTable";
export default DepartmentsTable;
