import {
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  chakra,
} from "@chakra-ui/react";
import type { Column } from "@tanstack/react-table";
import { FaSortDown, FaSortUp, FaSort } from "react-icons/fa";
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
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <span>{title}</span>;
  }

  return (
    <Menu>
      <MenuButton as={HStack} cursor="pointer" justifyContent="space-between">
        <Flex
          justify="flex-start"
          align="center"
          fontSize="xs"
          color="gray.500"
        >
          {title}
          <chakra.span pl="4">
            {column.getIsSorted() === "desc" ? (
              <FaSortDown aria-label="sorted descending" />
            ) : column.getIsSorted() === "asc" ? (
              <FaSortUp aria-label="sorted ascending" />
            ) : (
              <FaSort aria-label="sort" />
            )}
          </chakra.span>
        </Flex>
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
