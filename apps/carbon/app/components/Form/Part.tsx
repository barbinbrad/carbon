import { Select } from "@carbon/react";
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useControlField, useField } from "remix-validated-form";
import type { PartReplenishmentSystem } from "~/modules/parts";
import { useParts } from "~/stores/data";
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
  const [parts] = useParts();

  const options = useMemo(
    () =>
      parts
        .filter((part) => {
          if (partReplenishmentSystem === "Buy") {
            return part.replenishmentSystem === "Buy";
          } else if (partReplenishmentSystem === "Make") {
            return part.replenishmentSystem === "Make";
          } else {
            return true;
          }
        })
        .map((part) => ({
          value: part.id,
          label: `${part.id} - ${part.name}`,
        })) ?? [],
    [partReplenishmentSystem, parts]
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
