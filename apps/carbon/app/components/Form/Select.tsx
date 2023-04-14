import { Select as CarbonSelect } from "@carbon/react";
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useField } from "remix-validated-form";

export type SelectProps = {
  name: string;
  label?: string;
  options: { value: string | number; label: string }[];
  helperText?: string;
  isReadOnly?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  onChange?: (newValue: { value: string | number; label: string }) => void;
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
  ...props
}: SelectProps) => {
  const { getInputProps, error, defaultValue } = useField(name);
  const initialValue = useMemo(
    () => options.find((option) => option.value === defaultValue),
    [defaultValue, options]
  );

  // TODO: hack for default value
  return options.length > 0 ? (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <CarbonSelect
        {...getInputProps({
          // @ts-ignore
          id: name,
        })}
        {...props}
        defaultValue={initialValue}
        isReadOnly={isReadOnly}
        isLoading={isLoading}
        options={options}
        placeholder={placeholder}
        // @ts-ignore
        onChange={onChange ?? undefined}
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
      <CarbonSelect isDisabled isLoading={isLoading} options={[]} />
    </Box>
  );
};

Select.displayName = "Select";

export default Select;
