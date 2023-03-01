import { Editor } from "@carbon/react";
import type { BoxProps } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { FormControl, FormErrorMessage } from "@chakra-ui/react";
import { useControlField, useField } from "remix-validated-form";

type RichTextProps = BoxProps & {
  name: string;
  output?: "html" | "json" | "text";
};

const RichText = ({ name, output = "html", ...props }: RichTextProps) => {
  const { getInputProps, error, defaultValue } = useField(name);
  const [value, setValue] = useControlField<string>(name);

  return (
    <FormControl isInvalid={!!error}>
      <Editor
        content={defaultValue}
        onChange={setValue}
        output={output}
        {...props}
      />
      <Input
        {...getInputProps({
          // @ts-ignore
          id: name,
        })}
        value={value}
        type="hidden"
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default RichText;
