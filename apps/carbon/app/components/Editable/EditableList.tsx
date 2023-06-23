/* eslint-disable react/display-name */
import { Select } from "@carbon/react";
import type { PostgrestResponse } from "@supabase/supabase-js";
import type { EditableTableCellComponentProps } from "../Table/types";

const EditableList =
  <T extends object>(
    mutation: (
      accessorKey: string,
      newValue: string,
      row: T
    ) => Promise<PostgrestResponse<unknown>>,
    options: { label: string; value: string }[]
  ) =>
  ({
    value,
    row,
    accessorKey,
    onError,
    onUpdate,
  }: EditableTableCellComponentProps<T>) => {
    const onChange = async ({ value }: { value: string; label: string }) => {
      // this is the optimistic update on the FE
      onUpdate(value);

      // the is the actual update on the BE
      mutation(accessorKey, value, row)
        .then(({ error }) => {
          if (error) {
            onError();
            onUpdate(value, false);
          }
        })
        .catch(() => {
          onError();
          onUpdate(value, false);
        });
    };

    return (
      <Select
        autoFocus
        options={options}
        // @ts-ignore
        onChange={onChange}
        size="sm"
      />
    );
  };

export default EditableList;
