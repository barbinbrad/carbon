/* eslint-disable react/display-name */
import { Input } from "@chakra-ui/react";
import type { EditableTableCellComponentProps } from "../types";

const EditableText =
  <T extends object>(
    mutation: (accessorKey: string, newValue: string, row: T) => void
  ) =>
  ({
    value,
    row,
    accessorKey,
    onUpdate,
  }: EditableTableCellComponentProps<T>) => {
    const updateText = async (newValue: string) => {
      // this is the optimistic update on the FE
      onUpdate(newValue);
      // the is the actual update on the BE
      mutation(accessorKey, newValue, row);
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      // only run the update if they click enter
      if (event.key === "Enter" || event.key === "Tab") {
        if (event.currentTarget.value !== value) {
          updateText(event.currentTarget.value);
        }
      }
    };

    // eslint-disable-next-line jsx-a11y/no-autofocus
    return (
      <Input
        border="none"
        autoFocus
        defaultValue={value as string}
        style={{ margin: "0 -0.75rem" }}
        onKeyDown={onKeyDown}
      />
    );
  };

export default EditableText;
