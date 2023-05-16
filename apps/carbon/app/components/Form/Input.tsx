import type { InputProps } from "@chakra-ui/react";
import { InputLeftAddon } from "@chakra-ui/react";
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input as ChakraInput,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { forwardRef } from "react";
import { useField } from "remix-validated-form";

type FormInputProps = InputProps & {
  name: string;
  label?: string;
  isRequired?: boolean;
  helperText?: string;
  prefix?: string;
  suffix?: string;
};

const Input = forwardRef<HTMLInputElement, FormInputProps>(
  ({ name, label, isRequired, helperText, prefix, suffix, ...rest }, ref) => {
    const { getInputProps, error } = useField(name);

    return (
      <FormControl isInvalid={!!error} isRequired={isRequired}>
        {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
        <InputGroup>
          {prefix && <InputLeftAddon children={prefix} />}
          <ChakraInput
            ref={ref}
            {...getInputProps({
              id: name,
              ...rest,
            })}
          />
          {suffix && <InputRightAddon children={suffix} />}
        </InputGroup>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  }
);

Input.displayName = "Input";

export default Input;
