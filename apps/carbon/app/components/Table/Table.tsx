import { useColor } from "@carbon/react";
import type { ThemeTypings } from "@chakra-ui/react";
import {
  Box,
  Flex,
  Grid,
  Table as ChakraTable,
  Thead,
  Tbody,
  Tr as ChakraTr,
  Th as ChakraTh,
  Td as ChakraTd,
  chakra,
} from "@chakra-ui/react";
import type {
  ColumnDef,
  ColumnOrderState,
  ColumnPinningState,
  RowSelectionState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { AiFillCaretUp, AiFillCaretDown } from "react-icons/ai";
import {
  Header,
  IndeterminateCheckbox,
  Pagination,
  usePagination,
  useSort,
} from "./components";
import type { TableAction } from "./types";

interface TableProps<T extends object> {
  columns: ColumnDef<T>[];
  data: T[];
  actions?: TableAction<T>[];
  count?: number;
  colorScheme?: ThemeTypings["colorSchemes"];
  defaultColumnVisibility?: Record<string, boolean>;
  withColumnOrdering?: boolean;
  withFilters?: boolean;
  withPagination?: boolean;
  withSelectableRows?: boolean;
  withSimpleSorting?: boolean;
  onRowClick?: (row: T) => void;
  onSelectedRowsChange?: (selectedRows: T[]) => void;
}

const Table = <T extends object>({
  data,
  columns,
  actions = [],
  count = 0,
  colorScheme = "blackAlpha",
  defaultColumnVisibility = {},
  withFilters = false,
  withColumnOrdering = false,
  withPagination = true,
  withSelectableRows = false,
  withSimpleSorting = true,
  onRowClick,
  onSelectedRowsChange,
}: TableProps<T>) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  if (withSelectableRows) columns.unshift(getRowSelectionColumn<T>());

  const pagination = usePagination(count, setRowSelection);

  const [columnVisibility, setColumnVisibility] = useState(
    defaultColumnVisibility
  );

  const { isSorted, toggleSortBy } = useSort();
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(
    withColumnOrdering
      ? {
          left: ["select"],
        }
      : {}
  );

  const columnAccessors = useMemo(
    () =>
      columns.reduce<Record<string, string>>((acc, column) => {
        if (
          column.header &&
          typeof column.header === "string" &&
          "accessorKey" in column
        ) {
          return {
            ...acc,
            [column.accessorKey.toString()]: column.header,
          };
        }
        return acc;
      }, {}),
    [columns]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      columnVisibility,
      columnOrder,
      columnPinning,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  const selectedRows = withSelectableRows
    ? table.getSelectedRowModel().flatRows.map((row) => row.original)
    : [];

  useEffect(() => {
    setColumnOrder(table.getAllLeafColumns().map((column) => column.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof onSelectedRowsChange === "function") {
      onSelectedRowsChange(selectedRows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection, onSelectedRowsChange]);

  const rows = table.getRowModel().rows;
  const defaultBackground = useColor("white");
  const rowBackground = useColor("gray.50");
  const borderColor = useColor("gray.200");

  return (
    <>
      <Box w="full" h="full">
        {(withColumnOrdering || withFilters || withSelectableRows) && (
          <Header
            actions={actions}
            columnAccessors={columnAccessors}
            columnOrder={columnOrder}
            columns={table.getAllLeafColumns()}
            selectedRows={selectedRows}
            setColumnOrder={setColumnOrder}
            pagination={pagination}
            withColumnOrdering={withColumnOrdering}
            withFilters={withFilters}
            withPagination={withPagination}
            withSelectableRows={withSelectableRows}
          />
        )}
        <Box h="full" overflow="scroll" style={{ contain: "strict" }}>
          <Grid
            w="full"
            gridTemplateColumns={withColumnOrdering ? "auto 1fr auto" : "1fr"}
          >
            {/* Pinned left columns */}
            {withColumnOrdering ? (
              <ChakraTable
                bg={defaultBackground}
                borderRightColor={borderColor}
                borderRightStyle="solid"
                borderRightWidth={4}
                position="sticky"
                left={0}
              >
                <Thead h={10}>
                  {table.getLeftHeaderGroups().map((headerGroup) => (
                    <Tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        // TODO: improve this
                        const sortable =
                          withSimpleSorting &&
                          "accessorKey" in header.column.columnDef &&
                          header.column.columnDef.enableSorting !== false;
                        const sorted = isSorted(
                          // @ts-ignore
                          header.column.columnDef?.accessorKey ?? ""
                        );
                        return (
                          <Th
                            key={header.id}
                            layout
                            onClick={
                              sortable
                                ? () =>
                                    toggleSortBy(
                                      // @ts-ignore
                                      header.column.columnDef?.accessorKey ?? ""
                                    )
                                : undefined
                            }
                            cursor={sortable ? "pointer" : undefined}
                            transition={spring}
                            colSpan={header.colSpan}
                            px={4}
                            py={2}
                            whiteSpace="nowrap"
                          >
                            <Flex
                              justify="flex-start"
                              align="center"
                              fontSize="xs"
                              color="gray.500"
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              <chakra.span pl="4">
                                {sorted ? (
                                  sorted === -1 ? (
                                    <AiFillCaretDown aria-label="sorted descending" />
                                  ) : (
                                    <AiFillCaretUp aria-label="sorted ascending" />
                                  )
                                ) : null}
                              </chakra.span>
                            </Flex>
                          </Th>
                        );
                      })}
                    </Tr>
                  ))}
                </Thead>
                <Tbody>
                  <AnimatePresence>
                    {rows.map((row) => {
                      return (
                        <Tr
                          key={row.id}
                          exit={{ opacity: 0 }}
                          layout
                          transition={spring}
                          onClick={() => {
                            if (typeof onRowClick === "function") {
                              onRowClick(row.original);
                            }
                          }}
                          _hover={{
                            cursor:
                              typeof onRowClick === "function"
                                ? "pointer"
                                : undefined,
                            background: rowBackground,
                          }}
                        >
                          {row.getLeftVisibleCells().map((cell) => {
                            return (
                              <Td
                                key={cell.id}
                                layout
                                transition={spring}
                                fontSize="sm"
                                px={4}
                                py={2}
                              >
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
                  </AnimatePresence>
                </Tbody>
              </ChakraTable>
            ) : null}

            {/* Unpinned columns */}
            <ChakraTable>
              <Thead h={10}>
                {(withColumnOrdering
                  ? table.getCenterHeaderGroups()
                  : table.getHeaderGroups()
                ).map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const sortable =
                        withSimpleSorting &&
                        "accessorKey" in header.column.columnDef;
                      const sorted = isSorted(
                        // @ts-ignore
                        header.column.columnDef?.accessorKey ?? ""
                      );

                      return (
                        <Th
                          key={header.id}
                          colSpan={header.colSpan}
                          onClick={
                            sortable
                              ? () =>
                                  toggleSortBy(
                                    // @ts-ignore
                                    header.column.columnDef?.accessorKey ?? ""
                                  )
                              : undefined
                          }
                          cursor={sortable ? "pointer" : undefined}
                          layout
                          transition={spring}
                          px={4}
                          py={3}
                          w={header.getSize()}
                          whiteSpace="nowrap"
                        >
                          <Flex
                            justify="flex-start"
                            align="center"
                            fontSize="xs"
                            color="gray.500"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            <chakra.span pl="4">
                              {sorted ? (
                                sorted === -1 ? (
                                  <AiFillCaretDown aria-label="sorted descending" />
                                ) : (
                                  <AiFillCaretUp aria-label="sorted ascending" />
                                )
                              ) : null}
                            </chakra.span>
                          </Flex>
                        </Th>
                      );
                    })}
                  </Tr>
                ))}
              </Thead>
              <Tbody>
                <AnimatePresence>
                  {rows.map((row) => {
                    return (
                      <Tr
                        key={row.id}
                        exit={{ opacity: 0 }}
                        layout
                        transition={spring}
                        onClick={() => {
                          if (typeof onRowClick === "function") {
                            onRowClick(row.original);
                          }
                        }}
                        _hover={{
                          cursor:
                            typeof onRowClick === "function"
                              ? "pointer"
                              : undefined,
                          background: rowBackground,
                        }}
                      >
                        {(withColumnOrdering
                          ? row.getCenterVisibleCells()
                          : row.getVisibleCells()
                        ).map((cell) => {
                          return (
                            <Td
                              key={cell.id}
                              fontSize="sm"
                              layout
                              transition={spring}
                              px={4}
                              py={withColumnOrdering ? 3 : 2}
                              whiteSpace="nowrap"
                            >
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
                </AnimatePresence>
              </Tbody>
            </ChakraTable>

            {/* Pinned right columns
            {withColumnOrdering ? (
              <ChakraTable
                bg={defaultBackground}
                borderLeftColor={borderColor}
                borderLeftStyle="solid"
                borderLeftWidth={4}
                // position="sticky"
                // right={0}
              >
                <Thead h={10}>
                  {table.getRightHeaderGroups().map((headerGroup) => (
                    <Tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <Th
                            key={header.id}
                            layout
                            transition={spring}
                            colSpan={header.colSpan}
                            px={4}
                            py={3}
                          >
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
                <Tbody>
                  <AnimatePresence>
                    {rows.map((row) => {
                      return (
                        <Tr
                          key={row.id}
                          exit={{ opacity: 0 }}
                          layout
                          transition={spring}
                          onClick={() => {
                            if (typeof onRowClick === "function") {
                              onRowClick(row.original);
                            }
                          }}
                          _hover={{
                            cursor:
                              typeof onRowClick === "function"
                                ? "pointer"
                                : undefined,
                            background: rowBackground,
                          }}
                        >
                          {row.getRightVisibleCells().map((cell) => {
                            return (
                              <Td
                                key={cell.id}
                                layout
                                transition={spring}
                                fontSize="sm"
                                px={4}
                                py={2}
                              >
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
                  </AnimatePresence>
                </Tbody>
              </ChakraTable>
            ) : null} */}
          </Grid>
        </Box>
      </Box>
      {withPagination && (
        <Pagination {...pagination} colorScheme={colorScheme} />
      )}
    </>
  );
};

const Th = motion(ChakraTh);
const Tr = motion(ChakraTr);
const Td = motion(ChakraTd);

const spring = {
  type: "spring",
  damping: 10,
  stiffness: 30,
};

function getRowSelectionColumn<T>(): ColumnDef<T> {
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
