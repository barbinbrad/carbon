import { Select } from "@carbon/react";
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { useFetcher } from "@remix-run/react";
import { useEffect, useMemo } from "react";
import { useControlField, useField } from "remix-validated-form";
import type { getAccountsList } from "~/modules/accounting";
import type { SelectProps } from "./Select";

type AccountSelectProps = Omit<SelectProps, "options"> & {
  account?: string;
};

const Account = ({
  name,
  label = "Account",
  account,
  helperText,
  isLoading,
  isReadOnly,
  placeholder = "Select Account",
  onChange,
  ...props
}: AccountSelectProps) => {
  const { error, defaultValue } = useField(name);
  const [value, setValue] = useControlField<string | undefined>(name);

  const accountFetcher =
    useFetcher<Awaited<ReturnType<typeof getAccountsList>>>();

  useEffect(() => {
    accountFetcher.load(`/api/accounting/accounts`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = useMemo(
    () =>
      accountFetcher.data?.data
        ? accountFetcher.data?.data.map((c) => ({
            value: c.number,
            label: c.name,
          }))
        : [],
    [accountFetcher.data]
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
  );
};

Account.displayName = "Account";

export default Account;
