import type { InputProps } from "@chakra-ui/react";
import { FormHelperText } from "@chakra-ui/react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
} from "@chakra-ui/react";
import { forwardRef } from "react";
import { useField } from "remix-validated-form";

type FormInputProps = InputProps & {
  name: string;
  label?: string;
  isRequired?: boolean;
  helperText?: string;
};

const Input = forwardRef<HTMLInputElement, FormInputProps>(
  ({ name, label, isRequired, helperText, ...rest }, ref) => {
    const { getInputProps, error } = useField(name);

    return (
      <FormControl isInvalid={!!error} isRequired={isRequired}>
        {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
        <ChakraInput
          ref={ref}
          {...getInputProps({
            id: name,
            ...rest,
          })}
        />
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  }
);

Input.displayName = "Input";

export default Input;
