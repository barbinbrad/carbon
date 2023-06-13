import { Tr } from "@chakra-ui/react";
import type { Row as RowType } from "@tanstack/react-table";
import type { MutableRefObject } from "react";
import { memo } from "react";
import Cell from "../Cell";
import type { EditableTableCellComponent, Position } from "../../types";

type RowProps<T> = {
  borderColor: string;
  backgroundColor: string;
  editableComponents?: Record<string, EditableTableCellComponent<T> | object>;
  editedCells?: string[];
  isEditing: boolean;
  selectedCell: Position;
  row: RowType<T>;
  rowIsClickable?: boolean;
  rowRef?: MutableRefObject<HTMLTableRowElement | null>;
  onCellClick: (row: number, column: number) => void;
  onCellUpdate: (row: number, columnId: string) => (value: unknown) => void;
  onEditRow?: (row: T) => void;
};

const Row = <T extends object>({
  borderColor,
  backgroundColor,
  editableComponents,
  editedCells,
  isEditing,
  row,
  rowIsClickable = false,
  rowRef,
  selectedCell,
  onCellClick,
  onCellUpdate,
}: RowProps<T>) => {
  return (
    <Tr
      key={row.id}
      ref={rowRef}
      _hover={{
        cursor: rowIsClickable ? "pointer" : undefined,
        backgroundColor,
      }}
    >
      {row.getVisibleCells().map((cell, columnIndex) => {
        const isSelected =
          selectedCell?.row === cell.row.index &&
          selectedCell?.column === columnIndex;

        return (
          <Cell<T>
            key={cell.id}
            borderColor={borderColor}
            cell={cell}
            columnIndex={columnIndex}
            // @ts-ignore
            editableComponents={editableComponents}
            editedCells={editedCells}
            isSelected={isSelected}
            isEditing={isEditing}
            onClick={() => onCellClick(cell.row.index, columnIndex)}
            onUpdate={() => onCellUpdate(cell.row.index, cell.column.id)}
          />
        );
      })}
    </Tr>
  );
};

const MemoizedRow = memo(
  Row,
  (prev, next) =>
    next.selectedCell?.row === prev.row.index &&
    next.row.index === prev.selectedCell?.row &&
    next.selectedCell?.column === prev.selectedCell?.column &&
    next.isEditing === prev.isEditing
) as typeof Row;

export default MemoizedRow;
