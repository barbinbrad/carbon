import {
  Button,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import type { Table } from "@tanstack/react-table";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { useColor } from "../hooks";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const pageSizes = [15, 25, 50, 100];
  const pageSizeLabel = "results per page";
  const borderColor = useColor("gray.200");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <HStack
      align="center"
      bg={useColor("white")}
      borderTopColor={borderColor}
      borderTopWidth={1}
      borderTopStyle="solid"
      justify="space-between"
      px={4}
      py={2}
      spacing="6"
      w="full"
      zIndex={1}
    >
      <Menu>
        <MenuButton as={Button} variant="ghost">
          {table.getState().pagination.pageSize} {pageSizeLabel}
        </MenuButton>
        <MenuList fontSize="sm" boxShadow="xl" minW={48}>
          {pageSizes.map((size) => (
            <MenuItem
              key={`${size}`}
              onClick={() => {
                table.setPageSize(Number(size));
              }}
            >
              {size} {pageSizeLabel}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      <HStack spacing={2}>
        <Flex fontSize="sm" h={8} fontWeight="medium" alignItems="center">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </Flex>
        <Button
          isDisabled={!table.getCanPreviousPage()}
          onClick={() => {
            table.previousPage();
            scrollToTop();
          }}
          leftIcon={<BsChevronLeft />}
        >
          Previous
        </Button>
        <Button
          isDisabled={!table.getCanNextPage()}
          onClick={() => {
            table.nextPage();
            scrollToTop();
          }}
          rightIcon={<BsChevronRight />}
        >
          Next
        </Button>
      </HStack>
    </HStack>
  );
}
