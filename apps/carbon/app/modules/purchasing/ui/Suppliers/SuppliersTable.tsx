import {
  Button,
  Enumerable,
  Hyperlink,
  MenuIcon,
  MenuItem,
} from "@carbon/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import { BsFillPenFill } from "react-icons/bs";
import { Table } from "~/components";
import { useCustomColumns } from "~/hooks/useCustomColumns";
import type { Supplier } from "~/modules/purchasing";
import { path } from "~/utils/path";

type SuppliersTableProps = {
  data: Supplier[];
  count: number;
};

const SuppliersTable = memo(({ data, count }: SuppliersTableProps) => {
  const navigate = useNavigate();

  const customColumns = useCustomColumns<Supplier>("supplier");
  const columns = useMemo<ColumnDef<Supplier>[]>(() => {
    const defaultColumns: ColumnDef<Supplier>[] = [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <Hyperlink
            onClick={() => navigate(path.to.supplier(row.original.id!))}
          >
            {row.original.name}
          </Hyperlink>
        ),
      },
      {
        accessorKey: "type",
        header: "Supplier Type",
        cell: (item) => <Enumerable value={item.getValue<string>()} />,
      },
      {
        accessorKey: "status",
        header: "Supplier Status",
        cell: (item) => <Enumerable value={item.getValue<string>()} />,
      },
      {
        id: "orders",
        header: "Orders",
        cell: ({ row }) => (
          <Button
            variant="secondary"
            onClick={() =>
              navigate(
                `${path.to.purchaseOrders}?supplierId=${row.original.id}`
              )
            }
          >
            {row.original.orderCount ?? 0} Orders
          </Button>
        ),
      },
      {
        id: "parts",
        header: "Parts",
        cell: ({ row }) => (
          <Button
            variant="secondary"
            onClick={() =>
              navigate(`${path.to.partsSearch}?supplierId=${row.original.id}`)
            }
          >
            {row.original.partCount ?? 0} Parts
          </Button>
        ),
      },
    ];
    return [...defaultColumns, ...customColumns];
  }, [navigate, customColumns]);

  const renderContextMenu = useMemo(
    // eslint-disable-next-line react/display-name
    () => (row: Supplier) =>
      (
        <MenuItem onClick={() => navigate(path.to.supplier(row.id!))}>
          <MenuIcon icon={<BsFillPenFill />} />
          Edit Supplier
        </MenuItem>
      ),
    [navigate]
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
