import type { InputProps } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { HStack } from "@chakra-ui/react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
} from "@chakra-ui/react";
import { forwardRef } from "react";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { useField, useFieldArray } from "remix-validated-form";

type FormArrayProps = InputProps & {
  name: string;
  label?: string;
  isRequired?: boolean;
};

const Array = forwardRef<HTMLInputElement, FormArrayProps>(
  ({ name, label, isRequired, ...rest }, ref) => {
    const [items, { push, remove }, error] = useFieldArray<string>(name);

    return (
      <FormControl isInvalid={!!error} isRequired={isRequired}>
        {label && <FormLabel htmlFor={`${name}`}>{label}</FormLabel>}
        <VStack alignItems="start" spacing={2} w="full" mb={4}>
          {items.map((item, index) => (
            <ArrayInput
              key={`${item}-${index}`}
              id={`${name}[${index}]`}
              name={`${name}[${index}]`}
              ref={index === 0 ? ref : undefined}
              onRemove={() => remove(index)}
              {...rest}
            />
          ))}
          <Button leftIcon={<IoMdAdd />} onClick={() => push("")}>
            New Option
          </Button>
        </VStack>
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  }
);

Array.displayName = "Array";

type ArrayInputProps = InputProps & {
  name: string;
  onRemove: () => void;
};

const ArrayInput = forwardRef<HTMLInputElement, ArrayInputProps>(
  ({ name, onRemove, ...rest }, ref) => {
    const { getInputProps, error } = useField(name);

    return (
      <FormControl isInvalid={!!error} isRequired>
        <HStack w="full" alignContent="space-between">
          <ChakraInput
            ref={ref}
            {...getInputProps({
              id: name,
              ...rest,
            })}
          />
          <IconButton
            aria-label="Remove item"
            icon={<IoMdClose />}
            onClick={onRemove}
            variant="ghost"
          />
        </HStack>

        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  }
);

ArrayInput.displayName = "ArrayInput";

export default Array;
