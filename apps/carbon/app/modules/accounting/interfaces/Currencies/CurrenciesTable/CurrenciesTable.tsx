import { Checkbox, MenuItem } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { Currency } from "~/modules/accounting";

type CurrenciesTableProps = {
  data: Currency[];
  count: number;
};

const CurrenciesTable = memo(({ data, count }: CurrenciesTableProps) => {
  const [params] = useUrlParams();
  const navigate = useNavigate();
  const permissions = usePermissions();

  const columns = useMemo<ColumnDef<typeof data[number]>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Name",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "code",
        header: "Code",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "symbol",
        header: "Symbol",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "exchangeRate",
        header: "Exchange Rate",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "isBaseCurrency",
        header: "Default Currency",
        cell: ({ row }) => (
          <Checkbox isChecked={row.original.isBaseCurrency} isReadOnly />
        ),
      },
    ];
  }, []);

  const renderContextMenu = useCallback(
    (row: typeof data[number]) => {
      return (
        <>
          <MenuItem
            isDisabled={!permissions.can("update", "accounting")}
            icon={<BsPencilSquare />}
            onClick={() => {
              navigate(
                `/x/accounting/currencies/${row.id}?${params.toString()}`
              );
            }}
          >
            Edit Currency
          </MenuItem>
          <MenuItem
            isDisabled={!permissions.can("delete", "accounting")}
            icon={<IoMdTrash />}
            onClick={() => {
              navigate(
                `/x/accounting/currencies/delete/${row.id}?${params.toString()}`
              );
            }}
          >
            Delete Currency
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
      renderContextMenu={renderContextMenu}
    />
  );
});

CurrenciesTable.displayName = "CurrenciesTable";
export default CurrenciesTable;
