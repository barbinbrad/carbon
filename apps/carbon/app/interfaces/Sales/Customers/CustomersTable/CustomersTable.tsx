import { ActionMenu } from "@carbon/react";
import { Flex, MenuItem, VisuallyHidden } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { Customer } from "~/interfaces/Sales/types";

type CustomersTableProps = {
  data: Customer[];
  count: number;
};

const CustomersTable = memo(({ data, count }: CustomersTableProps) => {
  const navigate = useNavigate();
  const permissions = usePermissions();
  const [params] = useUrlParams();

  const columns = useMemo<ColumnDef<Customer>[]>(() => {
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
        accessorKey: "customerType.name",
        header: "Supplier Type",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "customerStatus.name",
        header: "Customer Status",
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
                      `/app/sales/customers/${
                        item.getValue() as string
                      }?${params.toString()}`
                    )
                  }
                >
                  Edit Customer
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
      <Table<Customer>
        count={count}
        columns={columns}
        data={data}
        withPagination
      />
    </>
  );
});

CustomersTable.displayName = "CustomerTable";

export default CustomersTable;
