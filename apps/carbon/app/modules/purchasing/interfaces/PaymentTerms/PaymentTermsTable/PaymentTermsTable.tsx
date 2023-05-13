import { MenuItem } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { PaymentTerm } from "~/modules/purchasing";

type PaymentTermsTableProps = {
  data: PaymentTerm[];
  count: number;
};

const PaymentTermsTable = memo(({ data, count }: PaymentTermsTableProps) => {
  const [params] = useUrlParams();
  const navigate = useNavigate();
  const permissions = usePermissions();

  const defaultColumnVisibility = {
    description: false,
    gracePeriod: false,
    calculationMethod: false,
  };

  const columns = useMemo<ColumnDef<typeof data[number]>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Name",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "daysDue",
        header: "Days Due",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "daysDiscount",
        header: "Days Discount",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "discountPercentage",
        header: "Discount Percentage",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "gracePeriod",
        header: "Grace Period",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "calculationMethod",
        header: "Calculation Method",
        cell: (item) => item.getValue(),
      },
    ];
  }, []);

  const renderContextMenu = useCallback(
    (row: typeof data[number]) => {
      return (
        <>
          <MenuItem
            isDisabled={!permissions.can("update", "purchasing")}
            icon={<BsPencilSquare />}
            onClick={() => {
              navigate(
                `/x/purchasing/payment-terms/${row.id}?${params.toString()}`
              );
            }}
          >
            Edit Payment Term
          </MenuItem>
          <MenuItem
            isDisabled={!permissions.can("delete", "purchasing")}
            icon={<IoMdTrash />}
            onClick={() => {
              navigate(
                `/x/purchasing/payment-terms/delete/${
                  row.id
                }?${params.toString()}`
              );
            }}
          >
            Delete Payment Term
          </MenuItem>
        </>
      );
    },
    [navigate, params, permissions]
  );

  return (
    <Table<typeof data[number]>
      data={data}
      columns={columns}
      count={count}
      defaultColumnVisibility={defaultColumnVisibility}
      renderContextMenu={renderContextMenu}
    />
  );
});

PaymentTermsTable.displayName = "PaymentTermsTable";
export default PaymentTermsTable;
