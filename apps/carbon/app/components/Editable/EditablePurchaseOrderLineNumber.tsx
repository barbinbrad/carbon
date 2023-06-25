/* eslint-disable react/display-name */
import type { Database } from "@carbon/database";
import { Select } from "@carbon/react";
import type { PostgrestResponse, SupabaseClient } from "@supabase/supabase-js";
import type { PurchaseOrderLine } from "~/modules/purchasing";
import type { EditableTableCellComponentProps } from "~/components/Editable";

const EditablePurchaseOrderLineNumber =
  (
    mutation: (
      accessorKey: string,
      newValue: string,
      row: PurchaseOrderLine
    ) => Promise<PostgrestResponse<unknown>>,
    options: {
      client: SupabaseClient<Database>;
      parts: { label: string; value: string }[];
      accounts: { label: string; value: string }[];
    }
  ) =>
  ({
    value,
    row,
    accessorKey,
    onError,
    onUpdate,
  }: EditableTableCellComponentProps<PurchaseOrderLine>) => {
    const selectOptions =
      row.purchaseOrderLineType === "Part"
        ? options.parts
        : row.purchaseOrderLineType === "G/L Account"
        ? options.accounts
        : [];

    const columnId =
      row.purchaseOrderLineType === "Part"
        ? "partId"
        : row.purchaseOrderLineType === "G/L Account"
        ? "accountNumber"
        : "";

    const onChange = (newValue: { value: string; label: string } | null) => {
      if (!newValue) return;
      const { value } = newValue;

      // this is the optimistic update on the FE
      onUpdate(value, accessorKey);

      // the is the actual update on the BE
      mutation(columnId, value, row)
        .then(({ error }) => {
          if (error) {
            onError();
            onUpdate(value, accessorKey, false);
          }
        })
        .catch(() => {
          onError();
          onUpdate(value, accessorKey, false);
        });
    };

    const controlledValue = selectOptions.find(
      (option) => option.value === value
    );

    return (
      <Select
        autoFocus
        value={controlledValue}
        options={selectOptions}
        onChange={onChange}
        // @ts-ignore
        size="sm"
      />
    );
  };

export default EditablePurchaseOrderLineNumber;
