import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Table } from "~/components";
import { EditableList } from "~/components/Editable";
import type {
  AccountListItem,
  InventoryPostingGroup,
} from "~/modules/accounting";
import type { ListItem } from "~/types";
import usePostingGroups from "./usePostingGroups";

type InventoryPostingGroupsTableProps = {
  data: InventoryPostingGroup[];
  count: number;
  partGroups: ListItem[];
  locations: ListItem[];
  balanceSheetAccounts: AccountListItem[];
  incomeStatementAccounts: AccountListItem[];
};

const InventoryPostingGroupsTable = ({
  data,
  count,
  partGroups,
  locations,
  balanceSheetAccounts,
  incomeStatementAccounts,
}: InventoryPostingGroupsTableProps) => {
  const { canEdit, onCellEdit } = usePostingGroups("postingGroupInventory");

  const balanceSheetAccountOptions = useMemo(() => {
    return balanceSheetAccounts.map((account) => ({
      label: account.number,
      value: account.number,
    }));
  }, [balanceSheetAccounts]);

  const incomeStatementAccountOptions = useMemo(() => {
    return incomeStatementAccounts.map((account) => ({
      label: account.number,
      value: account.number,
    }));
  }, [incomeStatementAccounts]);

  const columns = useMemo<ColumnDef<InventoryPostingGroup>[]>(() => {
    return [
      {
        id: "partGroup",
        header: "Part Group",
        cell: ({ row }) =>
          partGroups.find((group) => group.id === row.original.partGroupId)
            ?.name,
      },
      {
        id: "location",
        header: "Location",
        cell: ({ row }) =>
          locations.find((type) => type.id === row.original.locationId)?.name,
      },
      {
        accessorKey: "costOfGoodsSoldAccount",
        header: "COGS",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "inventoryAccount",
        header: "Inventory",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "inventoryInterimAccrualAccount",
        header: "Inv. Interim Accrual",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "inventoryReceivedNotInvoicedAccount",
        header: "Received Not Invoiced",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "inventoryInvoicedNotReceivedAccount",
        header: "Invoiced Not Received",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "inventoryShippedNotInvoicedAccount",
        header: "Shipped Not Invoiced",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "workInProgressAccount",
        header: "WIP",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "directCostAppliedAccount",
        header: "Direct Cost Applied",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "overheadCostAppliedAccount",
        header: "Overhead Cost Applied",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "purchaseVarianceAccount",
        header: "Purchase Variance",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "inventoryAdjustmentVarianceAccount",
        header: "Inv. Adjustment Variance",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "materialVarianceAccount",
        header: "Material Variance",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "capacityVarianceAccount",
        header: "Capacity Variance",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "overheadAccount",
        header: "Overhead",
        cell: (item) => item.getValue(),
      },
    ];
  }, [locations, partGroups]);

  const editableComponents = useMemo(
    () => ({
      costOfGoodsSoldAccount: EditableList(
        onCellEdit,
        incomeStatementAccountOptions
      ),
      inventoryAccount: EditableList(onCellEdit, balanceSheetAccountOptions),
      inventoryInterimAccrualAccount: EditableList(
        onCellEdit,
        balanceSheetAccountOptions
      ),
      inventoryReceivedNotInvoicedAccount: EditableList(
        onCellEdit,
        balanceSheetAccountOptions
      ),
      inventoryInvoicedNotReceivedAccount: EditableList(
        onCellEdit,
        balanceSheetAccountOptions
      ),
      inventoryShippedNotInvoicedAccount: EditableList(
        onCellEdit,
        balanceSheetAccountOptions
      ),
      workInProgressAccount: EditableList(
        onCellEdit,
        balanceSheetAccountOptions
      ),
      directCostAppliedAccount: EditableList(
        onCellEdit,
        incomeStatementAccountOptions
      ),
      overheadCostAppliedAccount: EditableList(
        onCellEdit,
        incomeStatementAccountOptions
      ),
      purchaseVarianceAccount: EditableList(
        onCellEdit,
        incomeStatementAccountOptions
      ),
      inventoryAdjustmentVarianceAccount: EditableList(
        onCellEdit,
        incomeStatementAccountOptions
      ),
      materialVarianceAccount: EditableList(
        onCellEdit,
        incomeStatementAccountOptions
      ),
      capacityVarianceAccount: EditableList(
        onCellEdit,
        incomeStatementAccountOptions
      ),
      overheadAccount: EditableList(onCellEdit, incomeStatementAccountOptions),
    }),
    [onCellEdit, balanceSheetAccountOptions, incomeStatementAccountOptions]
  );

  return (
    <Table<InventoryPostingGroup>
      data={data}
      columns={columns}
      count={count}
      editableComponents={editableComponents}
      withInlineEditing={canEdit}
    />
  );
};

export default InventoryPostingGroupsTable;
