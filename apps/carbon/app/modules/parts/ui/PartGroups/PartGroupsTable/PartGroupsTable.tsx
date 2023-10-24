import { Link, MenuItem } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { PartGroup } from "~/modules/parts";
import { path } from "~/utils/path";

type PartGroupsTableProps = {
  data: PartGroup[];
  count: number;
};

const PartGroupsTable = memo(({ data, count }: PartGroupsTableProps) => {
  const [params] = useUrlParams();
  const navigate = useNavigate();
  const permissions = usePermissions();
  // const hasAccounting =
  //   permissions.has("accounting") && permissions.can("view", "accounting");

  const rows = useMemo(() => data, [data]);

  const columns = useMemo<ColumnDef<(typeof rows)[number]>[]>(
    () => [
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
    ],
    [navigate]
  );

  const renderContextMenu = useCallback(
    (row: (typeof rows)[number]) => {
      return (
        <>
          <MenuItem
            isDisabled={!permissions.can("update", "parts")}
            icon={<BsPencilSquare />}
            onClick={() => {
              navigate(`${path.to.partGroup(row.id)}?${params.toString()}`);
            }}
          >
            Edit Part Group
          </MenuItem>
          <MenuItem
            isDisabled={!permissions.can("delete", "parts")}
            icon={<IoMdTrash />}
            onClick={() => {
              navigate(
                `${path.to.deletePartGroup(row.id)}?${params.toString()}`
              );
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
