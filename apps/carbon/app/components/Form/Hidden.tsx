import type { InputProps } from "@chakra-ui/react";
import {
  FormControl,
  FormErrorMessage,
  Input as ChakraInput,
} from "@chakra-ui/react";
import { forwardRef } from "react";
import { useField } from "remix-validated-form";

type FormHiddenProps = InputProps & {
  name: string;
  value?: string | number;
};

const Hidden = forwardRef<HTMLInputElement, FormHiddenProps>(
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
