import type { Row as RowType } from "@tanstack/react-table";
import { Tr, spring } from "../Animations";
import Cell from "../Cell";
import type { EditableTableCellComponent, Position } from "../../types";
import { useColor } from "@carbon/react";
import type { MutableRefObject } from "react";

type RowProps<T> = {
  borderColor: string;
  backgroundColor: string;
  editableComponents?: Record<string, EditableTableCellComponent<T> | object>;
  isEditing: boolean;
  isEditMode: boolean;
  isFrozenColumn?: boolean;
  pinnedColumns?: number;
  selectedCell: Position;
  row: RowType<T>;
  rowIsClickable?: boolean;
  rowRef?: MutableRefObject<HTMLTableRowElement | null>;
  withColumnOrdering: boolean;
  onCellClick: (row: number, column: number) => void;
  onCellUpdate: (row: number, columnId: string) => (value: unknown) => void;
  onRowClick?: () => void;
};

const Row = <T extends object>({
  borderColor,
  backgroundColor,
  editableComponents,
  isEditing,
  isEditMode,
  isFrozenColumn = false,
  pinnedColumns = 0,
  row,
  rowIsClickable = false,
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
      exit={{ opacity: 0 }}
      layout
      transition={spring}
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
            onUpdate={
              isEditMode
                ? onCellUpdate(cell.row.index, cell.column.id)
                : undefined
            }
          />
        );
      })}
    </Tr>
  );
};

export default Row;
