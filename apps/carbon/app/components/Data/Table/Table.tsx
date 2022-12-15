import { useEffect, useState } from "react";
import { forwardRef } from "react";
import { useColor } from "@carbon/react";
import type { ThemeTypings } from "@chakra-ui/react";
import { Checkbox } from "@chakra-ui/react";
import {
  Box,
  Table as ChakraTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import type { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { AiFillCaretUp, AiFillCaretDown } from "react-icons/ai";
import { Pagination, usePagination } from "./components";

interface TableProps<T extends object> {
  columns: ColumnDef<T>[];
  data: T[];
  count: number;
  colorScheme?: ThemeTypings["colorSchemes"];
  selectableRows?: boolean;
  shouldPaginate?: boolean;
  onRowClick?: (row: T) => void;
  onSelectedRowsChange?: (selectedRows: T[]) => void;
}

const Table = <T extends object>({
  data,
  columns,
  count,
  colorScheme = "blackAlpha",
  shouldPaginate = true,
  selectableRows,
  onRowClick,
  onSelectedRowsChange,
}: TableProps<T>) => {
  const pagination = usePagination(count);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  if (selectableRows) columns.unshift(getSelectableColumn<T>());
  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (typeof onSelectedRowsChange === "function") {
      onSelectedRowsChange(
        table.getSelectedRowModel().flatRows.map((row) => row.original)
      );
    }
  }, [rowSelection, table, onSelectedRowsChange]);

  const rows = table.getRowModel().rows;
  const rowBackground = useColor("gray.50");

  return (
    <Box w="full">
      <ChakraTable>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Th key={header.id} colSpan={header.colSpan} px={4} py={3}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </Th>
                );
              })}
            </Tr>
          ))}
        </Thead>
        {/* {rows.length === 0 ? (
          <Box w="full" position="absolute" py={10}>
            <Empty {...emptyData} text={emptyData?.text ?? "No Data"}>
              {emptyData?.children ?? null}
            </Empty>
          </Box>
        ) : ( */}
        <Tbody>
          {rows.map((row) => {
            return (
              <Tr
                key={row.id}
                onClick={() => {
                  if (typeof onRowClick === "function") {
                    onRowClick(row.original);
                  }
                }}
                _hover={{
                  cursor:
                    typeof onRowClick === "function" ? "pointer" : undefined,
                  background: rowBackground,
                }}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <Td key={cell.id} fontSize="sm" px={4} py={2}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
        {/* )} */}
      </ChakraTable>

      {rows.length > 0 && shouldPaginate && (
        <Pagination {...pagination} colorScheme={colorScheme} />
      )}
    </Box>
  );
};

type IndeterminateCheckboxProps = {
  checked: boolean;
  indeterminate: boolean;
  [key: string]: any;
};

const IndeterminateCheckbox = forwardRef<
  HTMLInputElement,
  IndeterminateCheckboxProps
>(({ indeterminate, checked, ...rest }, ref) => {
  return (
    <Checkbox
      ref={ref}
      colorScheme="blackAlpha"
      isChecked={checked}
      isIndeterminate={indeterminate}
      ml={2}
      {...rest}
    />
  );
});

IndeterminateCheckbox.displayName = "IndeterminateCheckbox";

function getSelectableColumn<T>(): ColumnDef<T> {
  return {
    id: "select",
    header: ({ table }) => (
      <IndeterminateCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row }) => (
      <IndeterminateCheckbox
        {...{
          checked: row.getIsSelected(),
          indeterminate: row.getIsSomeSelected(),
          onChange: row.getToggleSelectedHandler(),
        }}
      />
    ),
  };
}

export default Table;
