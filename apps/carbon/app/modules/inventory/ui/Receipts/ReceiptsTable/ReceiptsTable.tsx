import { formatDate } from "@carbon/utils";
import { Link, MenuItem } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { usePermissions, useRealtime, useUrlParams } from "~/hooks";
import type { Receipt, receiptStatusType } from "~/modules/inventory";
import { ReceiptStatus } from "~/modules/inventory";
import { path } from "~/utils/path";

type ReceiptsTableProps = {
  data: Receipt[];
  count: number;
};

const ReceiptsTable = memo(({ data, count }: ReceiptsTableProps) => {
  useRealtime("receipt", `id=in.(${data.map((d) => d.id).join(",")})`);

  const [params] = useUrlParams();
  const navigate = useNavigate();
  const permissions = usePermissions();

  const rows = useMemo(() => data, [data]);

  const columns = useMemo<ColumnDef<Receipt>[]>(() => {
    const result: ColumnDef<(typeof rows)[number]>[] = [
      {
        accessorKey: "receiptId",
        header: "Receipt ID",
        cell: ({ row }) => (
          <Link onClick={() => navigate(row.original.id)}>
            {row.original.receiptId}
          </Link>
        ),
      },
      {
        accessorKey: "sourceDocument",
        header: "Source Document",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "sourceDocumentReadableId",
        header: "Source Document ID",
        cell: ({ row }) => {
          if (!row.original.sourceDocumentId) return null;
          switch (row.original.sourceDocument) {
            case "Purchase Order":
              return (
                <Link
                  onClick={() =>
                    navigate(
                      path.to.purchaseOrder(row.original.sourceDocumentId!)
                    )
                  }
                >
                  {row.original.sourceDocumentReadableId}
                </Link>
              );
            default:
              return null;
          }
        },
      },
      {
        accessorKey: "location.name",
        header: "Location",
        cell: (item) => item.getValue() ?? null,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (item) => {
          const status = item.getValue<(typeof receiptStatusType)[number]>();
          return <ReceiptStatus status={status} />;
        },
      },
      {
        accessorKey: "postingDate",
        header: "Posting Date",
        cell: (item) => formatDate(item.getValue<string>()),
      },
    ];

    return result;
  }, [navigate]);

  const renderContextMenu = useCallback(
    (row: Receipt) => {
      return (
        <>
          <MenuItem
            isDisabled={!permissions.can("update", "inventory")}
            icon={<BsPencilSquare />}
            onClick={() => {
              navigate(`${path.to.receipt(row.id)}?${params.toString()}`);
            }}
          >
            Edit Receipt
          </MenuItem>
          <MenuItem
            isDisabled={
              !permissions.can("delete", "inventory") ||
              !!row.postingDate ||
              row.status === "Pending"
            }
            icon={<IoMdTrash />}
            onClick={() => {
              navigate(`${path.to.deleteReceipt(row.id)}?${params.toString()}`);
            }}
          >
            Delete Receipt
          </MenuItem>
        </>
      );
    },
    [navigate, params, permissions]
  );

  const defaultColumnVisibility = {
    location_name: false,
    postingDate: false,
  };

  return (
    <Table<(typeof data)[number]>
      data={data}
      columns={columns}
      count={count}
      defaultColumnVisibility={defaultColumnVisibility}
      withColumnOrdering
      withFilters
      withPagination
      withSimpleSorting
      renderContextMenu={renderContextMenu}
    />
  );
});

ReceiptsTable.displayName = "ReceiptsTable";
export default ReceiptsTable;
