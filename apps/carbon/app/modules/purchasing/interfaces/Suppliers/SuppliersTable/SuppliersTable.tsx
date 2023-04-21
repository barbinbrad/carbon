import { Button, ButtonGroup, IconButton, MenuItem } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import { BsPencilSquare, BsPlus } from "react-icons/bs";
import { Table } from "~/components";
import { useUrlParams } from "~/hooks";
import type { Supplier } from "~/modules/purchasing";

type SuppliersTableProps = {
  data: Supplier[];
  count: number;
};

const SuppliersTable = memo(({ data, count }: SuppliersTableProps) => {
  const navigate = useNavigate();
  const [params] = useUrlParams();

  const columns = useMemo<ColumnDef<Supplier>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Name",
        cell: (item) => item.getValue(),
      },
      {
        // @ts-ignore
        accessorFn: (item) => item.supplierType?.name ?? "",
        header: "Supplier Type",
        cell: (item) => item.getValue(),
      },
      {
        // @ts-ignore
        accessorFn: (item) => item.supplierStatus?.name ?? "",
        header: "Supplier Status",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const renderContextMenu = useMemo(
    // eslint-disable-next-line react/display-name
    () => (row: Supplier) =>
      (
        <MenuItem
          icon={<BsPencilSquare />}
          onClick={() =>
            navigate(`/x/purchasing/suppliers/${row.id}?${params.toString()}`)
          }
        >
          View Supplier
        </MenuItem>
      ),
    [navigate, params]
  );

  return (
    <>
      <Table<Supplier>
        count={count}
        columns={columns}
        data={data}
        withPagination
        renderContextMenu={renderContextMenu}
      />
    </>
  );
});

SuppliersTable.displayName = "SupplierTable";

export default SuppliersTable;
