import { CreatableSelect } from "@carbon/react";
import {
  Box,
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
}: SelectProps) => {
  const { getInputProps, error } = useField(name);
  const [value, setValue] = useControlField<string>(name);

  const handleChange = (
    newValue: { value: string | number; label: string } | null
  ) => {
    setValue(newValue?.value.toString() ?? "");
    onChange?.(newValue);
    onUsingCreatedChanged?.(false);
  };

  const handleCreate = (inputValue: string) => {
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

  // TODO: hack for default value
  return optionsWithCreation.length > 0 ? (
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
        // @ts-ignore
        w="full"
        onCreateOption={handleCreate}
        onChange={handleChange}
      />
      {error ? (
        <FormErrorMessage>{error}</FormErrorMessage>
      ) : (
        helperText && <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  ) : (
    <Box>
      {label && <FormLabel>{label}</FormLabel>}
      <CreatableSelect
        isDisabled
        isLoading={isLoading}
        options={[]}
        // @ts-ignore
        w="full"
      />
    </Box>
  );
};

Select.displayName = "Select";

export default Select;
