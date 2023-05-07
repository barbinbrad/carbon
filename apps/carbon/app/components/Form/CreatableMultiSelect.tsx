import { CreatableSelect } from "@carbon/react";
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";

import { useControlField, useField } from "remix-validated-form";

export type SelectProps = {
  name: string;
  label?: string;
  options: { value: string | number; label: string }[];
  helperText?: string;
  isReadOnly?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  onChange?: (
    newValue: { value: string | number; label: string }[] | null
  ) => void;
  onUsingCreatedChanged?: (usingCreated: boolean) => void;
};

const Select = ({
  name,
  label,
  options,
  helperText,
  isLoading,
  isReadOnly,
  placeholder,
  onChange,
  onUsingCreatedChanged,
  ...props
}: SelectProps) => {
  const { error } = useField(name);
  const [value, setValue] = useControlField<string[]>(name);

  const handleChange = (
    newValue: { value: string | number; label: string }[] | null
  ) => {
    setValue(newValue?.map((option) => option.value.toString()) ?? []);
    onChange?.(newValue);
    onUsingCreatedChanged?.(false);
  };

  const handleCreate = (inputValue: string) => {
    setValue([...value, inputValue]);
    onChange?.(
      value.map((value) => ({
        value,
        label: value,
      }))
    );
    onUsingCreatedChanged?.(true);
  };

  const optionsWithCreation = options
    .concat(
      value.map((value) => ({
        value,
        label: value,
      }))
    )
    .filter((v, i, a) => a.findIndex((v2) => v2.label === v.label) === i);

  const selectedValues =
    optionsWithCreation.filter((option) =>
      value.some((v) => option.value === v)
    ) ?? [];

  // TODO: hack for default value
  return (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      {value.map((v, index) => (
        <input
          key={`${name}[${index}]`}
          type="hidden"
          name={`${name}[${index}]`}
          value={v}
        />
      ))}
      <CreatableSelect
        {...props}
        value={selectedValues}
        isClearable
        isLoading={isLoading}
        isMulti
        options={options}
        placeholder={placeholder}
        w="full"
        onCreateOption={handleCreate}
        // @ts-ignore
        onChange={handleChange}
      />
      {error ? (
        <FormErrorMessage>{error}</FormErrorMessage>
      ) : (
        helperText && <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

Select.displayName = "Select";

export default Select;
