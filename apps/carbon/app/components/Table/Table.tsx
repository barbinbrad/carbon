import { useColor, useEscape } from "@carbon/react";
import { clip } from "@carbon/utils";
import type { ThemeTypings } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react";
import {
  Box,
  Flex,
  Grid,
  Table as ChakraTable,
  Tbody,
  Td,
  Th,
  Tr,
  Thead,
  chakra,
} from "@chakra-ui/react";
import type {
  ColumnDef,
  ColumnOrderState,
  ColumnPinningState,
  Row as RowType,
  RowSelectionState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
// import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useVirtual } from "react-virtual";
import { AiFillCaretUp, AiFillCaretDown } from "react-icons/ai";
import {
  Header,
  IndeterminateCheckbox,
  Pagination,
  // Td,
  // Th,
  // Tr,
  // spring,
  usePagination,
  useSort,
  Row,
} from "./components";
import type { EditableComponent, Position, TableAction } from "./types";
import { getAccessorKey, updateNestedProperty } from "./utils";

interface TableProps<T extends object> {
  columns: ColumnDef<T>[];
  data: T[];
  actions?: TableAction<T>[];
  count?: number;
  colorScheme?: ThemeTypings["colorSchemes"];
  defaultColumnVisibility?: Record<string, boolean>;
  editableComponents?: Record<string, EditableComponent<T>>;
  withColumnOrdering?: boolean;
  withInlineEditing?: boolean;
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
  editableComponents = {},
  defaultColumnVisibility = {},
  withFilters = false,
  withInlineEditing = false,
  withColumnOrdering = false,
  withPagination = true,
  withSelectableRows = false,
  withSimpleSorting = true,
  onRowClick,
  onSelectedRowsChange,
}: TableProps<T>) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const [internalData, setInternalData] = useState<T[]>(data);
  useEffect(() => {
    setInternalData(data);
  }, [data]);

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
        const accessorKey: string | undefined = getAccessorKey(column);
        if (accessorKey?.includes("_"))
          throw new Error(
            `Invalid accessorKey ${accessorKey}. Cannot contain '_'`
          );
        if (accessorKey && column.header && typeof column.header === "string") {
          return {
            ...acc,
            [accessorKey]: column.header,
          };
        }
        return acc;
      }, {}),
    [columns]
  );

  const table = useReactTable({
    data: internalData,
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
    meta: {
      // These are not part of the standard API, but are accessible via table.options.meta
      editableComponents,
      updateData: (rowIndex, columnId, value) => {
        setInternalData((previousData) =>
          previousData.map((row, index) => {
            if (index === rowIndex) {
              if (columnId.includes("_") && !(columnId in row)) {
                updateNestedProperty(row, columnId, value);
                return row;
              } else {
                return {
                  ...row,
                  [columnId]: value,
                };
              }
            }
            return row;
          })
        );
      },
    },
  });

  const selectedRows = withSelectableRows
    ? table.getSelectedRowModel().flatRows.map((row) => row.original)
    : [];

  const [editMode, setEditMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCell, setSelectedCell] = useState<Position>(null);

  const focusOnSelectedCell = useCallback(() => {
    if (selectedCell == null) return;
    const cell = tableContainerRef.current?.querySelector(
      `[data-row="${selectedCell.row}"][data-column="${selectedCell.column}"]`
    ) as HTMLDivElement;
    if (cell) cell.focus();
  }, [selectedCell, tableContainerRef]);

  useEscape(() => {
    setIsEditing(false);
    focusOnSelectedCell();
  });

  const onSelectedCellChange = useCallback(
    (position: Position) => {
      if (
        selectedCell == null ||
        position == null ||
        selectedCell.row !== position?.row ||
        selectedCell.column !== position.column
      )
        setSelectedCell(position);
    },
    [selectedCell]
  );

  const isColumnEditable = useCallback(
    (selectedColumn: number) => {
      if (!withInlineEditing) return false;

      const columns = table.getVisibleLeafColumns();
      const column =
        columns[withSelectableRows ? selectedColumn + 1 : selectedColumn];
      if (!column) return false;

      const accessorKey = getAccessorKey(column.columnDef);
      return accessorKey && accessorKey in editableComponents;
    },
    [table, editableComponents, withInlineEditing, withSelectableRows]
  );

  const onCellClick = useCallback(
    (row: number, column: number) => {
      // ignore row select checkbox column
      if (
        selectedCell?.row === row &&
        selectedCell?.column === column &&
        isColumnEditable(column)
      ) {
        setIsEditing(true);
        return;
      }
      // ignore row select checkbox column
      if (column === -1) return;
      setIsEditing(false);
      onSelectedCellChange({ row, column });
    },
    [selectedCell, isColumnEditable, onSelectedCellChange]
  );

  const onCellEditUpdate = useCallback(
    (rowIndex: number, columnId: string) => (value: unknown) => {
      return table.options.meta?.updateData
        ? table.options.meta?.updateData(rowIndex, columnId, value)
        : undefined;
    },
    [table]
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!selectedCell) return;

      const { code } = event;

      const commandCodes: {
        [key: string]: [0, 1] | [1, 0] | [0, -1] | [-1, 0];
      } = {
        Tab: [0, 1],
        Enter: [1, 0],
      };

      const navigationCodes: {
        [key: string]: [0, 1] | [1, 0] | [0, -1] | [-1, 0];
      } = {
        ArrowRight: [0, 1],
        ArrowLeft: [0, -1],
        ArrowDown: [1, 0],
        ArrowUp: [-1, 0],
      };

      const lastRow = table.getRowModel().rows.length - 1;
      const lastColumn =
        table.getVisibleLeafColumns().length - 1 - (withSelectableRows ? 1 : 0);

      const navigate = (delta: number[], tabWrap = false): number[] => {
        const x0 = selectedCell?.column || 0;
        const y0 = selectedCell?.row || 0;

        let x1 = x0 + delta[1];
        let y1 = y0 + delta[0];

        if (tabWrap) {
          // wrap to the next row if we're on the last column
          if (x1 > lastColumn) {
            x1 = 0;
            y1++;
          }
          // don't wrap to the next row if we're on the last row
          if (y1 > lastRow) {
            x1 = x0;
            y1 = y0;
          }
        } else {
          x1 = clip(x1, 0, lastColumn);
        }

        y1 = clip(y1, 0, lastRow);

        return [x1, y1];
      };

      if (code in commandCodes) {
        // enter and tab work even if we're editing
        event.preventDefault();
        const [x1, y1] = navigate(commandCodes[code], code === "Tab");
        setSelectedCell({
          row: y1,
          column: x1,
        });

        if (isEditing) {
          focusOnSelectedCell();
          setIsEditing(false);
        }
      } else if (code in navigationCodes) {
        // arrow key navigation should't work if we're editing
        if (isEditing) return;
        event.preventDefault();
        const [x1, y1] = navigate(navigationCodes[code], code === "Tab");
        setIsEditing(false);
        setSelectedCell({
          row: y1,
          column: x1,
        });
      } else if (
        !isEditing &&
        selectedCell &&
        isColumnEditable(selectedCell.column)
      ) {
        // any other key activates editing if the column is editable and a cell is selected
        setIsEditing(true);
      }
    },
    [
      focusOnSelectedCell,
      isColumnEditable,
      isEditing,
      selectedCell,
      setSelectedCell,
      table,
      withSelectableRows,
    ]
  );

  // reset the selected cell when the table data changes
  useEffect(() => {
    setSelectedCell(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    editMode,
    pagination.pageIndex,
    pagination.pageSize,
    columnOrder,
    columnVisibility,
  ]);

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
  const rowsAreClickable = !editMode && typeof onRowClick === "function";

  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 10,
  });

  // const columnVirtualizer = useVirtual({
  //   horizontal: true,
  //   size: table.getVisibleLeafColumns().length,
  //   parentRef: tableContainerRef,
  //   estimateSize: useCallback(() => 250, []),
  //   overscan: 5,
  // });

  const { virtualItems: virtualRows, totalSize: totalRows } = rowVirtualizer;

  const virtualPaddingTop =
    virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const virutalPaddingBottom =
    virtualRows.length > 0
      ? totalRows - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0;

  const defaultBackground = useColor("white");
  const borderColor = useColor("gray.200");
  const rowBackground = useColor("gray.50");

  return (
    <VStack w="full" h="full" spacing={0}>
      {(withColumnOrdering || withFilters || withSelectableRows) && (
        <Header
          actions={actions}
          columnAccessors={columnAccessors}
          columnOrder={columnOrder}
          columns={table.getAllLeafColumns()}
          editMode={editMode}
          selectedRows={selectedRows}
          setColumnOrder={setColumnOrder}
          setEditMode={setEditMode}
          pagination={pagination}
          withInlineEditing={withInlineEditing}
          withColumnOrdering={withColumnOrdering}
          withFilters={withFilters}
          withPagination={withPagination}
          withSelectableRows={withSelectableRows}
        />
      )}
      <Box
        w="full"
        h="full"
        overflow="scroll"
        style={{ contain: "strict" }}
        ref={tableContainerRef}
        onKeyDown={editMode ? onKeyDown : undefined}
      >
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
              <Thead>
                {table.getLeftHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id} h={10}>
                    {headerGroup.headers.map((header) => {
                      const accessorKey = getAccessorKey(
                        header.column.columnDef
                      );
                      const sortable =
                        withSimpleSorting &&
                        accessorKey &&
                        header.column.columnDef.enableSorting !== false;
                      const sorted = isSorted(accessorKey ?? "");

                      return (
                        <Th
                          key={header.id}
                          // layout
                          onClick={
                            sortable && !editMode
                              ? () => toggleSortBy(accessorKey ?? "")
                              : undefined
                          }
                          cursor={sortable ? "pointer" : undefined}
                          // transition={spring}
                          colSpan={header.colSpan}
                          px={4}
                          py={2}
                          whiteSpace="nowrap"
                        >
                          {header.isPlaceholder ? null : (
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
                          )}
                        </Th>
                      );
                    })}
                  </Tr>
                ))}
              </Thead>
              <Tbody>
                {virtualPaddingTop > 0 && (
                  <Tr>
                    <Td style={{ height: `${virtualPaddingTop}px` }} />
                  </Tr>
                )}
                {/* <AnimatePresence> */}
                {virtualRows.map((virtualRow) => {
                  const row = rows[virtualRow.index] as RowType<T>;

                  return (
                    <Row
                      key={row.id}
                      borderColor={borderColor}
                      backgroundColor={rowBackground}
                      editableComponents={editableComponents}
                      isEditing={isEditing}
                      isEditMode={editMode}
                      isFrozenColumn
                      selectedCell={selectedCell}
                      // @ts-ignore
                      row={row}
                      withColumnOrdering={withColumnOrdering}
                      onCellClick={onCellClick}
                      onCellUpdate={onCellEditUpdate}
                      onRowClick={
                        onRowClick ? () => onRowClick(row.original) : undefined
                      }
                    />
                  );
                })}
                {/* </AnimatePresence> */}
                {virutalPaddingBottom > 0 && (
                  <Tr>
                    <Td style={{ height: `${virutalPaddingBottom}px` }} />
                  </Tr>
                )}
              </Tbody>
            </ChakraTable>
          ) : null}

          {/* Unpinned columns */}
          <ChakraTable>
            <Thead>
              {(withColumnOrdering
                ? table.getCenterHeaderGroups()
                : table.getHeaderGroups()
              ).map((headerGroup) => (
                <Tr key={headerGroup.id} h={10}>
                  {headerGroup.headers.map((header) => {
                    const accessorKey = getAccessorKey(header.column.columnDef);
                    const sortable =
                      withSimpleSorting &&
                      accessorKey &&
                      header.column.columnDef.enableSorting !== false;
                    const sorted = isSorted(accessorKey ?? "");

                    return (
                      <Th
                        key={header.id}
                        colSpan={header.colSpan}
                        onClick={
                          sortable
                            ? () => toggleSortBy(accessorKey ?? "")
                            : undefined
                        }
                        borderRightColor={borderColor}
                        borderRightStyle="solid"
                        borderRightWidth={editMode ? 1 : undefined}
                        cursor={sortable ? "pointer" : undefined}
                        // layout
                        // transition={spring}
                        px={4}
                        py={3}
                        w={header.getSize()}
                        whiteSpace="nowrap"
                      >
                        {header.isPlaceholder ? null : (
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
                        )}
                      </Th>
                    );
                  })}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {virtualPaddingTop > 0 && (
                <Tr>
                  <Td style={{ height: `${virtualPaddingTop}px` }} />
                </Tr>
              )}
              {/* <AnimatePresence> */}
              {virtualRows.map((virtualRow) => {
                const row = rows[virtualRow.index] as RowType<T>;

                return (
                  <Row
                    key={row.id}
                    borderColor={borderColor}
                    backgroundColor={rowBackground}
                    // @ts-ignore
                    editableComponents={editableComponents}
                    isEditing={isEditing}
                    isEditMode={editMode}
                    pinnedColumns={
                      columnPinning?.left
                        ? columnPinning.left?.length -
                          (withSelectableRows ? 1 : 0)
                        : 0
                    }
                    selectedCell={selectedCell}
                    // @ts-ignore
                    row={row}
                    rowIsClickable={rowsAreClickable}
                    withColumnOrdering={withColumnOrdering}
                    onCellClick={onCellClick}
                    onCellUpdate={onCellEditUpdate}
                    onRowClick={
                      rowsAreClickable
                        ? () => onRowClick(row.original)
                        : undefined
                    }
                  />
                );
              })}
              {/* </AnimatePresence> */}
              {virutalPaddingBottom > 0 && (
                <Tr>
                  <Td style={{ height: `${virutalPaddingBottom}px` }} />
                </Tr>
              )}
            </Tbody>
          </ChakraTable>
        </Grid>
      </Box>
      {withPagination && (
        <Pagination {...pagination} colorScheme={colorScheme} />
      )}
    </VStack>
  );
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
