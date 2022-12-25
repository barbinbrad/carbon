import { Select as CarbonSelect } from "@carbon/react";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import { useMemo } from "react";
import { useField } from "remix-validated-form";

type SelectProps = {
  name: string;
  label: string;
  isLoading?: boolean;
  options: { value: string | number; label: string }[];
  placeholder?: string;
};

const Select = ({
  name,
  label,
  isLoading,
  options,
  placeholder,
}: SelectProps) => {
  const { getInputProps, error, defaultValue } = useField(name);
  const initialValue = useMemo(
    () => options.filter((option) => option.value === defaultValue),
    [defaultValue, options]
  );

  // hack for default value
  return options.length > 0 ? (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <CarbonSelect
        {...getInputProps({
          // @ts-ignore
          id: name,
        })}
        defaultValue={initialValue}
        isLoading={isLoading}
        options={options}
        placeholder={placeholder}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  ) : null;
};

Select.displayName = "Select";

export default Select;
