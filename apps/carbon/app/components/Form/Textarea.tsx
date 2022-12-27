import type { TextareaProps } from "@chakra-ui/react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
  Textarea as ChakraTextArea,
} from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { forwardRef, useState } from "react";
import { useField } from "remix-validated-form";

type FormTextArea = TextareaProps & {
  name: string;
  label?: string;
  characterLimit?: number;
  isRequired?: boolean;
};

const TextArea = forwardRef<HTMLTextAreaElement, FormTextArea>(
  ({ name, label, characterLimit, isRequired, ...rest }, ref) => {
    const { getInputProps, error, defaultValue } = useField(name);
    const [characterCount, setCharacterCount] = useState(
      defaultValue?.length ?? 0
    );

    const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      if (characterLimit) setCharacterCount(e.target.value.length);
    };

    return (
      <FormControl isInvalid={!!error} isRequired={isRequired}>
        {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
        <ChakraTextArea
          ref={ref}
          {...getInputProps({
            id: name,
            ...rest,
          })}
          maxLength={characterLimit}
          onChange={onChange}
        />
        {characterLimit && (
          <Text fontSize="sm" color="gray.500">
            {characterCount} of {characterLimit}
          </Text>
        )}
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
