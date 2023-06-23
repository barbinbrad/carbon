import { Card, CardHeader, Heading, CardBody, Button } from "@chakra-ui/react";
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

type PurchaseOrderLinesProps = {
  purchaseOrderLines: PurchaseOrderLine[];
};

const PurchaseOrderLines = ({
  purchaseOrderLines,
}: PurchaseOrderLinesProps) => {
  const navigate = useNavigate();
  const { partOptions, accountOptions, handleCellEdit } =
    usePurchaseOrderLines();

  const columns = useMemo<ColumnDef<PurchaseOrderLine>[]>(() => {
    return [
      {
        accessorKey: "purchaseOrderLineType",
        header: "Type",
        cell: (item) => item.getValue(),
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
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "unitPrice",
        header: "Unit Price",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "shelf",
        header: "Shelf",
        cell: (item) => item.getValue(),
      },
      {
        id: "totalPrice",
        header: "Total Price",
        cell: ({ row }) => {
          if (!row.original.unitPrice || !row.original.purchaseQuantity)
            return 0;
          return (
            row.original.unitPrice * row.original.purchaseQuantity
          ).toFixed(2);
        },
      },
    ];
  }, []);

  const editableComponents = useMemo(
    () => ({
      // TODO: this shouldn't be imported from /Table/editable/Editable*
      description: EditableText(handleCellEdit),
      purchaseQuantity: EditableNumber(handleCellEdit),
      unitPrice: EditableNumber(handleCellEdit),
      partId: EditablePurchaseOrderLineNumber(handleCellEdit, {
        parts: partOptions,
        accounts: accountOptions,
      }),
    }),
    [accountOptions, partOptions, handleCellEdit]
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
