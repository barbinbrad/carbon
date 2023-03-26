import { Select } from "@carbon/react";
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { useFetcher } from "@remix-run/react";
import { useEffect, useMemo } from "react";
import { useControlField, useField } from "remix-validated-form";
import type { getSuppliersList } from "~/modules/purchasing";
import { mapRowsToOptions } from "~/utils/form";
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

  const supplierFetcher =
    useFetcher<Awaited<ReturnType<typeof getSuppliersList>>>();

  useEffect(() => {
    if (supplierFetcher.type === "init") {
      supplierFetcher.load("/api/purchasing/suppliers");
    }
  }, [supplierFetcher]);

  const options = useMemo(
    () =>
      mapRowsToOptions({
        data: supplierFetcher.data?.data,
        value: "id",
        label: "name",
      }),
    [supplierFetcher.data]
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

  // TODO: hack for default value
  return supplierFetcher.state !== "loading" ? (
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
  ) : (
    <Box>
      {label && <FormLabel>{label}</FormLabel>}
      <Select
        isDisabled
        isLoading={isLoading}
        options={[]}
        // @ts-ignore
        w="full"
      />
    </Box>
  );
};

Supplier.displayName = "Supplier";

export default Supplier;
