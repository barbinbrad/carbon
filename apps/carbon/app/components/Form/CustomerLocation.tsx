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
  CustomerLocation as CustomerLocationType,
  getCustomerLocations,
} from "~/modules/sales";
import { path } from "~/utils/path";
import type { SelectProps } from "./Select";

type CustomerLocationSelectProps = Omit<SelectProps, "options" | "onChange"> & {
  customer?: string;
  onChange?: (customerLocation: CustomerLocationType | undefined) => void;
};

const CustomerLocation = ({
  name,
  label = "Customer Location",
  customer,
  helperText,
  isLoading,
  isReadOnly,
  placeholder = "Select Customer Location",
  onChange,
  ...props
}: CustomerLocationSelectProps) => {
  const initialLoad = useRef(true);
  const { error, defaultValue } = useField(name);
  const [value, setValue] = useControlField<string | undefined>(name);

  const customerLocationFetcher =
    useFetcher<Awaited<ReturnType<typeof getCustomerLocations>>>();

  useEffect(() => {
    if (customer) {
      customerLocationFetcher.load(path.to.api.customerLocations(customer));
    }
    if (initialLoad.current) {
      initialLoad.current = false;
    } else {
      setValue(undefined);
      if (onChange) {
        onChange(undefined);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

  const options = useMemo(
    () =>
      customerLocationFetcher.data?.data
        ? customerLocationFetcher.data?.data.map((c) => ({
            value: c.id,
            // @ts-ignore
            label: `${c.address?.addressLine1} ${c.address?.city}, ${c.address?.state}`,
          }))
        : [],
    [customerLocationFetcher.data]
  );

  const handleChange = (selection: {
    value: string | number;
    label: string;
  }) => {
    const newValue = (selection.value as string) || undefined;
    setValue(newValue);
    if (onChange && typeof onChange === "function") {
      if (newValue === undefined) onChange(newValue);
      const contact = customerLocationFetcher.data?.data?.find(
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
      <input type="hidden" name={name} id={name} value={value} />
      <Select
        {...props}
        value={controlledValue}
        isLoading={isLoading}
        options={options}
        placeholder={placeholder}
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

CustomerLocation.displayName = "CustomerLocation";

export default CustomerLocation;
