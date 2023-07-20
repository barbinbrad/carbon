import { Select } from "@carbon/react";
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useControlField, useField } from "remix-validated-form";

export type SelectControlledProps = {
  name: string;
  label?: string;
  options: { value: string | number; label: string }[];
  helperText?: string;
  isReadOnly?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  value: string | undefined;
  onChange: (newValue: string | number | undefined) => void;
};

const SelectControlled = ({
  name,
  label,
  options,
  helperText,
  isLoading,
  isReadOnly,
  placeholder,
  value,
  onChange,
  ...props
}: SelectControlledProps) => {
  const { getInputProps, error } = useField(name);
  const [controlValue, setControlValue] = useControlField(name);

  useEffect(() => {
    setControlValue(value);
  }, [setControlValue, value]);

  const handleChange = (
    selection: { value: string | number; label: string } | undefined
  ) => {
    setControlValue(selection?.value || undefined);
    if (onChange && typeof onChange === "function") {
      onChange(selection?.value);
    }
  };

  return (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      {options.length > 0 ? (
        <Select
          {...getInputProps({
            // @ts-ignore
            id: name,
          })}
          {...props}
          // @ts-ignore
          isReadOnly={isReadOnly}
          isLoading={isLoading}
          options={options}
          placeholder={placeholder}
          // @ts-ignore
          w="full"
          value={options.find((option) => option.value === controlValue)}
          onChange={handleChange}
        />
      ) : (
        <Select
          isLoading={isLoading}
          options={[]}
          // @ts-ignore
          w="full"
        />
      )}

      {error ? (
        <FormErrorMessage>{error}</FormErrorMessage>
      ) : (
        helperText && <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

SelectControlled.displayName = "SelectControlled";

export default SelectControlled;
