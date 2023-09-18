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
import type {
  AccountCategory as AccountCategoryType,
  getAccountCategoriesList,
} from "~/modules/accounting";
import type { SelectProps } from "./Select";

type AccountCategorySelectProps = Omit<SelectProps, "options" | "onChange"> & {
  onChange?: (accountCategory: AccountCategoryType | undefined) => void;
};

const AccountCategory = ({
  name,
  label = "Account Category",
  helperText,
  isLoading,
  isReadOnly,
  placeholder = "Select Account Category",
  onChange,
  ...props
}: AccountCategorySelectProps) => {
  const { getInputProps, error, defaultValue } = useField(name);
  const [value, setValue] = useControlField<string | undefined>(name);

  const accountCategoryFetcher =
    useFetcher<Awaited<ReturnType<typeof getAccountCategoriesList>>>();

  useEffect(() => {
    accountCategoryFetcher.load("/api/accounting/categories");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = useMemo(() => {
    return accountCategoryFetcher.data?.data?.map(
      (c) =>
        ({
          value: c.id,
          label: c.category,
        } ?? [])
    );
  }, [accountCategoryFetcher.data]);

  const handleChange = (selection: {
    value: string | number;
    label: string;
  }) => {
    const newValue = (selection.value as string) || undefined;
    setValue(newValue);

    if (onChange && typeof onChange === "function") {
      const categories = accountCategoryFetcher.data?.data;
      if (!categories) {
        onChange(undefined);
        return;
      }

      const category = categories.find(
        (category) => category.id === selection.value
      );

      onChange(category as AccountCategoryType | undefined);
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
        isClearable
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

AccountCategory.displayName = "AccountCategory";

export default AccountCategory;
