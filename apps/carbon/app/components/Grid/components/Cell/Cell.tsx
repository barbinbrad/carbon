import { Box, Td } from "@chakra-ui/react";
import type { Cell as CellType } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { memo, useState } from "react";
import { useMovingCellRef } from "~/hooks";
import type { EditableTableCellComponent } from "../../types";
import { getAccessorKey } from "../../utils";

type CellProps<T> = {
  borderColor: string;
  cell: CellType<T, unknown>;
  columnIndex: number;
  editableComponents?: Record<string, EditableTableCellComponent<T>>;
  editedCells?: string[];
  isEditing: boolean;
  isSelected: boolean;
  onClick?: () => void;
  onUpdate?: (value: unknown) => void;
};

const Cell = <T extends object>({
  borderColor,
  cell,
  columnIndex,
  editableComponents,
  editedCells,
  isEditing,
  isSelected,
  onClick,
  onUpdate,
}: CellProps<T>) => {
  const { ref, tabIndex, onFocus } = useMovingCellRef(isSelected);
  const [hasError, setHasError] = useState(false);
  const accessorKey = getAccessorKey(cell.column.columnDef);

  const wasEdited =
    !!editedCells && !!accessorKey && editedCells.includes(accessorKey);

  const hasEditableTableCellComponent =
    accessorKey !== undefined &&
    editableComponents &&
    accessorKey in editableComponents;

  const editableCell = hasEditableTableCellComponent
    ? editableComponents[accessorKey]({
        accessorKey,
        value: cell.renderValue(),
        row: cell.row.original,
        onUpdate: onUpdate
          ? (value, isValid = true) => {
              onUpdate(value);
              setHasError(!isValid);
            }
          : () => {
              console.error(
                "failed to pass an onUpdate function to the popover"
              );
            },
        onError: () => {
          setHasError(true);
        },
      })
    : null;

  return (
    <Td
      ref={ref}
      data-row={cell.row.index}
      data-column={columnIndex}
      tabIndex={tabIndex}
      position="relative"
      bgColor={
        wasEdited
          ? "yellow.100"
          : hasEditableTableCellComponent
          ? undefined
          : "gray.50"
      }
      borderRightColor={borderColor}
      borderRightStyle="solid"
      borderRightWidth={1}
      boxShadow={
        hasError
          ? "inset 0 0 0 3px var(--chakra-colors-red-500)"
          : isSelected
          ? "inset 0 0 0 3px var(--chakra-ui-focus-ring-color)"
          : undefined
      }
      fontSize="sm"
      outline="none"
      px={4}
      py={2}
      whiteSpace="nowrap"
      onClick={onClick}
      onFocus={onFocus}
    >
      {isSelected && isEditing && hasEditableTableCellComponent ? (
        <Box position="absolute" w="full" left={0} top="2px">
          {editableCell}
        </Box>
      ) : (
        <div ref={ref}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </div>
      )}
    </Td>
  );
};

export const MemoizedCell = memo(
  Cell,
  (prev, next) =>
    next.isSelected === prev.isSelected &&
    next.isEditing === prev.isEditing &&
    next.cell.getValue() === prev.cell.getValue() &&
    next.cell.getContext() === prev.cell.getContext()
) as typeof Cell;
