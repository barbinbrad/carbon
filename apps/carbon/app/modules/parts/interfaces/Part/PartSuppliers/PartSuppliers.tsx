import { Button, Card, CardBody, CardHeader, Heading } from "@chakra-ui/react";
import { Link, Outlet, useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import Grid from "~/components/Grid";
import {
  EditableList,
  EditableNumber,
  EditableText,
} from "~/components/Editable";
import type { PartSupplier } from "~/modules/parts";
import usePartSuppliers from "./usePartSuppliers";

type PartSuppliersProps = {
  partSuppliers: PartSupplier[];
};

const PartSuppliers = ({ partSuppliers }: PartSuppliersProps) => {
  const navigate = useNavigate();
  const { canEdit, supplierOptions, unitOfMeasureOptions, handleCellEdit } =
    usePartSuppliers();

  const columns = useMemo<ColumnDef<PartSupplier>[]>(() => {
    return [
      {
        accessorKey: "supplier.id",
        header: "Supplier",
        // @ts-ignore
        cell: ({ row }) => row.original.supplier?.name,
      },
      {
        accessorKey: "supplierPartId",
        header: "Part ID",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "supplierUnitOfMeasureCode",
        header: "Unit of Measure",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "minimumOrderQuantity",
        header: "Minimum Order Quantity",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "conversionFactor",
        header: "Conversion Factor",
        cell: (item) => item.getValue(),
      },
    ];
  }, []);

  const editableComponents = useMemo(
    () => ({
      "supplier.id": EditableList(handleCellEdit, supplierOptions),
      supplierPartId: EditableText(handleCellEdit),
      supplierUnitOfMeasureCode: EditableList(
        handleCellEdit,
        unitOfMeasureOptions
      ),
      minimumOrderQuantity: EditableNumber(handleCellEdit),
      conversionFactor: EditableNumber(handleCellEdit),
    }),
    [handleCellEdit, supplierOptions, unitOfMeasureOptions]
  );

  return (
    <>
      <Card w="full">
        <CardHeader display="flex" justifyContent="space-between">
          <Heading size="md" display="inline-flex">
            Suppliers
          </Heading>
          {canEdit && (
            <Button colorScheme="brand" as={Link} to="new">
              New
            </Button>
          )}
        </CardHeader>
        <CardBody>
          <Grid<PartSupplier>
            data={partSuppliers}
            columns={columns}
            editableComponents={editableComponents}
            onNewRow={canEdit ? () => navigate("new") : undefined}
          />
        </CardBody>
      </Card>
      <Outlet />
    </>
  );
};

export default PartSuppliers;
