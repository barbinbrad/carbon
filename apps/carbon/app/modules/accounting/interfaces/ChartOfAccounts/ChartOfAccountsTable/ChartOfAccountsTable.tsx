import { MenuItem, Text } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { Chart } from "~/modules/accounting";

type ChartOfAccountsTableProps = {
  data: Chart[];
};

const ChartOfAccountsTable = memo(({ data }: ChartOfAccountsTableProps) => {
  const [params] = useUrlParams();
  const navigate = useNavigate();
  const permissions = usePermissions();

  const columns = useMemo<ColumnDef<Chart>[]>(() => {
    return [
      {
        accessorKey: "number",
        header: "No.",
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
              pl={`calc(${0.5 * row.original.level}rem)`}
            >
              {row.original.name}
            </Text>
          );
        },
      },
      {
        accessorKey: "netChange",
        header: "Net Change",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "balanceAtDate",
        header: "Balance at Date",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "balance",
        header: "Balance",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "incomeBalance",
        header: "Income/Balance",
        cell: (item) => item.getValue(),
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
      {
        accessorKey: "type",
        header: "Account Type",
        cell: (item) => item.getValue(),
      },
      {
        acessorKey: "Totaling",
        header: "Totaling",
        cell: (item) => item.getValue(),
      },
    ];
  }, []);

  const renderContextMenu = useCallback(
    (row: Chart) => {
      return (
        <>
          <MenuItem
            isDisabled={!permissions.can("update", "accounting")}
            icon={<BsPencilSquare />}
            onClick={() => {
              navigate(
                `/x/accounting/charts/${row.number}?${params.toString()}`
              );
            }}
          >
            Edit Chart
          </MenuItem>
          <MenuItem
            isDisabled={!permissions.can("delete", "accounting")}
            icon={<IoMdTrash />}
            onClick={() => {
              navigate(
                `/x/accounting/charts/delete/${row.number}?${params.toString()}`
              );
            }}
          >
            Delete Chart
          </MenuItem>
        </>
      );
    },
    [navigate, params, permissions]
  );

  return (
    <Table<Chart>
      data={data}
      columns={columns}
      renderContextMenu={renderContextMenu}
      withPagination={false}
      withSimpleSorting={false}
    />
  );
});

ChartOfAccountsTable.displayName = "ChartOfAccountsTable";
export default ChartOfAccountsTable;
