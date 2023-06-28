import {
  Button,
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { Link, Outlet, useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import Grid from "~/components/Grid";
import {
  EditablePurchaseOrderLineNumber,
  EditableNumber,
  EditableText,
} from "~/components/Editable";
import type { PurchaseOrderLine } from "~/modules/purchasing";
import usePurchaseOrderLines from "./usePurchaseOrderLines";
import { MdMoreHoriz } from "react-icons/md";

type PurchaseOrderLinesProps = {
  purchaseOrderLines: PurchaseOrderLine[];
};

const PurchaseOrderLines = ({
  purchaseOrderLines,
}: PurchaseOrderLinesProps) => {
  const navigate = useNavigate();
  const { supabase, partOptions, accountOptions, handleCellEdit } =
    usePurchaseOrderLines();

  const columns = useMemo<ColumnDef<PurchaseOrderLine>[]>(() => {
    return [
      {
        accessorKey: "purchaseOrderLineType",
        header: "Type",
        cell: ({ row }) => (
          <HStack justify="space-between">
            <span>{row.original.purchaseOrderLineType}</span>
            <Box position="relative" w={6} h={6}>
              <IconButton
                aria-label="Edit purchase order line type"
                as={Link}
                icon={<MdMoreHoriz />}
                size="sm"
                position="absolute"
                right={-1}
                top={-1}
                to={`${row.original.id}`}
                onClick={(e) => e.stopPropagation()}
                variant="ghost"
              />
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
    ];
  }, []);

  const editableComponents = useMemo(
    () => ({
      description: EditableText(handleCellEdit),
      purchaseQuantity: EditableNumber(handleCellEdit),
      unitPrice: EditableNumber(handleCellEdit),
      partId: EditablePurchaseOrderLineNumber(handleCellEdit, {
        client: supabase,
        parts: partOptions,
        accounts: accountOptions,
      }),
    }),
    [handleCellEdit, supabase, partOptions, accountOptions]
  );

  return (
    <>
      <Card w="full">
        <CardHeader display="flex" justifyContent="space-between">
          <Heading size="md" display="inline-flex">
            Purchase Order Lines
          </Heading>
          <Button colorScheme="brand" as={Link} to="new">
            New
          </Button>
        </CardHeader>
        <CardBody>
          <Grid<PurchaseOrderLine>
            data={purchaseOrderLines}
            columns={columns}
            editableComponents={editableComponents}
            onNewRow={() => navigate("new")}
          />
        </CardBody>
      </Card>
      <Outlet />
    </>
  );
};

export default PurchaseOrderLines;
