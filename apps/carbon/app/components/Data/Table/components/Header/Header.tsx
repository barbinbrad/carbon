import { useColor } from "@carbon/react";
import { HStack } from "@chakra-ui/react";
import type { Column, ColumnOrderState } from "@tanstack/react-table";
import type { TableAction } from "../../types";
import Actions from "../Actions";
import Columns from "../Columns";
import Filter from "../Filter";
import type { PaginationProps } from "../Pagination";
import { PaginationButtons } from "../Pagination";
import Sort from "../Sort";

type HeaderProps<T> = {
  actions: TableAction<T>[];
  columnAccessors: Record<string, string>;
  columnOrder: ColumnOrderState;
  columns: Column<T, unknown>[];
  pagination: PaginationProps;
  selectedRows: T[];
  setColumnOrder: (newOrder: ColumnOrderState) => void;
  withColumnOrdering: boolean;
  withFilters: boolean;
  withPagination: boolean;
  withSelectableRows: boolean;
};

const Header = <T extends object>({
  actions,
  columnAccessors,
  columnOrder,
  columns,
  pagination,
  selectedRows,
  setColumnOrder,
  withColumnOrdering,
  withFilters,
  withPagination,
  withSelectableRows,
}: HeaderProps<T>) => {
  const borderColor = useColor("gray.200");

  return (
    <HStack
      px={4}
      py={3}
      justifyContent="space-between"
      borderBottomColor={borderColor}
      borderBottomStyle="solid"
      borderBottomWidth={1}
      w="full"
    >
      <HStack spacing={2}>
        {withSelectableRows && actions.length > 0 && (
          <Actions actions={actions} selectedRows={selectedRows} />
        )}
      </HStack>
      <HStack spacing={2}>
        {withFilters && (
          <>
            <Filter columnAccessors={columnAccessors} />
            <Sort columnAccessors={columnAccessors} />
          </>
        )}

        {withColumnOrdering && (
          <Columns
            columnOrder={columnOrder}
            columns={columns}
            setColumnOrder={setColumnOrder}
            withSelectableRows={withSelectableRows}
          />
        )}
        {withPagination && <PaginationButtons {...pagination} condensed />}
      </HStack>
    </HStack>
  );
};

export default Header;
