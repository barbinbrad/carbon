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
import type { getCustomersList } from "~/modules/sales";
import { mapRowsToOptions } from "~/utils/form";
import type { SelectProps } from "./Select";

type CustomerSelectProps = Omit<SelectProps, "options">;

const Customer = ({
  name,
  label = "Customer",
  helperText,
  isLoading,
  isReadOnly,
  placeholder = "Select Customer",
  onChange,
  ...props
}: CustomerSelectProps) => {
  const { getInputProps, error, defaultValue } = useField(name);
  const [value, setValue] = useControlField<string | undefined>(name);

  const customerFetcher =
    useFetcher<Awaited<ReturnType<typeof getCustomersList>>>();

  useEffect(() => {
    if (customerFetcher.type === "init") {
      customerFetcher.load("/api/sales/customers");
    }
  }, [customerFetcher]);

  const options = useMemo(
    () =>
      mapRowsToOptions({
        data: customerFetcher.data?.data,
        value: "id",
        label: "name",
      }),
    [customerFetcher.data]
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
  return customerFetcher.state !== "loading" ? (
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

Customer.displayName = "Customer";

export default Customer;
