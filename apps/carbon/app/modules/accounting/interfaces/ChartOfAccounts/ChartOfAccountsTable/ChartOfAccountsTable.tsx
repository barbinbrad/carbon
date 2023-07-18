import { DataTable, DataTableColumnHeader } from "@carbon/react";
import { Text } from "@chakra-ui/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import type { Chart } from "~/modules/accounting";

type ChartOfAccountsTableProps = {
  data: Chart[];
};

const ChartOfAccountsTable = memo(({ data }: ChartOfAccountsTableProps) => {
  const columns = useMemo<ColumnDef<Chart>[]>(() => {
    return [
      {
        accessorKey: "number",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="No." />
        ),
        cell: ({ row }) => {
          const isPosting = row.original.type === "Posting";

          return (
            <Text fontWeight={isPosting ? "normal" : "bold"}>
              {row.original.number}
            </Text>
          );
        },
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
          const isPosting = row.original.type === "Posting";
          return (
            <Text
              fontWeight={isPosting ? "normal" : "bold"}
              pl={`calc(${0.75 * row.original.level}rem)`}
            >
              {row.original.name}
            </Text>
          );
        },
      },
      {
        accessorKey: "netChange",
        header: "Net Change",
        cell: ({ row }) => (row.original.netChange ?? 0).toFixed(2),
      },
      // {
      //   accessorKey: "balanceAtDate",
      //   header: "Balance at Date",
      //   cell: (item) => item.getValue(),
      // },
      {
        accessorKey: "balance",
        header: "Balance",
        cell: ({ row }) => (row.original.balance ?? 0).toFixed(2),
      },
      {
        accessorKey: "incomeBalance",
        header: "Income/Balance",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "type",
        header: "Account Type",
        cell: (item) => item.getValue(),
      },
      {
        acessorKey: "totaling",
        header: "Totaling",
        cell: ({ row }) => row.original.totaling ?? "",
      },
      {
        accessorKey: "accountCategory",
        header: "Account Category",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "accountSubCategory",
        header: "Account Subcategory",
        cell: (item) => item.getValue(),
      },
    ];
  }, []);

  return <DataTable data={data} columns={columns} />;
});

ChartOfAccountsTable.displayName = "ChartOfAccountsTable";
export default ChartOfAccountsTable;
