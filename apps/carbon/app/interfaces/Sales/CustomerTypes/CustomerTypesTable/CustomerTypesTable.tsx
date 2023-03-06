import { Box, MenuItem } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsPencilSquare, BsPeopleFill } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { CustomerType } from "~/interfaces/Sales/types";

type CustomerTypesTableProps = {
  data: CustomerType[];
  count: number;
};

const CustomerTypesTable = memo(({ data, count }: CustomerTypesTableProps) => {
  const [params] = useUrlParams();
  const navigate = useNavigate();
  const permissions = usePermissions();

  const columns = useMemo<ColumnDef<typeof data[number]>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Customer Type",
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
    ];
  }, []);

  const renderContextMenu = useCallback(
    (row: typeof data[number]) => {
      return (
        <>
          <MenuItem
            icon={<BsPeopleFill />}
            onClick={() => {
              navigate(`/x/sales/customers?type=${row.id}`);
            }}
          >
            View Customers
          </MenuItem>
          <MenuItem
            isDisabled={row.protected || !permissions.can("update", "sales")}
            icon={<BsPencilSquare />}
            onClick={() => {
              navigate(
                `/x/sales/customer-types/${row.id}?${params.toString()}`
              );
            }}
          >
            Edit Customer Type
          </MenuItem>
          <MenuItem
            isDisabled={row.protected || !permissions.can("delete", "sales")}
            icon={<IoMdTrash />}
            onClick={() => {
              navigate(
                `/x/sales/customer-types/delete/${row.id}?${params.toString()}`
              );
            }}
          >
            Delete Customer Type
          </MenuItem>
        </>
      );
    },
    [navigate, params, permissions]
  );

  return (
    <Table<typeof data[number]>
      data={data}
      columns={columns}
      count={count}
      renderContextMenu={renderContextMenu}
    />
  );
});

CustomerTypesTable.displayName = "CustomerTypesTable";
export default CustomerTypesTable;
