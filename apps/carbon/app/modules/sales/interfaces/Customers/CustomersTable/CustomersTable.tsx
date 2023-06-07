import { Button, ButtonGroup, IconButton, MenuItem } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import { BsPencilSquare, BsPlus } from "react-icons/bs";
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
        cell: (item) => item.getValue(),
      },
      {
        // @ts-ignore
        accessorFn: (item) => item.customerType?.name ?? "",
        header: "Customer Type",
        cell: (item) => item.getValue(),
      },
      {
        // @ts-ignore
        accessorFn: (item) => item.customerStatus?.name ?? "",
        header: "Customer Status",
        cell: (item) => item.getValue(),
      },
      {
        id: "orders",
        header: "Orders",
        cell: () => (
          <ButtonGroup
            size="sm"
            isAttached
            variant="outline"
            onClick={(e) => e.stopPropagation()}
          >
            <Button onClick={() => console.log("orders")}>0 Orders</Button>
            <IconButton
              aria-label="New Order"
              icon={<BsPlus />}
              onClick={() => console.log("new order")}
            />
          </ButtonGroup>
        ),
      },
      {
        id: "parts",
        header: "Parts",
        cell: () => (
          <ButtonGroup
            size="sm"
            isAttached
            variant="outline"
            onClick={(e) => e.stopPropagation()}
          >
            <Button onClick={() => console.log("orders")}>0 Parts</Button>
            <IconButton
              aria-label="New Part"
              icon={<BsPlus />}
              onClick={() => console.log("new part")}
            />
          </ButtonGroup>
        ),
      },
    ];
  }, []);

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
        renderContextMenu={renderContextMenu}
        withPagination
      />
    </>
  );
});

CustomersTable.displayName = "CustomerTable";

export default CustomersTable;
