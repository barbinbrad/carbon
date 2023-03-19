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
import { useField } from "remix-validated-form";
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

  const initialValue = useMemo(
    () => options.filter((option) => option.value === defaultValue),
    [defaultValue, options]
  );

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
        defaultValue={initialValue}
        isReadOnly={isReadOnly}
        isLoading={isLoading}
        options={options}
        placeholder={placeholder}
        w="full"
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
