import { useColor, useEscape } from "@carbon/react";
import { clip } from "@carbon/utils";
import {
  Box,
  Flex,
  HStack,
  Icon,
  Table,
  Tbody,
  Text,
  Thead,
  Td,
  Th,
  Tr,
  VStack,
} from "@chakra-ui/react";
import type { ColumnDef, ColumnOrderState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useEffect, useRef, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { Row } from "./components";
import type {
  EditableTableCellComponent,
  Position,
} from "~/components/Editable";
import { getAccessorKey, updateNestedProperty } from "./utils";

interface GridProps<T extends object> {
  columns: ColumnDef<T>[];
  data: T[];
  defaultColumnOrder?: string[];
  defaultColumnVisibility?: Record<string, boolean>;
  editableComponents?: Record<string, EditableTableCellComponent<T>>;
  withColumnOrdering?: boolean;
  withNewRow?: boolean;
  withSimpleSorting?: boolean;
  onEditRow?: (row: T) => void;
  onNewRow?: () => void;
}

const Grid = <T extends object>({
  data,
  columns,
  editableComponents,
  defaultColumnOrder,
  defaultColumnVisibility,
  withColumnOrdering = false,
  withSimpleSorting = true,
  onEditRow,
  onNewRow,
}: GridProps<T>) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  /* Data for Optimistic Updates */
  const [internalData, setInternalData] = useState<T[]>(data);
  useEffect(() => {
    setInternalData(data);
  }, [data]);

  /* Column Visibility */
  const [columnVisibility, setColumnVisibility] = useState(
    defaultColumnVisibility ?? {}
  );

  /* Column Ordering */
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    defaultColumnOrder ?? []
  );

  /* Sorting */
  // const { isSorted, toggleSortBy } = useSort();

  // const columnAccessors = useMemo(
  //   () =>
  //     columns.reduce<Record<string, string>>((acc, column) => {
  //       const accessorKey: string | undefined = getAccessorKey(column);
  //       if (accessorKey?.includes("_"))
  //         throw new Error(
  //           `Invalid accessorKey ${accessorKey}. Cannot contain '_'`
  //         );
  //       if (accessorKey && column.header && typeof column.header === "string") {
  //         return {
  //           ...acc,
  //           [accessorKey]: column.header,
  //         };
  //       }
  //       return acc;
  //     }, {}),
  //   [columns]
  // );

  const table = useReactTable({
    data: internalData,
    columns: columns,
    state: {
      columnVisibility,
      columnOrder,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
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
      const tableColumns = [
        ...table.getLeftVisibleLeafColumns(),
        ...table.getCenterVisibleLeafColumns(),
      ];

      const column = tableColumns[selectedColumn];
      if (!column) return false;

      const accessorKey = getAccessorKey(column.columnDef);
      return (
        accessorKey && editableComponents && accessorKey in editableComponents
      );
    },
    [table, editableComponents]
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

  const onCellUpdate = useCallback(
    (rowIndex: number) => (columnId: string, value: unknown) =>
      table.options.meta?.updateData
        ? table.options.meta?.updateData(rowIndex, columnId, value)
        : undefined,
    [table]
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!selectedCell) return;

      const { code, shiftKey } = event;

      const commandCodes: {
        [key: string]: [number, number];
      } = {
        Tab: [0, 1],
        Enter: [1, 0],
      };

      const navigationCodes: {
        [key: string]: [number, number];
      } = {
        ArrowRight: [0, 1],
        ArrowLeft: [0, -1],
        ArrowDown: [1, 0],
        ArrowUp: [-1, 0],
      };

      const lastRow = table.getRowModel().rows.length - 1;
      const lastColumn = table.getVisibleLeafColumns().length - 1;

      const navigate = (
        delta: [number, number],
        tabWrap = false
      ): [number, number] => {
        const x0 = selectedCell?.column || 0;
        const y0 = selectedCell?.row || 0;

        let x1 = x0 + delta[1];
        let y1 = y0 + delta[0];

        if (tabWrap) {
          if (delta[1] > 0) {
            // wrap to the next row if we're on the last column
            if (x1 > lastColumn) {
              x1 = 0;
              y1 += 1;
            }
            // don't wrap to the next row if we're on the last row
            if (y1 > lastRow) {
              x1 = x0;
              y1 = y0;
            }
          } else {
            // reverse tab wrap
            if (x1 < 0) {
              x1 = lastColumn;
              y1 -= 1;
            }

            if (y1 < 0) {
              x1 = x0;
              y1 = y0;
            }
          }
        } else {
          x1 = clip(x1, 0, lastColumn);
        }

        y1 = clip(y1, 0, lastRow);

        return [x1, y1];
      };

      if (code in commandCodes) {
        event.preventDefault();

        if (
          !isEditing &&
          code === "Enter" &&
          !shiftKey &&
          isColumnEditable(selectedCell.column)
        ) {
          setIsEditing(true);
          return;
        }

        let direction = commandCodes[code];

        if (shiftKey) direction = [-direction[0], -direction[1]];
        const [x1, y1] = navigate(direction, code === "Tab");
        setSelectedCell({
          row: y1,
          column: x1,
        });
        if (isEditing) {
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
        // any other key (besides shift) activates editing
        // if the column is editable and a cell is selected
      } else if (
        !["ShiftLeft", "ShiftRight"].includes(code) &&
        !isEditing &&
        selectedCell &&
        isColumnEditable(selectedCell.column)
      ) {
        setIsEditing(true);
      }
    },
    [isColumnEditable, isEditing, selectedCell, setSelectedCell, table]
  );

  // reset the selected cell when the table data changes
  useEffect(() => {
    setSelectedCell(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnOrder, columnVisibility]);

  useEffect(() => {
    setColumnOrder(table.getAllLeafColumns().map((column) => column.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = table.getRowModel().rows;

  const borderColor = useColor("gray.200");
  const rowBackground = useColor("gray.50");

  return (
    <VStack w="full" h="full" spacing={0}>
      {/* {withColumnOrdering && (
        <GridHeader
          columnAccessors={columnAccessors}
          columnOrder={columnOrder}
          columns={table.getAllLeafColumns()}
          setColumnOrder={setColumnOrder}
          withColumnOrdering={withColumnOrdering}
        />
      )} */}
      <Box
        w="full"
        h="full"
        bg={useColor("white")}
        overflow="scroll"
        style={{ contain: "strict" }}
        ref={tableContainerRef}
        onKeyDown={onKeyDown}
      >
        <Table>
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id} h={10}>
                {headerGroup.headers.map((header) => {
                  const accessorKey = getAccessorKey(header.column.columnDef);

                  const sortable =
                    withSimpleSorting &&
                    accessorKey &&
                    !accessorKey.endsWith(".id") &&
                    header.column.columnDef.enableSorting !== false;
                  // const sorted = isSorted(accessorKey ?? "");

                  return (
                    <Th
                      key={header.id}
                      colSpan={header.colSpan}
                      // onClick={
                      //   sortable
                      //     ? () => toggleSortBy(accessorKey ?? "")
                      //     : undefined
                      // }
                      borderRightColor={borderColor}
                      borderRightStyle="solid"
                      borderRightWidth={1}
                      cursor={sortable ? "pointer" : undefined}
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
                          {/* <chakra.span pl="4">
                            {sorted ? (
                              sorted === -1 ? (
                                <FaSortDown aria-label="sorted descending" />
                              ) : (
                                <FaSortUp aria-label="sorted ascending" />
                              )
                            ) : sortable ? (
                              <FaSort
                                aria-label="sort"
                                style={{ opacity: 0.4 }}
                              />
                            ) : null}
                          </chakra.span> */}
                        </Flex>
                      )}
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {rows.map((row) => {
              return (
                <Row
                  key={row.id}
                  borderColor={borderColor}
                  backgroundColor={rowBackground}
                  editableComponents={editableComponents}
                  isEditing={isEditing}
                  selectedCell={selectedCell}
                  row={row}
                  rowIsSelected={selectedCell?.row === row.index}
                  onCellClick={onCellClick}
                  onCellUpdate={onCellUpdate}
                  onEditRow={onEditRow}
                />
              );
            })}
            {onNewRow && (
              <Tr
                onClick={onNewRow}
                cursor="pointer"
                h={10}
                _hover={{
                  backgroundColor: "gray.100",
                }}
              >
                <Td colSpan={24}>
                  <HStack spacing={2}>
                    <Icon color="gray.500" as={BsPlus} w={6} h={6} />
                    <Text color="gray.500">New</Text>
                  </HStack>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </VStack>
  );
};

export default Grid;
