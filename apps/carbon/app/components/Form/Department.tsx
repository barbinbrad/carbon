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
import type { getDepartmentsList } from "~/services/resources";
import { mapRowsToOptions } from "~/utils/form";
import type { SelectProps } from "./Select";

type DepartmentSelectProps = Omit<SelectProps, "options">;

const Department = ({
  name,
  label = "Department",
  helperText,
  isLoading,
  isReadOnly,
  placeholder,
  onChange,
  ...props
}: DepartmentSelectProps) => {
  const { getInputProps, error, defaultValue } = useField(name);

  const departmentFetcher =
    useFetcher<Awaited<ReturnType<typeof getDepartmentsList>>>();

  useEffect(() => {
    if (departmentFetcher.type === "init") {
      departmentFetcher.load("/api/resources/departments");
    }
  }, [departmentFetcher]);

  const options = useMemo(
    () =>
      mapRowsToOptions({
        data: departmentFetcher.data?.data,
        value: "id",
        label: "name",
      }),
    [departmentFetcher.data]
  );

  const initialValue = useMemo(
    () => options.filter((option) => option.value === defaultValue),
    [defaultValue, options]
  );

  // TODO: hack for default value
  return departmentFetcher.state !== "loading" ? (
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

Department.displayName = "Department";

export default Department;
