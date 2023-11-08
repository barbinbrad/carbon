import { Select } from "@carbon/react";
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { useFetcher } from "@remix-run/react";
import { useEffect, useMemo, useRef } from "react";
import { useControlField, useField } from "remix-validated-form";
import type {
  SupplierLocation as SupplierLocationType,
  getSupplierLocations,
} from "~/modules/purchasing";
import { path } from "~/utils/path";
import type { SelectProps } from "./Select";

type SupplierLocationSelectProps = Omit<SelectProps, "options" | "onChange"> & {
  supplier?: string;
  onChange?: (supplierLocation: SupplierLocationType | null) => void;
};

const SupplierLocation = ({
  name,
  label = "Supplier Location",
  supplier,
  helperText,
  isLoading,
  isReadOnly,
  placeholder = "Select Supplier Location",
  onChange,
  ...props
}: SupplierLocationSelectProps) => {
  const initialLoad = useRef(true);
  const { error, defaultValue } = useField(name);
  const [value, setValue] = useControlField<string | null>(name);

  const supplierLocationFetcher =
    useFetcher<Awaited<ReturnType<typeof getSupplierLocations>>>();

  useEffect(() => {
    if (supplier) {
      supplierLocationFetcher.load(path.to.api.supplierLocations(supplier));
    }
    if (initialLoad.current) {
      initialLoad.current = false;
    } else {
      setValue(null);
      if (onChange) {
        onChange(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplier]);

  const options = useMemo(
    () =>
      supplierLocationFetcher.data?.data
        ? supplierLocationFetcher.data?.data.map((c) => ({
            value: c.id,
            // @ts-ignore
            label: `${c.address?.addressLine1} ${c.address?.city}, ${c.address?.state}`,
          }))
        : [],
    [supplierLocationFetcher.data]
  );

  const handleChange = (
    selection: {
      value: string | number;
      label: string;
    } | null
  ) => {
    const newValue = (selection?.value as string) ?? null;
    setValue(newValue);
    if (onChange && typeof onChange === "function") {
      if (newValue === null) onChange(newValue);
      const contact = supplierLocationFetcher.data?.data?.find(
        (c) => c.id === newValue
      );

      onChange(contact);
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
      <input type="hidden" name={name} id={name} value={value ?? ""} />
      <Select
        {...props}
        value={controlledValue}
        isLoading={isLoading}
        options={options}
        placeholder={placeholder}
        isClearable
        // @ts-ignore
        onChange={handleChange}
        w="full"
      />
      {error ? (
        <FormErrorMessage>{error}</FormErrorMessage>
      ) : (
        helperText && <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

SupplierLocation.displayName = "SupplierLocation";

export default SupplierLocation;
