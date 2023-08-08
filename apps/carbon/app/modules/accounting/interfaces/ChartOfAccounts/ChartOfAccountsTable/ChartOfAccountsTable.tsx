import { DataTable, DataTableColumnHeader } from "@carbon/react";
import {
  Box,
  Checkbox,
  HStack,
  IconButton,
  Link,
  Text,
} from "@chakra-ui/react";
import { Link as RemixLink, useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import { MdMoreHoriz } from "react-icons/md";
import type { Chart } from "~/modules/accounting";

type ChartOfAccountsTableProps = {
  data: Chart[];
};

const ChartOfAccountsTable = memo(({ data }: ChartOfAccountsTableProps) => {
  const navigate = useNavigate();
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
            <HStack>
              <Link
                onClick={() => navigate(row.original.id)}
                fontWeight={isPosting ? "normal" : "bold"}
              >
                {row.original.number}
              </Link>

              <Box position="relative" w={6} h={6}>
                <IconButton
                  aria-label="Edit account"
                  as={RemixLink}
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
      {
        accessorKey: "balanceAtDate",
        header: "Balance at Date",
        cell: ({ row }) => (row.original.balanceAtDate ?? 0).toFixed(2),
      },
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
      {
        accessorKey: "directPosting",
        header: "Direct Posting",
        cell: (item) => <Checkbox isChecked={item.getValue<boolean>()} />,
      },
    ];
  }, [navigate]);

  return <DataTable data={data} columns={columns} />;
});

ChartOfAccountsTable.displayName = "ChartOfAccountsTable";
export default ChartOfAccountsTable;
