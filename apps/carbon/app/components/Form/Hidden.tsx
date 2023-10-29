import type { InputProps } from "@chakra-ui/react";
import {
  Input as ChakraInput,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { forwardRef } from "react";
import { useField } from "remix-validated-form";

type HiddenProps = InputProps & {
  name: string;
  value?: string | number;
};

const Hidden = forwardRef<HTMLInputElement, HiddenProps>(
  ({ name, value, ...rest }, ref) => {
    const { getInputProps, error } = useField(name);

    return (
      <FormControl isInvalid={!!error}>
        <ChakraInput
          ref={ref}
          {...getInputProps({
            id: name,
            ...rest,
          })}
          value={value}
          type="hidden"
        />
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  }
);

Hidden.displayName = "Hidden";

export default Hidden;
