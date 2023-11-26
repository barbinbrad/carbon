import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Table } from "~/components";
import { EditableList } from "~/components/Editable";
import type { AccountListItem, SalesPostingGroup } from "~/modules/accounting";
import type { ListItem } from "~/types";
import usePostingGroups from "./usePostingGroups";

type SalesPostingGroupsTableProps = {
  data: SalesPostingGroup[];
  count: number;
  partGroups: ListItem[];
  customerTypes: ListItem[];
  balanceSheetAccounts: AccountListItem[];
  incomeStatementAccounts: AccountListItem[];
};

const SalesPostingGroupsTable = ({
  data,
  count,
  partGroups,
  customerTypes,
  balanceSheetAccounts,
  incomeStatementAccounts,
}: SalesPostingGroupsTableProps) => {
  const { canEdit, onCellEdit } = usePostingGroups("postingGroupSales");

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

  const columns = useMemo<ColumnDef<SalesPostingGroup>[]>(() => {
    return [
      {
        id: "partGroup",
        header: "Part Group",
        cell: ({ row }) =>
          partGroups.find((group) => group.id === row.original.partGroupId)
            ?.name,
      },
      {
        id: "customerType",
        header: "Customer Type",
        cell: ({ row }) =>
          customerTypes.find((type) => type.id === row.original.customerTypeId)
            ?.name,
      },
      {
        accessorKey: "receivablesAccount",
        header: "Receivables",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "salesAccount",
        header: "Sales",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "salesDiscountAccount",
        header: "Sales Discount",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "salesCreditAccount",
        header: "Sales Credit",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "salesPrepaymentAccount",
        header: "Sales Prepayment",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "salesTaxPayableAccount",
        header: "Sales Tax Payable",
        cell: (item) => item.getValue(),
      },
    ];
  }, [customerTypes, partGroups]);

  const editableComponents = useMemo(
    () => ({
      receivablesAccount: EditableList(onCellEdit, balanceSheetAccountOptions),
      salesAccount: EditableList(onCellEdit, incomeStatementAccountOptions),
      salesDiscountAccount: EditableList(
        onCellEdit,
        incomeStatementAccountOptions
      ),
      salesCreditAccount: EditableList(onCellEdit, balanceSheetAccountOptions),
      salesPrepaymentAccount: EditableList(
        onCellEdit,
        balanceSheetAccountOptions
      ),
      salesTaxPayableAccount: EditableList(
        onCellEdit,
        balanceSheetAccountOptions
      ),
    }),
    [onCellEdit, balanceSheetAccountOptions, incomeStatementAccountOptions]
  );

  return (
    <Table<SalesPostingGroup>
      data={data}
      columns={columns}
      count={count}
      editableComponents={editableComponents}
      withInlineEditing={canEdit}
    />
  );
};

export default SalesPostingGroupsTable;
