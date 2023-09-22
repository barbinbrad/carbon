import { Link, MenuItem } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { Table } from "~/components";
import { useUrlParams } from "~/hooks";
import type { Customer } from "~/modules/sales";

type CustomersTableProps = {
  data: Customer[];
  count: number;
};

const CustomersTable = memo(({ data, count }: CustomersTableProps) => {
  const navigate = useNavigate();
  const [params] = useUrlParams();

  const columns = useMemo<ColumnDef<Customer>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <Link onClick={() => navigate(`/x/customer/${row.original.id}`)}>
            {row.original.name}
          </Link>
        ),
      },
      {
        accessorKey: "type",
        header: "Customer Type",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "status",
        header: "Customer Status",
        cell: (item) => item.getValue(),
      },
      // {
      //   id: "orders",
      //   header: "Orders",
      //   cell: ({ row }) => (
      //     <ButtonGroup size="sm" isAttached variant="outline">
      //       <Button
      //         onClick={() =>
      //           navigate(`/x/sales/orders?customerId=${row.original.id}`)
      //         }
      //       >
      //         {row.original.orderCount ?? 0} Orders
      //       </Button>
      //       <IconButton
      //         aria-label="New Order"
      //         icon={<BsPlus />}
      //         onClick={() =>
      //           navigate(`/x/purchase-order/new?customerId=${row.original.id}`)
      //         }
      //       />
      //     </ButtonGroup>
      //   ),
      // },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const renderContextMenu = useMemo(
    // eslint-disable-next-line react/display-name
    () => (row: Customer) =>
      (
        <MenuItem
          icon={<BsPencilSquare />}
          onClick={() =>
            navigate(`/x/sales/customers/${row.id}?${params.toString()}`)
          }
        >
          Edit Customer
        </MenuItem>
      ),
    [navigate, params]
  );

  return (
    <>
      <Table<Customer>
        count={count}
        columns={columns}
        data={data}
        withPagination
        renderContextMenu={renderContextMenu}
      />
    </>
  );
});

CustomersTable.displayName = "CustomerTable";

export default CustomersTable;
