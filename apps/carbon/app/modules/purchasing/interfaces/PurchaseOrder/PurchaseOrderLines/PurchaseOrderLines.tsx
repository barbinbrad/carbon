import { Card, CardHeader, Heading, CardBody } from "@chakra-ui/react";
import { Outlet } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import Grid from "~/components/Grid";
import type { PurchaseOrderLine } from "~/modules/purchasing";

type PurchaseOrderLinesProps = {
  purchaseOrderLines: PurchaseOrderLine[];
};

const PurchaseOrderLines = ({
  purchaseOrderLines,
}: PurchaseOrderLinesProps) => {
  const columns = useMemo<ColumnDef<PurchaseOrderLine>[]>(() => {
    return [
      {
        accessorKey: "partId",
        header: "Part",
        cell: (item) => item.getValue(),
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
          return row.original.unitPrice * row.original.purchaseQuantity ?? 0;
        },
      },
    ];
  }, []);

  return (
    <>
      <Card w="full">
        <CardHeader>
          <Heading size="md">Purchase Order Lines</Heading>
        </CardHeader>
        <CardBody>
          <Grid<PurchaseOrderLine>
            data={purchaseOrderLines}
            columns={columns}
          />
        </CardBody>
      </Card>
      <Outlet />
    </>
  );
};

export default PurchaseOrderLines;
