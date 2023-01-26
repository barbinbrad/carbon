import { Select } from "@carbon/react";
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { useFetcher } from "@remix-run/react";
import { useEffect, useMemo, useRef } from "react";
import { useControlField, useField } from "remix-validated-form";
import type { SupplierContact as SupplierContactType } from "~/interfaces/Purchasing/types";
import type { getSupplierContacts } from "~/services/purchasing";
import type { SelectProps } from "./Select";

type SupplierContactSelectProps = Omit<SelectProps, "options" | "onChange"> & {
  supplier?: string;
  onChange?: (supplierContact: SupplierContactType | undefined) => void;
};

const SupplierContact = ({
  name,
  label = "SupplierContact",
  supplier,
  helperText,
  isLoading,
  isReadOnly,
  placeholder = "Select Supplier Contact",
  onChange,
  ...props
}: SupplierContactSelectProps) => {
  const initialLoad = useRef(true);
  const { error, defaultValue } = useField(name);
  const [value, setValue] = useControlField<string | undefined>(name);

  const supplierContactFetcher =
    useFetcher<Awaited<ReturnType<typeof getSupplierContacts>>>();

  useEffect(() => {
    supplierContactFetcher.load(
      `/resource/purchasing/supplier-contacts?supplierId=${supplier}`
    );
    if (initialLoad.current) {
      initialLoad.current = false;
    } else {
      setValue(undefined);
      if (onChange) {
        onChange(undefined);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplier]);

  const options = useMemo(
    () =>
      supplierContactFetcher.data?.data
        ? supplierContactFetcher.data?.data.map((c) => ({
            value: c.id,
            // @ts-ignore
            label: `${c.contact?.firstName} ${c.contact?.lastName}`,
          }))
        : [],
    [supplierContactFetcher.data]
  );

  const handleChange = (selection: {
    value: string | number;
    label: string;
  }) => {
    const newValue = (selection.value as string) || undefined;
    setValue(newValue);
    if (onChange && typeof onChange === "function") {
      if (newValue === undefined) onChange(newValue);
      const contact = supplierContactFetcher.data?.data?.find(
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

  // TODO: hack for default value
  return supplierContactFetcher.state !== "loading" ? (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <input type="hidden" name={name} id={name} value={value} />
      <Select
        {...props}
        value={controlledValue}
        isLoading={isLoading}
        options={options}
        placeholder={placeholder}
        // @ts-ignore
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
        //@ts-ignore
      />
    </Box>
  );
};

SupplierContact.displayName = "SupplierContact";

export default SupplierContact;
