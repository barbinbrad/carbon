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
import type { getAbilitiesList } from "~/services/resources";
import { mapRowsToOptions } from "~/utils/form";
import type { SelectProps } from "./Select";

type AbilitySelectProps = Omit<SelectProps, "options">;

const Ability = ({
  name,
  label = "Ability",
  helperText,
  isLoading,
  isReadOnly,
  placeholder,
  onChange,
  ...props
}: AbilitySelectProps) => {
  const { getInputProps, error, defaultValue } = useField(name);

  const abilityFetcher =
    useFetcher<Awaited<ReturnType<typeof getAbilitiesList>>>();

  useEffect(() => {
    if (abilityFetcher.type === "init") {
      abilityFetcher.load("/api/resources/abilities");
    }
  }, [abilityFetcher]);

  const options = useMemo(
    () =>
      mapRowsToOptions({
        data: abilityFetcher.data?.data,
        value: "id",
        label: "name",
      }),
    [abilityFetcher.data]
  );

  const initialValue = useMemo(
    () => options.filter((option) => option.value === defaultValue),
    [defaultValue, options]
  );

  // TODO: hack for default value
  return abilityFetcher.state !== "loading" ? (
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
      <Select isDisabled isLoading options={[]} />
    </Box>
  );
};

Ability.displayName = "Ability";

export default Ability;
