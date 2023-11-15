/* eslint-disable react/display-name */
import type { Database } from "@carbon/database";
import { Select } from "@carbon/react";
import type {
  PostgrestSingleResponse,
  SupabaseClient,
} from "@supabase/supabase-js";
import type { EditableTableCellComponentProps } from "~/components/Editable";
import type { PurchaseInvoiceLine } from "~/modules/invoicing";

const EditablePurchaseInvoiceLineNumber =
  (
    mutation: (
      accessorKey: string,
      newValue: string,
      row: PurchaseInvoiceLine
    ) => Promise<PostgrestSingleResponse<unknown>>,
    options: {
      client?: SupabaseClient<Database>;
      parts: { label: string; value: string }[];
      accounts: { label: string; value: string }[];
      defaultLocationId: string | null;
      userId: string;
    }
  ) =>
  ({
    value,
    row,
    accessorKey,
    onError,
    onUpdate,
  }: EditableTableCellComponentProps<PurchaseInvoiceLine>) => {
    const { client, parts, accounts, userId } = options;
    const selectOptions =
      row.invoiceLineType === "Part"
        ? parts
        : row.invoiceLineType === "G/L Account"
        ? accounts
        : [];

    const onAccountChange = async ({
      value,
      label,
    }: {
      value: string;
      label: string;
    }) => {
      if (!client) throw new Error("Supabase client not found");

      const account = await client
        .from("account")
        .select("name")
        .eq("number", value)
        .single();

      onUpdate("description", account.data?.name ?? "");
      onUpdate("partId", null);
      onUpdate("assetId", null);
      onUpdate("accountNumber", value);
      onUpdate("unitOfMeasureCode", null);
      onUpdate("shelfId", null);

      try {
        const { error } = await client
          .from("purchaseInvoiceLine")
          .update({
            partId: null,
            assetId: null,
            accountNumber: value,
            description: account.data?.name ?? "",
            unitOfMeasureCode: null,
            shelfId: null,
            updatedBy: userId,
          })
          .eq("id", row.id);

        if (error) onError();
      } catch (error) {
        console.error(error);
        onError();
      }
    };

    const onPartChange = async ({
      value: partId,
    }: {
      value: string;
      label: string;
    }) => {
      if (!client) throw new Error("Supabase client not found");
      const [part, shelf, cost] = await Promise.all([
        client
          .from("part")
          .select("name, unitOfMeasureCode")
          .eq("id", partId)
          .single(),
        client
          .from("partInventory")
          .select("defaultShelfId")
          .eq("partId", partId)
          .eq("locationId", options.defaultLocationId!)
          .single(),
        client
          .from("partCost")
          .select("unitCost")
          .eq("partId", partId)
          .single(),
      ]);

      if (part.error) {
        onError();
        return;
      }

      onUpdate("partId", partId);
      onUpdate("description", part.data?.name);
      onUpdate("assetId", null);
      onUpdate("accountNumber", null);
      onUpdate("unitOfMeasureCode", part.data?.unitOfMeasureCode ?? null);
      onUpdate("locationId", options.defaultLocationId);
      onUpdate("shelfId", shelf.data?.defaultShelfId ?? null);
      onUpdate("unitPrice", cost.data?.unitCost ?? null);

      try {
        const { error } = await client
          .from("purchaseInvoiceLine")
          .update({
            partId: partId,
            assetId: null,
            accountNumber: null,
            description: part.data?.name,
            unitOfMeasureCode: part.data?.unitOfMeasureCode ?? null,
            locationId: options.defaultLocationId,
            shelfId: shelf.data?.defaultShelfId ?? null,
            unitPrice: cost.data?.unitCost,
            updatedBy: userId,
          })
          .eq("id", row.id);

        if (error) onError();
      } catch (error) {
        console.error(error);
        onError();
      }
    };

    const onChange = (newValue: { value: string; label: string } | null) => {
      if (!newValue) return;

      if (row.invoiceLineType === "Part") {
        onPartChange(newValue);
      } else if (row.invoiceLineType === "G/L Account") {
        onAccountChange(newValue);
      }
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
        borderRadius="none"
        size="sm"
      />
    );
  };

EditablePurchaseInvoiceLineNumber.displayName =
  "EditablePurchaseInvoiceLineNumber";
export default EditablePurchaseInvoiceLineNumber;
