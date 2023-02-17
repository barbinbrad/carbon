import type { NumberInputProps } from "@chakra-ui/react";
import { FormHelperText } from "@chakra-ui/react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { forwardRef } from "react";
import { useField } from "remix-validated-form";

type FormNumberProps = NumberInputProps & {
  name: string;
  label?: string;
  isRequired?: boolean;
  helperText?: string;
};

const Number = forwardRef<HTMLInputElement, FormNumberProps>(
  ({ name, label, isRequired, helperText, ...rest }, ref) => {
    const { getInputProps, error } = useField(name);

    return (
      <FormControl isInvalid={!!error} isRequired={isRequired}>
        {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
        <NumberInput
          {...getInputProps({
            id: name,
            ...rest,
          })}
        >
          <NumberInputField ref={ref} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  }
);

Number.displayName = "Number";

export default Number;
