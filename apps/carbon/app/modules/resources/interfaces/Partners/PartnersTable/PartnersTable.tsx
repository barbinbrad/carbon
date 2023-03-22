import { Avatar, HStack, Link, MenuItem } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { Partner } from "~/modules/resources";

type PartnersTableProps = {
  data: Partner[];
  count: number;
};

const PartnersTable = memo(({ data, count }: PartnersTableProps) => {
  const navigate = useNavigate();
  const permissions = usePermissions();
  const [params] = useUrlParams();

  const rows = data.map((row) => {
    if (Array.isArray(row.supplier)) {
      return {
        ...row,
        supplierName: row.supplier[0].name,
      };
    }
    return {
      ...row,
      supplierName: row.supplier?.name,
    };
  });

  const columns = useMemo<ColumnDef<typeof rows[number]>[]>(() => {
    return [
      {
        accessorKey: "supplier",
        header: "Supplier",
        cell: ({ row }) => (
          <HStack spacing={2}>
            <Avatar size="sm" name={row.original.supplierName} />

            <Link
              onClick={() => {
                navigate(`/x/purchasing/suppliers/${row?.original.id}`);
              }}
            >
              {row.original.supplierName}
            </Link>
          </HStack>
        ),
      },
      {
        accessorKey: "hoursPerWeek",
        header: "Hours per Week",
        cell: (item) => item.getValue(),
      },
    ];
  }, [navigate]);

  const renderContextMenu = useCallback(
    (row: typeof rows[number]) => {
      return (
        <>
          <MenuItem
            icon={<BsPencilSquare />}
            onClick={() => {
              navigate(`/x/resources/partners/${row.id}?${params.toString()}`);
            }}
          >
            Edit Partner
          </MenuItem>
          <MenuItem
            isDisabled={!permissions.can("delete", "resources")}
            icon={<IoMdTrash />}
            onClick={() => {
              navigate(
                `/x/resources/partners/delete/${row.id}?${params.toString()}`
              );
            }}
          >
            Delete Partner
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

PartnersTable.displayName = "PartnersTable";
export default PartnersTable;
