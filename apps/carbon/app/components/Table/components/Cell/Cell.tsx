import {
  Box,
  HStack,
  Popover,
  PopoverAnchor,
  PopoverBody,
  PopoverContent,
} from "@chakra-ui/react";
import type { Cell as CellType } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { useMovingCellRef } from "../../hooks/useMovingCellRef";
import { memo } from "react";
import { Td, spring } from "../Animations";
import type { EditableTableCellComponent } from "../../types";
import { getAccessorKey } from "../../utils";

type CellProps<T> = {
  borderColor: string;
  cell: CellType<T, unknown>;
  columnIndex: number;
  editableComponents?: Record<string, EditableTableCellComponent<T>>;
  isSelected: boolean;
  isEditing: boolean;
  isEditMode: boolean;
  onClick?: () => void;
  onUpdate?: (value: unknown) => void;
};

const Cell = <T extends object>({
  borderColor,
  cell,
  columnIndex,
  editableComponents,
  isSelected,
  isEditing,
  isEditMode,
  onClick,
  onUpdate,
}: CellProps<T>) => {
  const { ref, tabIndex, onFocus } = useMovingCellRef(isSelected);
  const accessorKey = getAccessorKey(cell.column.columnDef);

  const hasEditableTableCellComponent =
    accessorKey !== undefined &&
    editableComponents &&
    accessorKey in editableComponents;

  const editableCell = hasEditableTableCellComponent
    ? editableComponents[accessorKey]({
        accessorKey,
        value: cell.getValue(),
        row: cell.row.original,
        onUpdate:
          onUpdate ||
          (() => {
            console.error("failed to pass an onUpdate function to the popover");
          }),
      })
    : null;

  return (
    <Td
      ref={ref}
      data-row={cell.row.index}
      data-column={columnIndex}
      layout
      transition={spring}
      tabIndex={tabIndex}
      bgColor={
        isEditMode && !hasEditableTableCellComponent ? "gray.50" : undefined
      }
      borderRightColor={borderColor}
      borderRightStyle="solid"
      borderRightWidth={isEditMode ? 1 : undefined}
      boxShadow={
        isSelected
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
      <Box ref={ref}>
        {isSelected && isEditing && hasEditableTableCellComponent ? (
          <Popover
            isOpen
            onOpen={() => console.log("opened")}
            onClose={() => console.log("closed")}
            closeOnBlur
            isLazy
          >
            <PopoverAnchor>
              <Box>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Box>
            </PopoverAnchor>

            <PopoverContent>
              <PopoverBody>
                <HStack spacing={2}>{editableCell}</HStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        ) : (
          flexRender(cell.column.columnDef.cell, cell.getContext())
        )}
      </Box>
    </Td>
  );
};

export const MemoizedCell = memo(
  Cell,
  (prev, next) =>
    next.cell.column.columnDef.id !== "Select" &&
    next.isSelected === prev.isSelected &&
    next.isEditing === prev.isEditing &&
    next.isEditMode === prev.isEditMode &&
    next.cell.getValue() === prev.cell.getValue() &&
    next.cell.getContext() === prev.cell.getContext()
) as typeof Cell;
