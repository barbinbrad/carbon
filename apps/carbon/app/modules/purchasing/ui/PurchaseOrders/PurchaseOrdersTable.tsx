import {
  HStack,
  Hyperlink,
  MenuIcon,
  MenuItem,
  useDisclosure,
} from "@carbon/react";
import { useFetcher, useFetchers } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo, useState } from "react";
import { BsFillPenFill, BsPin, BsPinFill } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { MdCallReceived } from "react-icons/md";
import { Avatar, Table } from "~/components";
import { ConfirmDelete } from "~/components/Modals";
import { usePermissions } from "~/hooks";
import type {
  PurchaseOrder,
  purchaseOrderStatusType,
} from "~/modules/purchasing";
import { PurchasingStatus } from "~/modules/purchasing";
import { favoriteSchema } from "~/types/validators";
import { path } from "~/utils/path";
import { usePurchaseOrder } from "./usePurchaseOrder";

type PurchaseOrdersTableProps = {
  data: PurchaseOrder[];
  count: number;
};

const PurchaseOrdersTable = memo(
  ({ data, count }: PurchaseOrdersTableProps) => {
    const permissions = usePermissions();
    const fetcher = useFetcher();
    const optimisticFavorite = useOptimisticFavorite();

    const rows = useMemo<PurchaseOrder[]>(
      () =>
        data.map((d) =>
          d.id === optimisticFavorite?.id
            ? {
                ...d,
                favorite: optimisticFavorite?.favorite
                  ? optimisticFavorite.favorite === "favorite"
                  : d.favorite,
              }
            : d
        ),
      [data, optimisticFavorite]
    );

    const { edit, receive } = usePurchaseOrder();

    const [selectedPurchaseOrder, setSelectedPurchaseOrder] =
      useState<PurchaseOrder | null>(null);
    const deletePurchaseOrderModal = useDisclosure();

    const columns = useMemo<ColumnDef<PurchaseOrder>[]>(() => {
      return [
        {
          accessorKey: "purchaseOrderId",
          header: "PO Number",
          cell: ({ row }) => (
            <HStack>
              {row.original.favorite ? (
                <fetcher.Form
                  method="post"
                  action={path.to.purchaseOrderFavorite}
                  className="flex items-center"
                >
                  <input type="hidden" name="id" value={row.original.id!} />
                  <input type="hidden" name="favorite" value="unfavorite" />
                  <button type="submit">
                    <BsPinFill
                      className="text-yellow-400 cursor-pointer h-4 w-4"
                      type="submit"
                    />
                  </button>
                </fetcher.Form>
              ) : (
                <fetcher.Form
                  method="post"
                  action={path.to.purchaseOrderFavorite}
                  className="flex items-center"
                >
                  <input type="hidden" name="id" value={row.original.id!} />
                  <input type="hidden" name="favorite" value="favorite" />
                  <button type="submit">
                    <BsPin
                      className="text-yellow-400 cursor-pointer h-4 w-4"
                      type="submit"
                    />
                  </button>
                </fetcher.Form>
              )}

              <Hyperlink onClick={() => edit(row.original)}>
                {row.original.purchaseOrderId}
              </Hyperlink>
            </HStack>
          ),
        },
        {
          accessorKey: "supplierName",
          header: "Supplier",
          cell: (item) => item.getValue(),
        },
        {
          accessorKey: "orderDate",
          header: "Order Date",
          cell: (item) => item.getValue(),
        },
        {
          accessorKey: "status",
          header: "Status",
          cell: (item) => {
            const status =
              item.getValue<(typeof purchaseOrderStatusType)[number]>();
            return <PurchasingStatus status={status} />;
          },
        },
        {
          accessorKey: "receiptPromisedDate",
          header: "Promised Date",
          cell: (item) => item.getValue(),
        },
        {
          accessorKey: "createdByFullName",
          header: "Created By",
          cell: ({ row }) => {
            return (
              <HStack>
                <Avatar size="sm" path={row.original.createdByAvatar} />
                <p>{row.original.createdByFullName}</p>
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
                <p>{row.original.updatedByFullName}</p>
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
    }, [edit, fetcher]);

    const defaultColumnVisibility = {
      createdAt: false,
      createdByFullName: false,
      receiptPromisedDate: false,
      updatedAt: false,
      updatedByFullName: false,
    };

    const renderContextMenu = useMemo(() => {
      // eslint-disable-next-line react/display-name
      return (row: PurchaseOrder) => (
        <>
          <MenuItem
            disabled={!permissions.can("view", "purchasing")}
            onClick={() => edit(row)}
          >
            <MenuIcon icon={<BsFillPenFill />} />
            Edit
          </MenuItem>

          <MenuItem
            disabled={
              !["To Recieve", "To Receive and Invoice"].includes(
                row.status ?? ""
              ) || !permissions.can("update", "inventory")
            }
            onClick={() => {
              receive(row);
            }}
          >
            <MenuIcon icon={<MdCallReceived />} />
            Receive
          </MenuItem>
          <MenuItem
            disabled={!permissions.can("delete", "purchasing")}
            onClick={() => {
              setSelectedPurchaseOrder(row);
              deletePurchaseOrderModal.onOpen();
            }}
          >
            <MenuIcon icon={<IoMdTrash />} />
            Delete
          </MenuItem>
        </>
      );
    }, [deletePurchaseOrderModal, edit, permissions, receive]);

    return (
      <>
        <Table<PurchaseOrder>
          count={count}
          columns={columns}
          data={rows}
          defaultColumnVisibility={defaultColumnVisibility}
          withColumnOrdering
          withFilters
          withPagination
          withSimpleSorting
          renderContextMenu={renderContextMenu}
        />

        {selectedPurchaseOrder && selectedPurchaseOrder.id && (
          <ConfirmDelete
            action={path.to.deletePurchaseOrder(selectedPurchaseOrder.id)}
            isOpen={deletePurchaseOrderModal.isOpen}
            name={selectedPurchaseOrder.purchaseOrderId!}
            text={`Are you sure you want to delete ${selectedPurchaseOrder.purchaseOrderId!}? This cannot be undone.`}
            onCancel={() => {
              deletePurchaseOrderModal.onClose();
              setSelectedPurchaseOrder(null);
            }}
            onSubmit={() => {
              deletePurchaseOrderModal.onClose();
              setSelectedPurchaseOrder(null);
            }}
          />
        )}
      </>
    );
  }
);
PurchaseOrdersTable.displayName = "PurchaseOrdersTable";

export default PurchaseOrdersTable;

function useOptimisticFavorite() {
  const fetchers = useFetchers();
  const favoriteFetcher = fetchers.find(
    (f) => f.formAction === path.to.purchaseOrderFavorite
  );

  if (favoriteFetcher && favoriteFetcher.formData) {
    const id = favoriteFetcher.formData.get("id");
    const favorite = favoriteFetcher.formData.get("favorite") ?? "off";
    const submission = favoriteSchema.safeParse({ id, favorite });
    if (submission.success) {
      return submission.data;
    }
  }
}
