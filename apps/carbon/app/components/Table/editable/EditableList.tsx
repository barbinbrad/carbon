/* eslint-disable react/display-name */
import { Select } from "@carbon/react";
import type { EditableTableCellComponentProps } from "../types";

const EditableList =
  <T extends object>(
    mutation: (
      accessorKey: string,
      newValue: string | undefined,
      row: T
    ) => void,
    options: { label: string; value: string | number }[]
  ) =>
  ({
    value,
    row,
    accessorKey,
    onUpdate,
  }: EditableTableCellComponentProps<T>) => {
    const updateSelection = (newValue: string | null) => {
      if (newValue === value || (newValue === null && value === undefined))
        return;
      // this is the optimistic update on the FE
      onUpdate(newValue);
      // the is the actual update on the BE
      mutation(accessorKey, newValue ?? undefined, row);
    };

    return (
      <Select
        autoFocus
        bordered={false}
        defaultOpen
        defaultValue={value as string}
        // @ts-ignore
        options={options}
        optionFilterProp="label"
        showSearch
        style={{ margin: "0 -0.75rem", minWidth: 100 }}
        onChange={updateSelection}
      />
    );
  };

export default EditableList;
