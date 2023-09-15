import { formatDate } from "@carbon/utils";
import { Link, MenuItem, Tag } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { usePermissions, useRealtime, useUrlParams } from "~/hooks";
import type { Receipt } from "~/modules/inventory";

type ReceiptsTableProps = {
  data: Receipt[];
  count: number;
};

const ReceiptsTable = memo(({ data, count }: ReceiptsTableProps) => {
  useRealtime("receipt");

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
          switch (row.original.sourceDocument) {
            case "Purchase Order":
              return (
                <Link
                  onClick={() =>
                    navigate(
                      `/x/purchase-order/${row.original.sourceDocumentId}`
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
        accessorKey: "supplier.name",
        header: "Supplier",
        cell: (item) => item.getValue() ?? null,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (item) => {
          const status = item.getValue<"Draft" | "Pending" | "Posted">();
          switch (status) {
            case "Draft":
              return <Tag>Draft</Tag>;
            case "Pending":
              return <Tag colorScheme="orange">Pending</Tag>;
            case "Posted":
              return <Tag colorScheme="green">Posted</Tag>;
            default:
              return null;
          }
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
              navigate(`/x/inventory/receipts/${row.id}?${params.toString()}`);
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
              navigate(
                `/x/inventory/receipts/delete/${row.id}?${params.toString()}`
              );
            }}
          >
            Delete Receipt
          </MenuItem>
        </>
      );
    },
    [navigate, params, permissions]
  );

  return (
    <Table<(typeof data)[number]>
      data={data}
      columns={columns}
      count={count}
      renderContextMenu={renderContextMenu}
    />
  );
});

ReceiptsTable.displayName = "ReceiptsTable";
export default ReceiptsTable;
