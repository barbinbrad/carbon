import {
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Th,
} from "@chakra-ui/react";
import type { Column } from "@tanstack/react-table";
import { LuChevronsUpDown } from "react-icons/lu";
import {
  MdDisabledVisible,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
} from "react-icons/md";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <Th>{title}</Th>;
  }

  return (
    <Menu>
      <MenuButton as={HStack}>
        <span>{title}</span>
        {column.getIsSorted() === "desc" ? (
          <Icon as={MdKeyboardArrowDown} ml={2} />
        ) : column.getIsSorted() === "asc" ? (
          <Icon as={MdKeyboardArrowUp} ml={2} />
        ) : (
          <Icon as={LuChevronsUpDown} ml={2} />
        )}
      </MenuButton>
      <MenuList>
        <MenuItem
          icon={<MdKeyboardArrowUp />}
          onClick={() => column.toggleSorting(false)}
        >
          Asc
        </MenuItem>
        <MenuItem
          icon={<MdKeyboardArrowDown />}
          onClick={() => column.toggleSorting(true)}
        >
          Desc
        </MenuItem>
        <MenuItem
          icon={<MdDisabledVisible />}
          disabled={!column.getCanHide()}
          onClick={() => column.toggleVisibility(false)}
        >
          Hide
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
