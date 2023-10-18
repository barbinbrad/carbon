import { HStack, Link, MenuItem, Text, useDisclosure } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Avatar, Table } from "~/components";
import { ConfirmDelete } from "~/components/Modals";
import { usePermissions } from "~/hooks";
import type {
  PurchaseInvoice,
  purchaseInvoiceStatusType,
} from "~/modules/invoicing";
import { PurchaseInvoicingStatus } from "~/modules/invoicing";

type PurchaseInvoicesTableProps = {
  data: PurchaseInvoice[];
  count: number;
};

const PurchaseInvoicesTable = memo(
  ({ data, count }: PurchaseInvoicesTableProps) => {
    const permissions = usePermissions();
    const navigate = useNavigate();

    const [selectedPurchaseInvoice, setSelectedPurchaseInvoice] =
      useState<PurchaseInvoice | null>(null);
    const closePurchaseInvoiceModal = useDisclosure();

    const columns = useMemo<ColumnDef<PurchaseInvoice>[]>(() => {
      return [
        {
          accessorKey: "invoiceId",
          header: "Invoice Number",
          cell: ({ row }) => (
            <Link
              onClick={
                row.original?.id !== null
                  ? () => navigate(`/x/purchase-invoice/${row.original.id}`)
                  : undefined
              }
            >
              {row.original?.invoiceId}
            </Link>
          ),
        },
        {
          accessorKey: "supplierName",
          header: "Supplier",
          cell: (item) => item.getValue(),
        },
        {
          accessorKey: "dateDue",
          header: "Due Date",
          cell: (item) => item.getValue(),
        },
        {
          accessorKey: "status",
          header: "Status",
          cell: (item) => {
            const status =
              item.getValue<(typeof purchaseInvoiceStatusType)[number]>();
            return <PurchaseInvoicingStatus status={status} />;
          },
        },
        {
          accessorKey: "dateIssued",
          header: "Issued Date",
          cell: (item) => item.getValue(),
        },
        {
          accessorKey: "createdByFullName",
          header: "Created By",
          cell: ({ row }) => {
            return (
              <HStack>
                <Avatar size="sm" path={row.original.createdByAvatar} />
                <Text>{row.original.createdByFullName}</Text>
              </HStack>
            );
          },
        },
        {
          accessorKey: "createdAt",
          header: "Created At",
          cell: (item) => item.getValue(),
        },
        {
          accessorKey: "updatedByFullName",
          header: "Updated By",
          cell: ({ row }) => {
            return row.original.updatedByFullName ? (
              <HStack>
                <Avatar size="sm" path={row.original.updatedByAvatar ?? null} />
                <Text>{row.original.updatedByFullName}</Text>
              </HStack>
            ) : null;
          },
        },
        {
          accessorKey: "updatedAt",
          header: "Updated At",
          cell: (item) => item.getValue(),
        },
      ];
    }, [navigate]);

    const defaultColumnVisibility = {
      createdAt: false,
      createdByFullName: false,
      receiptPromisedDate: false,
      updatedAt: false,
      updatedByFullName: false,
    };

    const renderContextMenu = useMemo(() => {
      // eslint-disable-next-line react/display-name
      return (row: PurchaseInvoice) => (
        <>
          <MenuItem
            icon={<BsPencilSquare />}
            isDisabled={!permissions.can("view", "invoicing")}
            onClick={() => navigate(row.id!)}
          >
            Edit
          </MenuItem>
          <MenuItem
            icon={<IoMdTrash />}
            isDisabled={
              row.status !== "Draft" || !permissions.can("delete", "invoicing")
            }
            onClick={() => {
              setSelectedPurchaseInvoice(row);
              closePurchaseInvoiceModal.onOpen();
            }}
          >
            Delete
          </MenuItem>
        </>
      );
    }, [closePurchaseInvoiceModal, navigate, permissions]);

    return (
      <>
        <Table<PurchaseInvoice>
          count={count}
          columns={columns}
          data={data}
          defaultColumnVisibility={defaultColumnVisibility}
          withColumnOrdering
          withFilters
          withPagination
          withSimpleSorting
          renderContextMenu={renderContextMenu}
        />

        {selectedPurchaseInvoice && (
          <ConfirmDelete
            action={`/x/purchase-invoice/${selectedPurchaseInvoice?.id}/delete`}
            isOpen={closePurchaseInvoiceModal.isOpen}
            name={selectedPurchaseInvoice.invoiceId!}
            text={`Are you sure you want to permanently delete ${selectedPurchaseInvoice.invoiceId!}?`}
            onCancel={() => {
              closePurchaseInvoiceModal.onClose();
              setSelectedPurchaseInvoice(null);
            }}
            onSubmit={() => {
              closePurchaseInvoiceModal.onClose();
              setSelectedPurchaseInvoice(null);
            }}
          />
        )}
      </>
    );
  }
);

PurchaseInvoicesTable.displayName = "PurchaseInvoicesTable";

export default PurchaseInvoicesTable;
