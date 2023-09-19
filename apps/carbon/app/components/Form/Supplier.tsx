import { Select } from "@carbon/react";
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { useControlField, useField } from "remix-validated-form";
import { useSuppliers } from "~/stores/data";
import type { SelectProps } from "./Select";

type SupplierSelectProps = Omit<SelectProps, "options">;

const Supplier = ({
  name,
  label = "Supplier",
  helperText,
  isLoading,
  isReadOnly,
  placeholder = "Select Supplier",
  onChange,
  ...props
}: SupplierSelectProps) => {
  const { getInputProps, error, defaultValue } = useField(name);
  const [value, setValue] = useControlField<string | undefined>(name);

  const [suppliers] = useSuppliers();

  const options = useMemo(
    () =>
      suppliers.map((c) => ({
        value: c.id,
        label: c.name,
      })) ?? [],
    [suppliers]
  );

  const handleChange = (selection: {
    value: string | number;
    label: string;
  }) => {
    const newValue = (selection.value as string) || undefined;
    setValue(newValue);
    if (onChange && typeof onChange === "function") {
      onChange(selection);
    }
  };

  const controlledValue = useMemo(
    // @ts-ignore
    () => options.find((option) => option.value === value),
    [value, options]
  );

  // so that we can call onChange on load
  useEffect(() => {
    if (controlledValue && controlledValue.value === defaultValue) {
      handleChange(controlledValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlledValue?.value]);

  return (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <Select
        {...getInputProps({
          // @ts-ignore
          id: name,
        })}
        {...props}
        value={controlledValue}
        isLoading={isLoading}
        options={options}
        placeholder={placeholder}
        // @ts-ignore
        w="full"
        isReadOnly={isReadOnly}
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

Supplier.displayName = "Supplier";

export default Supplier;
