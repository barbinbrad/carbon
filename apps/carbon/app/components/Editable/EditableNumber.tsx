/* eslint-disable react/display-name */
import { NumberInput, NumberInputField } from "@chakra-ui/react";
import type { PostgrestResponse } from "@supabase/supabase-js";
import type { FocusEvent, KeyboardEvent } from "react";
import type { EditableTableCellComponentProps } from "../Table/types";

const EditableNumber =
  <T extends object>(
    mutation: (
      accessorKey: string,
      newValue: string,
      row: T
    ) => Promise<PostgrestResponse<unknown>>
  ) =>
  ({
    value,
    row,
    accessorKey,
    onError,
    onUpdate,
  }: EditableTableCellComponentProps<T>) => {
    const updateNumber = async (newValue: string) => {
      // this is the optimistic update on the FE
      onUpdate(newValue);

      // the is the actual update on the BE
      mutation(accessorKey, newValue, row)
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

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      // only run the update if they click enter
      if (event.key === "Enter" || event.key === "Tab") {
        if (event.currentTarget.value !== value) {
          updateNumber(event.currentTarget.value);
        }
      }
    };

    // run update if focus is lost
    const onBlur = (event: FocusEvent<HTMLInputElement>) => {
      if (event.currentTarget.value !== value) {
        updateNumber(event.currentTarget.value);
      }
    };

    // eslint-disable-next-line jsx-a11y/no-autofocus
    return (
      <NumberInput defaultValue={value as number} size="sm" w="full">
        <NumberInputField autoFocus onKeyDown={onKeyDown} onBlur={onBlur} />
      </NumberInput>
    );
  };

export default EditableNumber;
