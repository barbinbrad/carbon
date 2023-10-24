import {
  HStack,
  Icon,
  Link,
  MenuItem,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { BsPencilSquare, BsStar, BsStarFill } from "react-icons/bs";
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
import { path } from "~/utils/path";
import { usePurchaseOrder } from "../usePurchaseOrder";

type PurchaseOrdersTableProps = {
  data: PurchaseOrder[];
  count: number;
};

const PurchaseOrdersTable = memo(
  ({ data, count }: PurchaseOrdersTableProps) => {
    const permissions = usePermissions();

    // put rows in state for use with optimistic ui updates
    const [rows, setRows] = useState<PurchaseOrder[]>(data);
    // we have to do this useEffect silliness since we're putitng rows
    // in state for optimistic ui updates
    useEffect(() => {
      setRows(data);
    }, [data]);

    const { edit, favorite, receive } = usePurchaseOrder();

    const [selectedPurchaseOrder, setSelectedPurchaseOrder] =
      useState<PurchaseOrder | null>(null);
    const closePurchaseOrderModal = useDisclosure();

    const onFavorite = useCallback(
      async (row: PurchaseOrder) => {
        // optimistically update the UI and then make the mutation
        setRows((prev) => {
          const index = prev.findIndex((item) => item.id === row.id);
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            favorite: !updated[index].favorite,
          };
          return updated;
        });
        // mutate the database
        await favorite(row);
      },
      [favorite]
    );

    const columns = useMemo<ColumnDef<PurchaseOrder>[]>(() => {
      return [
        {
          accessorKey: "purchaseOrderId",
          header: "PO Number",
          cell: ({ row }) => (
            <HStack>
              <Icon
                color={row.original.favorite ? "yellow.400" : "gray.300"}
                cursor="pointer"
                h={4}
                w={4}
                as={row.original.favorite ? BsStarFill : BsStar}
                onClick={() => onFavorite(row.original)}
              />

              <Link onClick={() => edit(row.original)}>
                {row.original.purchaseOrderId}
              </Link>
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
    }, [edit, onFavorite]);

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
            icon={<BsPencilSquare />}
            isDisabled={!permissions.can("view", "purchasing")}
            onClick={() => edit(row)}
          >
            Edit
          </MenuItem>
          <MenuItem
            icon={<BsStar />}
            onClick={() => {
              onFavorite(row);
            }}
          >
            Favorite
          </MenuItem>
          <MenuItem
            icon={<MdCallReceived />}
            isDisabled={
              !["Draft", "Approved"].includes(row.status ?? "") ||
              !permissions.can("update", "inventory")
            }
            onClick={() => {
              receive(row);
            }}
          >
            Receive
          </MenuItem>
          <MenuItem
            icon={<IoMdTrash />}
            isDisabled={!permissions.can("delete", "purchasing")}
            onClick={() => {
              setSelectedPurchaseOrder(row);
              closePurchaseOrderModal.onOpen();
            }}
          >
            Close
          </MenuItem>
        </>
      );
    }, [closePurchaseOrderModal, edit, onFavorite, permissions, receive]);

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
            isOpen={closePurchaseOrderModal.isOpen}
            name={selectedPurchaseOrder.purchaseOrderId!}
            text={`Are you sure you want to move ${selectedPurchaseOrder.purchaseOrderId!} to the trash?`}
            onCancel={() => {
              closePurchaseOrderModal.onClose();
              setSelectedPurchaseOrder(null);
            }}
            onSubmit={() => {
              closePurchaseOrderModal.onClose();
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
