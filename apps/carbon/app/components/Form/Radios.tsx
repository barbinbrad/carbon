import type { StackDirection } from "@chakra-ui/react";
import { FormErrorMessage } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { useField } from "remix-validated-form";

type RadiosProps = {
  name: string;
  label?: string;
  options: { label: string; value: string }[];
  direction?: StackDirection;
};

const Radios = ({
  name,
  label,
  options,
  direction = "column",
}: RadiosProps) => {
  const { getInputProps, error } = useField(name);

  return (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <RadioGroup
        {...getInputProps({
          // @ts-ignore
          id: name,
        })}
        name={name}
      >
        <Stack spacing={2} alignItems="start" direction={direction}>
          {options.map(({ label, value }) => (
            <Radio key={value} value={value}>
              {label}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default Radios;
