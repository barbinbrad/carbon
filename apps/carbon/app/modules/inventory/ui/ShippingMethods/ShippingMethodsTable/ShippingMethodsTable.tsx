import { Link, MenuItem } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { ShippingMethod } from "~/modules/inventory";
import { path } from "~/utils/path";

type ShippingMethodsTableProps = {
  data: ShippingMethod[];
  count: number;
};

const ShippingMethodsTable = memo(
  ({ data, count }: ShippingMethodsTableProps) => {
    const [params] = useUrlParams();
    const navigate = useNavigate();
    const permissions = usePermissions();
    const hasAccounting =
      permissions.has("accounting") && permissions.can("view", "accounting");

    const rows = useMemo(() => data, [data]);

    const columns = useMemo<ColumnDef<(typeof data)[number]>[]>(() => {
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
          accessorKey: "carrier",
          header: "Carrier",
          cell: (item) => item.getValue(),
        },
        {
          accessorKey: "trackingUrl",
          header: "Tracking URL",
          cell: (item) => item.getValue(),
        },
      ];

      return hasAccounting
        ? result.concat([
            {
              accessorKey: "carrierAccountId",
              header: "Carrier Account",
              cell: (item) => item.getValue(),
            },
          ])
        : result;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [permissions]);

    const renderContextMenu = useCallback(
      (row: (typeof data)[number]) => {
        return (
          <>
            <MenuItem
              isDisabled={!permissions.can("update", "inventory")}
              icon={<BsPencilSquare />}
              onClick={() => {
                navigate(
                  `${path.to.shippingMethod(row.id)}?${params.toString()}`
                );
              }}
            >
              Edit Shipping Method
            </MenuItem>
            <MenuItem
              isDisabled={!permissions.can("delete", "inventory")}
              icon={<IoMdTrash />}
              onClick={() => {
                navigate(
                  `${path.to.deleteShippingMethod(row.id)}?${params.toString()}`
                );
              }}
            >
              Delete Shipping Method
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
  }
);

ShippingMethodsTable.displayName = "ShippingMethodsTable";
export default ShippingMethodsTable;
