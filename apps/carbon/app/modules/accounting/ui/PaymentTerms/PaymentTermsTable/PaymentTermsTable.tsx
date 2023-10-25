import { Link, MenuItem } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { PaymentTerm } from "~/modules/accounting";
import { path } from "~/utils/path";

type PaymentTermsTableProps = {
  data: PaymentTerm[];
  count: number;
};

const PaymentTermsTable = memo(({ data, count }: PaymentTermsTableProps) => {
  const [params] = useUrlParams();
  const navigate = useNavigate();
  const permissions = usePermissions();

  const columns = useMemo<ColumnDef<(typeof data)[number]>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <Link onClick={() => navigate(row.original.id)}>
            {row.original.name}
          </Link>
        ),
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
        accessorKey: "calculationMethod",
        header: "Calculation Method",
        cell: (item) => item.getValue(),
      },
    ];
  }, [navigate]);

  const renderContextMenu = useCallback(
    (row: (typeof data)[number]) => {
      return (
        <>
          <MenuItem
            isDisabled={!permissions.can("update", "accounting")}
            icon={<BsPencilSquare />}
            onClick={() => {
              navigate(`${path.to.paymentTerm(row.id)}?${params.toString()}`);
            }}
          >
            Edit Payment Term
          </MenuItem>
          <MenuItem
            isDisabled={!permissions.can("delete", "accounting")}
            icon={<IoMdTrash />}
            onClick={() => {
              navigate(
                `${path.to.deletePaymentTerm(row.id)}?${params.toString()}`
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
    <Table<(typeof data)[number]>
      data={data}
      columns={columns}
      count={count}
      renderContextMenu={renderContextMenu}
    />
  );
});

PaymentTermsTable.displayName = "PaymentTermsTable";
export default PaymentTermsTable;
