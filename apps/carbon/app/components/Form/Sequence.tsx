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
import type { getSequencesList } from "~/modules/settings";
import { path } from "~/utils/path";
import type { SelectProps } from "./Select";

type SequenceSelectProps = Omit<SelectProps, "options"> & {
  table: string;
};

const Sequence = ({
  name,
  label = "Sequence",
  table,
  helperText,
  isLoading,
  isReadOnly,
  placeholder = "Select Sequence",
  onChange,
  ...props
}: SequenceSelectProps) => {
  const { error, defaultValue } = useField(name);
  const [value, setValue] = useControlField<string | undefined>(name);

  const sequenceFetcher =
    useFetcher<Awaited<ReturnType<typeof getSequencesList>>>();

  useMount(() => {
    sequenceFetcher.load(path.to.api.sequences(table));
  });

  const options = useMemo(
    () =>
      sequenceFetcher.data?.data
        ? sequenceFetcher.data?.data.map((c) => ({
            value: c.id,
            label: c.id,
          }))
        : [],
    [sequenceFetcher.data]
  );

  console.log(sequenceFetcher.data?.data);

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
    () =>
      options.find((option) => option.value === value) ?? options?.[0] ?? null,
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

Sequence.displayName = "Sequence";

export default Sequence;
