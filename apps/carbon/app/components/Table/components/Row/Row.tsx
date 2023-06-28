import { useColor } from "@carbon/react";
import { Tr } from "@chakra-ui/react";
import type { Row as RowType } from "@tanstack/react-table";
import type { MutableRefObject } from "react";
import { memo } from "react";
import Cell from "../Cell";
import type {
  EditableTableCellComponent,
  Position,
} from "~/components/Editable";

type RowProps<T> = {
  borderColor: string;
  backgroundColor: string;
  editableComponents?: Record<string, EditableTableCellComponent<T> | object>;
  editedCells?: string[];
  isEditing: boolean;
  isEditMode: boolean;
  isFrozenColumn?: boolean;
  isRowSelected?: boolean;
  pinnedColumns?: number;
  selectedCell: Position;
  row: RowType<T>;
  rowIsClickable?: boolean;
  rowIsSelected: boolean;
  rowRef?: MutableRefObject<HTMLTableRowElement | null>;
  withColumnOrdering: boolean;
  onCellClick: (row: number, column: number) => void;
  onCellUpdate: (row: number) => (columnId: string, value: unknown) => void;
  onRowClick?: () => void;
};

const Row = <T extends object>({
  borderColor,
  backgroundColor,
  editableComponents,
  editedCells,
  isEditing,
  isEditMode,
  isFrozenColumn = false,
  isRowSelected = false,
  pinnedColumns = 0,
  row,
  rowIsClickable = false,
  rowIsSelected,
  rowRef,
  selectedCell,
  withColumnOrdering,
  onCellClick,
  onCellUpdate,
  onRowClick,
}: RowProps<T>) => {
  const frozenBackgroundColor = useColor("white");
  return (
    <Tr
      key={row.id}
      bg={isFrozenColumn ? frozenBackgroundColor : undefined}
      onClick={onRowClick}
      ref={rowRef}
      _hover={{
        cursor: rowIsClickable ? "pointer" : undefined,
        backgroundColor,
      }}
    >
      {(isFrozenColumn
        ? row.getLeftVisibleCells()
        : withColumnOrdering
        ? row.getCenterVisibleCells()
        : row.getVisibleCells()
      ).map((cell, columnIndex) => {
        const isSelected = isFrozenColumn
          ? selectedCell?.row === cell.row.index &&
            selectedCell?.column === columnIndex - 1
          : selectedCell?.row === cell.row.index &&
            selectedCell?.column === columnIndex + pinnedColumns;

        return (
          <Cell<T>
            key={cell.id}
            borderColor={borderColor}
            cell={cell}
            columnIndex={columnIndex}
            // @ts-ignore
            editableComponents={editableComponents}
            editedCells={editedCells}
            isRowSelected={isRowSelected}
            isSelected={isSelected}
            isEditing={isEditing}
            isEditMode={isEditMode}
            onClick={
              isEditMode
                ? () =>
                    onCellClick(
                      cell.row.index,
                      isFrozenColumn
                        ? columnIndex - 1
                        : columnIndex + pinnedColumns
                    )
                : undefined
            }
            onUpdate={isEditMode ? onCellUpdate(cell.row.index) : undefined}
          />
        );
      })}
    </Tr>
  );
};

const MemoizedRow = memo(
  Row,
  (prev, next) =>
    next.rowIsSelected === false &&
    prev.rowIsSelected === false &&
    next.isRowSelected === prev.isRowSelected &&
    next.selectedCell?.row === prev.row.index &&
    next.row.index === prev.selectedCell?.row &&
    next.selectedCell?.column === prev.selectedCell?.column &&
    next.isEditing === prev.isEditing &&
    next.isEditMode === prev.isEditMode
) as typeof Row;

export default MemoizedRow;
