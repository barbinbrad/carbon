import type { ThemeTypings } from "@chakra-ui/react";
import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
} from "@chakra-ui/react";

type PaginationProps = {
  count: number;
  offset: number;
  pageIndex: number;
  pageSize: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  pageCount: number;
  gotoPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (size: number) => void;
  colorScheme?: ThemeTypings["colorSchemes"];
};

export function Pagination({
  count,
  offset,
  pageIndex,
  pageSize,
  canPreviousPage,
  canNextPage,
  pageCount,
  gotoPage,
  nextPage,
  previousPage,
  setPageSize,
}: PaginationProps) {
  const pageSizes = [15, 25, 50, 100];
  const pageSizeLabel = "results per page";
  if (!pageSizes.includes(pageSize)) {
    pageSizes.push(pageSize);
    pageSizes.sort();
  }

  return (
    <Stack
      p={4}
      direction="row"
      justify="space-between"
      align="center"
      spacing="6"
    >
      <Stack direction="row" spacing={2}>
        <Menu>
          <MenuButton as={Button}>
            {pageSize} {pageSizeLabel}
          </MenuButton>
          <MenuList fontSize="sm" boxShadow="xl" minW={48}>
            {pageSizes.map((size) => (
              <MenuItem
                key={`${size}`}
                onClick={() => {
                  setPageSize(size);
                }}
              >
                {size} {pageSizeLabel}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Stack>
      <Stack direction="row" spacing={2}>
        <Flex fontSize="sm" h={8} fontWeight="medium" alignItems="center">
          {offset + 1} - {Math.min(offset + pageSize, count)} of {count}
        </Flex>
        <Button disabled={!canPreviousPage} onClick={previousPage}>
          Previous
        </Button>
        <Button disabled={!canNextPage} onClick={nextPage}>
          Next
        </Button>
      </Stack>
    </Stack>
  );
}
