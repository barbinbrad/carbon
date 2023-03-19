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
import type { getLocationsList } from "~/modules/resources";
import { mapRowsToOptions } from "~/utils/form";
import type { SelectProps } from "./Select";

type LocationSelectProps = Omit<SelectProps, "options">;

const Location = ({
  name,
  label = "Location",
  helperText,
  isLoading,
  isReadOnly,
  placeholder,
  onChange,
  ...props
}: LocationSelectProps) => {
  const { getInputProps, error, defaultValue } = useField(name);

  const locationFetcher =
    useFetcher<Awaited<ReturnType<typeof getLocationsList>>>();

  useEffect(() => {
    if (locationFetcher.type === "init") {
      locationFetcher.load("/api/resources/locations");
    }
  }, [locationFetcher]);

  const options = useMemo(
    () =>
      mapRowsToOptions({
        data: locationFetcher.data?.data,
        value: "id",
        label: "name",
      }),
    [locationFetcher.data]
  );

  const initialValue = useMemo(
    () => options.filter((option) => option.value === defaultValue),
    [defaultValue, options]
  );

  // TODO: hack for default value
  return locationFetcher.state !== "loading" ? (
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

Location.displayName = "Location";

export default Location;
