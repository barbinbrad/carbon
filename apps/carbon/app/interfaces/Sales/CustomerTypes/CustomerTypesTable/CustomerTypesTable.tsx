import { ActionMenu } from "@carbon/react";
import { Box, Flex, MenuItem, VisuallyHidden } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo } from "react";
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
      {
        accessorKey: "id",
        header: () => <VisuallyHidden>Actions</VisuallyHidden>,
        cell: ({ row }) => (
          <Flex justifyContent="end">
            <ActionMenu>
              <MenuItem
                icon={<BsPeopleFill />}
                onClick={() => {
                  navigate(`/app/sales/customers?type=${row.original.id}`);
                }}
              >
                View Customers
              </MenuItem>
              <MenuItem
                isDisabled={
                  row.original.protected || !permissions.can("update", "sales")
                }
                icon={<BsPencilSquare />}
                onClick={() => {
                  navigate(
                    `/app/sales/customer-types/${
                      row.original.id
                    }?${params.toString()}`
                  );
                }}
              >
                Edit Customer Type
              </MenuItem>
              <MenuItem
                isDisabled={
                  row.original.protected || !permissions.can("delete", "sales")
                }
                icon={<IoMdTrash />}
                onClick={() => {
                  navigate(
                    `/app/sales/customer-types/delete/${
                      row.original.id
                    }?${params.toString()}`
                  );
                }}
              >
                Delete Customer Type
              </MenuItem>
            </ActionMenu>
          </Flex>
        ),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <Table<typeof data[number]> data={data} columns={columns} count={count} />
  );
});

CustomerTypesTable.displayName = "CustomerTypesTable";
export default CustomerTypesTable;
