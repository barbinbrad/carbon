import { AvatarGroup, MenuItem } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Avatar } from "~/components";
import { Table } from "~/components";
import { usePermissions } from "~/hooks";
import type { Group } from "~/interfaces/Users/types";

type GroupsTableProps = {
  data: Group[];
  count: number;
};

const GroupsTable = memo(({ data, count }: GroupsTableProps) => {
  const navigate = useNavigate();
  const permissions = usePermissions();

  const rows = data.map((row) => ({
    id: row.data.id,
    name: row.data.name,
    isEmployeeTypeGroup: row.data.isEmployeeTypeGroup,
    isCustomerTypeGroup: row.data.isCustomerTypeGroup,
    isSupplierTypeGroup: row.data.isSupplierTypeGroup,
    members: row.data.users
      .map((user) => ({
        name: user.fullName,
        avatar: user.avatarUrl,
      }))
      .concat(
        row.children.map((child) => ({ name: child.data.name, avatar: null }))
      ),
  }));

  const columns = useMemo<ColumnDef<typeof rows[number]>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Group Name",
        cell: (item) => item.getValue(),
      },
      {
        header: "Members",
        // accessorKey: undefined, // makes the column unsortable
        cell: ({ row }) => (
          <AvatarGroup max={5} size="sm" spacing={-2}>
            {row.original.members.map(
              (
                member: { name: string | null; avatar: string | null },
                index: number
              ) => (
                <Avatar
                  key={index}
                  name={member.name ?? undefined}
                  title={member.name ?? undefined}
                  path={member.avatar}
                />
              )
            )}
          </AvatarGroup>
        ),
      },
    ];
  }, []);

  const renderContextMenu = useCallback(
    (row: typeof rows[number]) => {
      return (
        <>
          <MenuItem
            isDisabled={
              row.isEmployeeTypeGroup ||
              row.isCustomerTypeGroup ||
              row.isSupplierTypeGroup ||
              !permissions.can("update", "users")
            }
            icon={<BsPencilSquare />}
            onClick={() => {
              navigate(`/x/users/groups/${row.id}`);
            }}
          >
            Edit Group
          </MenuItem>
          <MenuItem
            isDisabled={
              row.isEmployeeTypeGroup ||
              row.isCustomerTypeGroup ||
              row.isSupplierTypeGroup ||
              !permissions.can("delete", "users")
            }
            icon={<IoMdTrash />}
            onClick={() => {
              navigate(`/x/users/groups/delete/${row.id}`);
            }}
          >
            Delete Group
          </MenuItem>
        </>
      );
    },
    [navigate, permissions]
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

GroupsTable.displayName = "GroupsTable";
export default GroupsTable;
