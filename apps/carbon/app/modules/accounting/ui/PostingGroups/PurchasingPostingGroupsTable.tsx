import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Table } from "~/components";
import { EditableList } from "~/components/Editable";
import type {
  AccountListItem,
  PurchasingPostingGroup,
} from "~/modules/accounting";
import type { ListItem } from "~/types";
import usePostingGroups from "./usePostingGroups";

type PurchasingPostingGroupsTableProps = {
  data: PurchasingPostingGroup[];
  count: number;
  partGroups: ListItem[];
  supplierTypes: ListItem[];
  balanceSheetAccounts: AccountListItem[];
  incomeStatementAccounts: AccountListItem[];
};

const PurchasingPostingGroupsTable = ({
  data,
  count,
  partGroups,
  supplierTypes,
  balanceSheetAccounts,
  incomeStatementAccounts,
}: PurchasingPostingGroupsTableProps) => {
  const { canEdit, handleCellEdit } = usePostingGroups(
    "postingGroupPurchasing"
  );

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

  const columns = useMemo<ColumnDef<PurchasingPostingGroup>[]>(() => {
    return [
      {
        id: "partGroup",
        header: "Part Group",
        cell: ({ row }) =>
          partGroups.find((group) => group.id === row.original.partGroupId)
            ?.name,
      },
      {
        id: "supplierType",
        header: "Supplier Type",
        cell: ({ row }) =>
          supplierTypes.find((type) => type.id === row.original.supplierTypeId)
            ?.name,
      },
      {
        accessorKey: "purchaseAccount",
        header: "Purchase",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "purchaseDiscountAccount",
        header: "Purchase Discount",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "purchaseCreditAccount",
        header: "Purchase Credit",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "purchasePrepaymentAccount",
        header: "Purchase Prepayment",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "purchaseTaxPayableAccount",
        header: "Purchase Tax Payable",
        cell: (item) => item.getValue(),
      },
    ];
  }, [supplierTypes, partGroups]);

  const editableComponents = useMemo(
    () => ({
      purchaseAccount: EditableList(
        handleCellEdit,
        incomeStatementAccountOptions
      ),
      purchaseDiscountAccount: EditableList(
        handleCellEdit,
        incomeStatementAccountOptions
      ),
      purchaseCreditAccount: EditableList(
        handleCellEdit,
        balanceSheetAccountOptions
      ),
      purchasePrepaymentAccount: EditableList(
        handleCellEdit,
        balanceSheetAccountOptions
      ),
      purchaseTaxPayableAccount: EditableList(
        handleCellEdit,
        balanceSheetAccountOptions
      ),
    }),
    [handleCellEdit, balanceSheetAccountOptions, incomeStatementAccountOptions]
  );

  return (
    <Table<PurchasingPostingGroup>
      data={data}
      columns={columns}
      count={count}
      editableComponents={editableComponents}
      withInlineEditing={canEdit}
    />
  );
};

export default PurchasingPostingGroupsTable;
