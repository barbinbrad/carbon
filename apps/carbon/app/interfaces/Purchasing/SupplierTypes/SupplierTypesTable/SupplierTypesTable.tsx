import { ActionMenu } from "@carbon/react";
import { Box, Flex, MenuItem, VisuallyHidden } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import { BsPencilSquare, BsPeopleFill } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { SupplierType } from "~/interfaces/Purchasing/types";

type SupplierTypesTableProps = {
  data: SupplierType[];
  count: number;
};

const SupplierTypesTable = memo(({ data, count }: SupplierTypesTableProps) => {
  const [params] = useUrlParams();
  const navigate = useNavigate();
  const permissions = usePermissions();

  const columns = useMemo<ColumnDef<typeof data[number]>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Supplier Type",
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
                  navigate(`/app/purchasing/suppliers?type=${row.original.id}`);
                }}
              >
                View Suppliers
              </MenuItem>
              <MenuItem
                isDisabled={
                  row.original.protected ||
                  !permissions.can("update", "purchasing")
                }
                icon={<BsPencilSquare />}
                onClick={() => {
                  navigate(
                    `/app/purchasing/supplier-types/${
                      row.original.id
                    }?${params.toString()}`
                  );
                }}
              >
                Edit Supplier Type
              </MenuItem>
              <MenuItem
                isDisabled={
                  row.original.protected ||
                  !permissions.can("delete", "purchasing")
                }
                icon={<IoMdTrash />}
                onClick={() => {
                  navigate(
                    `/app/purchasing/supplier-types/delete/${
                      row.original.id
                    }?${params.toString()}`
                  );
                }}
              >
                Delete Supplier Type
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

SupplierTypesTable.displayName = "SupplierTypesTable";
export default SupplierTypesTable;
