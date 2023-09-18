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
  const { getInputProps, error } = useField(name);
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
      partFetcher.data?.data?.map((part) => ({
        value: part.id,
        label: `${part.id} - ${part.name}`,
      })) ?? [],
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

  return (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <Select
        {...getInputProps({
          // @ts-ignore
          id: name,
        })}
        {...props}
        options={options}
        value={controlledValue}
        isLoading={isLoading}
        placeholder={placeholder}
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
