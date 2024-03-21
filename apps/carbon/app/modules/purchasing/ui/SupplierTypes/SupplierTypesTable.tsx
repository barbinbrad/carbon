import { Enumerable, MenuIcon, MenuItem } from "@carbon/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsFillPenFill, BsPeopleFill } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import { useCustomColumns } from "~/hooks/useCustomColumns";
import type { SupplierType } from "~/modules/purchasing";
import { path } from "~/utils/path";

type SupplierTypesTableProps = {
  data: SupplierType[];
  count: number;
};

const SupplierTypesTable = memo(({ data, count }: SupplierTypesTableProps) => {
  const [params] = useUrlParams();
  const navigate = useNavigate();
  const permissions = usePermissions();
  const customColumns = useCustomColumns("customer");

  const columns = useMemo<ColumnDef<SupplierType>[]>(() => {
    const defaultColumns = [
      {
        accessorKey: "name",
        header: "Supplier Type",
        cell: ({ row }) => (
          <Enumerable
            value={row.original.name}
            onClick={() => navigate(row.original.id as string)}
            className="cursor-pointer"
          />
        ),
      },
    ];
    return [...defaultColumns, ...customColumns];
  }, [navigate, customColumns]);

  const renderContextMenu = useCallback(
    (row: SupplierType) => {
      return (
        <>
          <MenuItem
            onClick={() => {
              navigate(`${path.to.suppliers}?type=${row.id}`);
            }}
          >
            <MenuIcon icon={<BsPeopleFill />} />
            View Suppliers
          </MenuItem>
          <MenuItem
            disabled={row.protected || !permissions.can("update", "purchasing")}
            onClick={() => {
              navigate(`${path.to.supplierType(row.id)}?${params.toString()}`);
            }}
          >
            <MenuIcon icon={<BsFillPenFill />} />
            Edit Supplier Type
          </MenuItem>
          <MenuItem
            disabled={row.protected || !permissions.can("delete", "purchasing")}
            onClick={() => {
              navigate(
                `${path.to.deleteSupplierType(row.id)}?${params.toString()}`
              );
            }}
          >
            <MenuIcon icon={<IoMdTrash />} />
            Delete Supplier Type
          </MenuItem>
        </>
      );
    },
    [navigate, params, permissions]
  );

  return (
    <Table<SupplierType>
      data={data}
      columns={columns}
      count={count}
      renderContextMenu={renderContextMenu}
    />
  );
});

SupplierTypesTable.displayName = "SupplierTypesTable";
export default SupplierTypesTable;
