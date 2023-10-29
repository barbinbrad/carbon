import { CreatableSelect } from "@carbon/react";
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { useControlField, useField } from "remix-validated-form";

import type { SelectProps } from "./Select";

export type CreatableSelectProps = Omit<SelectProps, "onChange"> & {
  onChange?: (
    newValue: { value: string | number; label: string } | null
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
}: CreatableSelectProps) => {
  const { getInputProps, error } = useField(name);
  const [value, setValue] = useControlField<string>(name);

  const handleChange = (
    newValue: { value: string | number; label: string } | null
  ) => {
    setValue(newValue?.value.toString() ?? "");
    onChange?.(newValue);
    onUsingCreatedChanged?.(false);
  };

  const onCreateOption = (inputValue: string) => {
    setValue(inputValue);
    onChange?.({ value: inputValue, label: inputValue });
    onUsingCreatedChanged?.(true);
  };

  const optionsWithCreation = options.find((option) => option.value === value)
    ? options
    : options.concat({ value, label: value });

  const selectedValue = optionsWithCreation.find(
    (option) => option.value === value
  );

  return (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <CreatableSelect
        {...getInputProps({
          // @ts-ignore
          id: name,
        })}
        {...props}
        value={selectedValue}
        isClearable
        isLoading={isLoading}
        options={options}
        placeholder={placeholder}
        w="full"
        onCreateOption={onCreateOption}
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
