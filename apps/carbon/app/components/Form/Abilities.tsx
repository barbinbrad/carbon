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
import type { getAbilitiesList } from "~/modules/resources";
import type { SelectProps } from "./Select";

type AbilitiesSelectProps = Omit<SelectProps, "options" | "onChange"> & {
  ability?: string;
  onChange?: (
    selections: {
      value: string;
      label: string;
    }[]
  ) => void;
};

const Abilities = ({
  name,
  label = "Abilities",
  ability,
  helperText,
  isLoading,
  isReadOnly,
  placeholder = "Select Abilities",
  onChange,
  ...props
}: AbilitiesSelectProps) => {
  const { error } = useField(name);
  const [value, setValue] = useControlField<string[]>(name);

  const abilityFetcher =
    useFetcher<Awaited<ReturnType<typeof getAbilitiesList>>>();

  useEffect(() => {
    abilityFetcher.load(`/api/resources/abilities`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = useMemo(
    () =>
      abilityFetcher.data?.data
        ? abilityFetcher.data?.data.map((c) => ({
            value: c.id,
            label: c.name,
          }))
        : [],
    [abilityFetcher.data]
  );

  const handleChange = (
    selections: {
      value: string;
      label: string;
    }[]
  ) => {
    const newValue = selections.map((s) => s.value as string) || [];
    setValue(newValue);
    if (onChange && typeof onChange === "function") {
      onChange(selections);
    }
  };

  const controlledValue = useMemo(
    // @ts-ignore
    () => options?.filter((option) => value?.includes(option.value)) ?? [],
    [value, options]
  );

  return (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      {value.map((selection, index) => (
        <input
          key={`${name}[${index}]`}
          type="hidden"
          name={`${name}[${index}]`}
          value={selection}
        />
      ))}
      <Select
        {...props}
        isMulti
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

Abilities.displayName = "Abilities";

export default Abilities;
