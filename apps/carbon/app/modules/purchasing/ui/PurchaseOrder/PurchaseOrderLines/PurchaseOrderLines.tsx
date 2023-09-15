import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { Link, Outlet, useNavigate, useParams } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { MdMoreHoriz } from "react-icons/md";
import {
  EditableNumber,
  EditablePurchaseOrderLineNumber,
  EditableText,
} from "~/components/Editable";
import Grid from "~/components/Grid";
import { useRouteData, useUser } from "~/hooks";
import type { PurchaseOrder, PurchaseOrderLine } from "~/modules/purchasing";
import type { ListItem } from "~/types";
import usePurchaseOrderLines from "./usePurchaseOrderLines";

type PurchaseOrderLinesProps = {
  purchaseOrderLines: PurchaseOrderLine[];
};

const PurchaseOrderLines = ({
  purchaseOrderLines,
}: PurchaseOrderLinesProps) => {
  const { orderId } = useParams();
  if (!orderId) throw new Error("orderId not found");

  const navigate = useNavigate();
  const routeData = useRouteData<{
    locations: ListItem[];
    purchaseOrder: PurchaseOrder;
  }>(`/x/purchase-order/${orderId}`);
  const locations = routeData?.locations ?? [];
  const { defaults } = useUser();
  const {
    canEdit,
    canDelete,
    supabase,
    partOptions,
    accountOptions,
    handleCellEdit,
  } = usePurchaseOrderLines();

  const isEditable = ["Draft", "In Review", "In External Review"].includes(
    routeData?.purchaseOrder?.status ?? ""
  );

  const columns = useMemo<ColumnDef<PurchaseOrderLine>[]>(() => {
    return [
      {
        header: "Line",
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "purchaseOrderLineType",
        header: "Type",
        cell: ({ row }) => (
          <HStack justify="space-between" minW={100}>
            <span>{row.original.purchaseOrderLineType}</span>
            <Box position="relative" w={6} h={5}>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Edit purchase order line type"
                  icon={<MdMoreHoriz />}
                  size="sm"
                  position="absolute"
                  right={-1}
                  top="-6px"
                  variant="ghost"
                  onClick={(e) => e.stopPropagation()}
                />
                <MenuList>
                  <MenuItem
                    icon={<BsPencilSquare />}
                    onClick={() => navigate(row.original.id)}
                    isDisabled={!isEditable || !canEdit}
                  >
                    Edit Line
                  </MenuItem>
                  <MenuItem
                    icon={<IoMdTrash />}
                    onClick={() => navigate(`delete/${row.original.id}`)}
                    isDisabled={!isEditable || !canDelete}
                  >
                    Delete Line
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </HStack>
        ),
      },
      {
        accessorKey: "partId",
        header: "Number",
        cell: ({ row }) => {
          switch (row.original.purchaseOrderLineType) {
            case "Part":
              return <span>{row.original.partId}</span>;
            case "G/L Account":
              return <span>{row.original.accountNumber}</span>;
            case "Comment":
              return null;
            case "Fixed Asset":
              return <span>{row.original.assetId}</span>;
            default:
              return null;
          }
        },
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
          let description = row.original.description ?? "";
          if (description.length > 50) {
            description = description.substring(0, 50) + "...";
          }
          return <span>{description}</span>;
        },
      },
      {
        accessorKey: "purchaseQuantity",
        header: "Quantity",
        cell: ({ row }) => {
          switch (row.original.purchaseOrderLineType) {
            case "Comment":
              return null;
            default:
              return <span>{row.original.purchaseQuantity}</span>;
          }
        },
      },
      {
        accessorKey: "unitPrice",
        header: "Unit Price",
        cell: ({ row }) => {
          switch (row.original.purchaseOrderLineType) {
            case "Comment":
              return null;
            default:
              return <span>{row.original.unitPrice}</span>;
          }
        },
      },
      {
        accessorKey: "locationId",
        header: "Location",
        cell: ({ row }) => {
          switch (row.original.purchaseOrderLineType) {
            case "Part":
              return (
                <span>
                  {locations.find((l) => l.id == row.original.locationId)?.name}
                </span>
              );
          }
        },
      },
      {
        accessorKey: "shelfId",
        header: "Shelf",
        cell: ({ row }) => {
          switch (row.original.purchaseOrderLineType) {
            case "Comment":
              return null;
            default:
              return <span>{row.original.shelfId}</span>;
          }
        },
      },
      {
        id: "totalPrice",
        header: "Total Price",
        cell: ({ row }) => {
          switch (row.original.purchaseOrderLineType) {
            case "Comment":
              return null;
            default:
              if (!row.original.unitPrice || !row.original.purchaseQuantity)
                return 0;
              return (
                row.original.unitPrice * row.original.purchaseQuantity
              ).toFixed(2);
          }
        },
      },
      {
        id: "quantityReceived",
        header: "Quantity Received",
        cell: ({ row }) => {
          switch (row.original.purchaseOrderLineType) {
            case "Comment":
              return null;
            default:
              return <span>{row.original.quantityReceived}</span>;
          }
        },
      },
      {
        id: "quantityInvoiced",
        header: "Quantity Invoiced",
        cell: ({ row }) => {
          switch (row.original.purchaseOrderLineType) {
            case "Comment":
              return null;
            default:
              return <span>{row.original.quantityInvoiced}</span>;
          }
        },
      },
      {
        id: "receivedComplete",
        header: "Received Complete",
        cell: ({ row }) => {
          switch (row.original.purchaseOrderLineType) {
            case "Comment":
              return null;
            default:
              return <Checkbox isChecked={row.original.receivedComplete} />;
          }
        },
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const editableComponents = useMemo(
    () => ({
      description: EditableText(handleCellEdit),
      purchaseQuantity: EditableNumber(handleCellEdit),
      unitPrice: EditableNumber(handleCellEdit),
      partId: EditablePurchaseOrderLineNumber(handleCellEdit, {
        client: supabase,
        parts: partOptions,
        accounts: accountOptions,
        defaultLocationId: defaults.locationId,
      }),
    }),
    [handleCellEdit, supabase, partOptions, accountOptions, defaults.locationId]
  );

  return (
    <>
      <Card w="full" minH={320}>
        <CardHeader display="flex" justifyContent="space-between">
          <Heading size="md" display="inline-flex">
            Purchase Order Lines
          </Heading>
          {canEdit && isEditable && (
            <Button colorScheme="brand" as={Link} to="new">
              New
            </Button>
          )}
        </CardHeader>
        <CardBody>
          <Grid<PurchaseOrderLine>
            data={purchaseOrderLines}
            columns={columns}
            canEdit={canEdit && isEditable}
            editableComponents={editableComponents}
            onNewRow={canEdit && isEditable ? () => navigate("new") : undefined}
          />
        </CardBody>
      </Card>
      <Outlet />
    </>
  );
};

export default PurchaseOrderLines;
