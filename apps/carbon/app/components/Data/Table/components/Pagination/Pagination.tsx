import { useColor } from "@carbon/react";
import type { ThemeTypings } from "@chakra-ui/react";
import {
  Button,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

export type PaginationProps = {
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

const Pagination = (props: PaginationProps) => {
  const { pageSize, setPageSize } = props;

  const pageSizes = [15, 25, 50, 100];
  const pageSizeLabel = "results per page";
  if (!pageSizes.includes(pageSize)) {
    pageSizes.push(pageSize);
    pageSizes.sort();
  }

  const borderColor = useColor("gray.200");

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
      <HStack spacing={2}>
        <Menu>
          <MenuButton as={Button} variant="ghost">
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
      </HStack>
      <HStack spacing={2}>
        <PaginationButtons {...props} />
      </HStack>
    </HStack>
  );
};

export const PaginationButtons = ({
  condensed = false,
  canNextPage,
  canPreviousPage,
  count,
  nextPage,
  offset,
  pageSize,
  previousPage,
}: PaginationProps & { condensed?: boolean }) => {
  return (
    <>
      {condensed ? (
        <>
          <IconButton
            aria-label="Previous"
            icon={<BsChevronLeft />}
            disabled={!canPreviousPage}
            onClick={previousPage}
          />
          <IconButton
            aria-label="Next"
            icon={<BsChevronRight />}
            disabled={!canNextPage}
            onClick={nextPage}
          />
        </>
      ) : (
        <>
          <Flex fontSize="sm" h={8} fontWeight="medium" alignItems="center">
            {count > 0 ? offset + 1 : 0} - {Math.min(offset + pageSize, count)}{" "}
            of {count}
          </Flex>
          <Button
            disabled={!canPreviousPage}
            onClick={previousPage}
            leftIcon={<BsChevronLeft />}
          >
            Previous
          </Button>
          <Button
            disabled={!canNextPage}
            onClick={nextPage}
            rightIcon={<BsChevronRight />}
          >
            Next
          </Button>
        </>
      )}
    </>
  );
};

export default Pagination;
