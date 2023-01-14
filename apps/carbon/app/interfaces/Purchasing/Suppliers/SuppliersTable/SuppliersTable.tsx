import { ActionMenu } from "@carbon/react";
import { Flex, MenuItem, VisuallyHidden } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { Supplier } from "~/interfaces/Purchasing/types";

type SuppliersTableProps = {
  data: Supplier[];
  count: number;
};

const SuppliersTable = memo(({ data, count }: SuppliersTableProps) => {
  const navigate = useNavigate();
  const permissions = usePermissions();
  const [params] = useUrlParams();

  const columns = useMemo<ColumnDef<Supplier>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Name",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "supplierType.name",
        header: "Supplier Type",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "supplierStatus.name",
        header: "Supplier Status",
        cell: (item) => item.getValue(),
      },
      {
        header: () => <VisuallyHidden>Actions</VisuallyHidden>,
        accessorKey: "id",
        cell: (item) => (
          <Flex justifyContent="end">
            {permissions.can("update", "users") && (
              <ActionMenu>
                <MenuItem
                  icon={<BsPencilSquare />}
                  onClick={() =>
                    navigate(
                      `/app/sales/suppliers/${
                        item.getValue() as string
                      }?${params.toString()}`
                    )
                  }
                >
                  Edit Supplier
                </MenuItem>
              </ActionMenu>
            )}
          </Flex>
        ),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <>
      <Table<Supplier>
        count={count}
        columns={columns}
        data={data}
        withFilters
        withPagination
      />
    </>
  );
});

SuppliersTable.displayName = "SupplierTable";

export default SuppliersTable;
