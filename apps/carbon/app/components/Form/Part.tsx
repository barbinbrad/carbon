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
import type { getPartsList, PartReplenishmentSystem } from "~/modules/parts";
import { mapRowsToOptions } from "~/utils/form";
import type { SelectProps } from "./Select";

type PartSelectProps = Omit<SelectProps, "options"> & {
  partReplenishmentSystem?: PartReplenishmentSystem;
};

const Part = ({
  name,
  label = "Part",
  partReplenishmentSystem,
  helperText,
  isLoading,
  isReadOnly,
  placeholder = "Select Part",
  onChange,
  ...props
}: PartSelectProps) => {
  const { getInputProps, error, defaultValue } = useField(name);
  const [value, setValue] = useControlField<string | undefined>(name);

  const partFetcher = useFetcher<Awaited<ReturnType<typeof getPartsList>>>();

  useEffect(() => {
    if (partFetcher.type === "init") {
      let url = "/api/parts/list?";
      if (partReplenishmentSystem) {
        url += `replenishmentSystem=${partReplenishmentSystem}`;
      }

      partFetcher.load(url);
    }
  }, [partFetcher, partReplenishmentSystem]);

  const options = useMemo(
    () =>
      mapRowsToOptions({
        data: partFetcher.data?.data,
        value: "id",
        label: (part) => `${part.id} - ${part.name}`,
      }),
    [partFetcher.data]
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
  );
};

Part.displayName = "Part";

export default Part;
