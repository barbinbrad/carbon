import { Select, useMount } from "@carbon/react";
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { useFetcher } from "@remix-run/react";
import { useEffect, useMemo } from "react";
import { useControlField, useField } from "remix-validated-form";
import type { AccountClass, getAccountsList } from "~/modules/accounting";
import { path } from "~/utils/path";
import type { SelectProps } from "./Select";

type AccountSelectProps = Omit<SelectProps, "options"> & {
  classes: AccountClass[];
};

const Account = ({
  name,
  label = "Account",
  helperText,
  isLoading,
  isReadOnly,
  placeholder = "Select Account",
  classes,
  onChange,
  ...props
}: AccountSelectProps) => {
  const { error, defaultValue } = useField(name);
  const [value, setValue] = useControlField<string | undefined>(name);

  const accountFetcher =
    useFetcher<Awaited<ReturnType<typeof getAccountsList>>>();

  useMount(() => {
    let classQueryParamas = classes?.map((c) => `class=${c}`).join("&") ?? "";
    accountFetcher.load(
      `${path.to.api.accounts}?type=Posting&${classQueryParamas}`
    );
  });

  const options = useMemo(
    () =>
      accountFetcher.data?.data
        ? accountFetcher.data?.data.map((c) => ({
            value: c.number,
            label: `${c.number} - ${c.name}`,
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
