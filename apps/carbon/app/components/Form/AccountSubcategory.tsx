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
  AccountSubcategory as AccountSubcategoryType,
  getAccountSubcategoriesByCategory,
} from "~/modules/accounting";

const AccountSubcategory = ({
  name,
  label = "Account Subcategory",
  accountCategoryId,
  helperText,
  isReadOnly = false,
  placeholder = "Select Account Subcategory",
  onChange,
}: {
  name: string;
  label?: string;
  accountCategoryId?: string;
  placeholder?: string;
  helperText?: string;
  isReadOnly?: boolean;
  onChange?: (newValue?: AccountSubcategoryType) => void;
}) => {
  const { error, getInputProps, defaultValue } = useField(name);

  const [accountSubcategory, setAccountSubcategory] = useControlField<{
    value: string | number;
    label: string;
  } | null>(name);

  const accountSubcategoriesFetcher =
    useFetcher<Awaited<ReturnType<typeof getAccountSubcategoriesByCategory>>>();

  useEffect(() => {
    if (accountCategoryId) {
      accountSubcategoriesFetcher.load(
        `/api/accounting/subcategories?accountCategoryId=${accountCategoryId}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountCategoryId]);

  const accountSubcategories = useMemo(
    () =>
      accountSubcategoriesFetcher.data?.data?.map((c) => ({
        value: c.id,
        label: c.name,
      })) ?? [],

    [accountSubcategoriesFetcher.data]
  );

  useEffect(() => {
    // if the initial value is in the options, set it, otherwise set to null
    if (accountSubcategories) {
      setAccountSubcategory(
        accountSubcategories.find((s) => s.value === defaultValue) ?? null
      );

      if (onChange) {
        const subcategory = accountSubcategoriesFetcher.data?.data?.find(
          (c) => c.id === defaultValue
        );

        onChange(subcategory);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountSubcategories, defaultValue]);

  const handleChange = (newValue?: { label: string; value: string }) => {
    setAccountSubcategory(newValue ?? null);
    if (onChange) {
      const subcategory = accountSubcategoriesFetcher.data?.data?.find(
        (c) => c.id === newValue?.value
      );

      onChange(subcategory);
    }
  };

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Select
        {...getInputProps({
          // @ts-ignore
          id: name,
        })}
        placeholder={placeholder}
        options={accountSubcategories}
        value={accountSubcategory}
        onChange={handleChange}
        // @ts-ignore
        isReadOnly={isReadOnly}
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

export default AccountSubcategory;
