import { Link, MenuItem } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { PartGroup } from "~/modules/parts";

type PartGroupsTableProps = {
  data: PartGroup[];
  count: number;
};

const PartGroupsTable = memo(({ data, count }: PartGroupsTableProps) => {
  const [params] = useUrlParams();
  const navigate = useNavigate();
  const permissions = usePermissions();
  const hasAccounting =
    permissions.has("accounting") && permissions.can("view", "accounting");

  const rows = useMemo(() => data, [data]);

  const columns = useMemo<ColumnDef<(typeof rows)[number]>[]>(() => {
    const result: ColumnDef<(typeof rows)[number]>[] = [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <Link onClick={() => navigate(row.original.id)}>
            {row.original.name}
          </Link>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: (item) => item.getValue(),
      },
    ];

    return hasAccounting
      ? result.concat([
          {
            accessorKey: "salesAccountId",
            header: "Sales Account",
            cell: (item) => item.getValue(),
          },
          {
            accessorKey: "inventoryAccountId",
            header: "Inventory Account",
            cell: (item) => item.getValue(),
          },
          {
            accessorKey: "discountAccountId",
            header: "Discount Account",
            cell: (item) => item.getValue(),
          },
        ])
      : result;
  }, [hasAccounting, navigate]);

  const renderContextMenu = useCallback(
    (row: (typeof rows)[number]) => {
      return (
        <>
          <MenuItem
            isDisabled={!permissions.can("update", "parts")}
            icon={<BsPencilSquare />}
            onClick={() => {
              navigate(`/x/parts/groups/${row.id}?${params.toString()}`);
            }}
          >
            View Part Group
          </MenuItem>
          <MenuItem
            isDisabled={!permissions.can("delete", "parts")}
            icon={<IoMdTrash />}
            onClick={() => {
              navigate(`/x/parts/groups/delete/${row.id}?${params.toString()}`);
            }}
          >
            Delete Part Group
          </MenuItem>
        </>
      );
    },
    [navigate, params, permissions]
  );

  return (
    <Table<(typeof rows)[number]>
      data={data}
      columns={columns}
      count={count}
      renderContextMenu={renderContextMenu}
    />
  );
});

PartGroupsTable.displayName = "PartGroupsTable";
export default PartGroupsTable;
