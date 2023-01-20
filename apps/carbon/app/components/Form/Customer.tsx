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
import type { getCustomersList } from "~/services/sales";
import { mapRowsToOptions } from "~/utils/form";
import type { SelectProps } from "./Select";

type CustomerSelectProps = Omit<SelectProps, "options">;

const Customer = ({
  name,
  label = "Customer",
  helperText,
  isLoading,
  isReadOnly,
  placeholder,
  onChange,
  ...props
}: CustomerSelectProps) => {
  const { getInputProps, error, defaultValue } = useField(name);

  const customerFetcher =
    useFetcher<Awaited<ReturnType<typeof getCustomersList>>>();

  useEffect(() => {
    customerFetcher.load("/resource/sales/customers");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = useMemo(
    () =>
      mapRowsToOptions({
        data: customerFetcher.data?.data,
        value: "id",
        label: "name",
      }),
    [customerFetcher.data]
  );

  const initialValue = useMemo(
    () => options.filter((option) => option.value === defaultValue),
    [defaultValue, options]
  );

  // TODO: hack for default value
  return options.length > 0 ? (
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
      <Select isDisabled isLoading={isLoading} options={[]} />
    </Box>
  );
};

Customer.displayName = "Customer";

export default Customer;
